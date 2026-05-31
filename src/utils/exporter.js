import html2canvas from 'html2canvas';

/**
 * Maps gradient CSS class names → a solid fallback colour for html2canvas.
 * html2canvas cannot render background-clip:text so we swap in solid colours.
 */
const GRAD_COLOR = {
  'grad-primary-text':   '#004e64',
  'grad-secondary-text': '#0077b6',
  'grad-emerald-text':   '#00a896',
  'grad-sunset-text':    '#e65100',
  'grad-gold-text':      '#b57c00',
  'grad-pink-text':      '#d81b60',
  'grad-aurora-text':    '#004e64',
};

/**
 * Walk the cloned document and patch every element that uses
 * CSS gradient-text (background-clip:text / -webkit-text-fill-color:transparent)
 * so that html2canvas renders them as a plain solid colour instead of
 * showing a coloured rectangle with invisible text.
 */
function fixGradientText(doc) {
  doc.querySelectorAll('.gradient-text').forEach(el => {
    let color = '#004e64'; // default fallback
    for (const [cls, col] of Object.entries(GRAD_COLOR)) {
      if (el.classList.contains(cls)) { color = col; break; }
    }
    // Remove the gradient background trick
    el.style.setProperty('background-image', 'none',   'important');
    el.style.setProperty('background',       'none',   'important');
    el.style.setProperty('background-clip',  'unset',  'important');
    el.style.setProperty('-webkit-background-clip', 'unset', 'important');
    // Restore visible text with solid colour
    el.style.setProperty('-webkit-text-fill-color', color, 'important');
    el.style.setProperty('color', color, 'important');
  });

  // Fix any brand/logo gradient text too
  doc.querySelectorAll('.sidenav-brand-text, .grad-aurora-text').forEach(el => {
    el.style.setProperty('background-image', 'none',   'important');
    el.style.setProperty('background',       'none',   'important');
    el.style.setProperty('-webkit-background-clip', 'unset', 'important');
    el.style.setProperty('-webkit-text-fill-color', '#004e64', 'important');
    el.style.setProperty('color', '#004e64', 'important');
  });
}

/**
 * Exports a DOM element to a PNG file using html2canvas.
 *
 * @param {string} elementId  - ID of the element to capture
 * @param {string} filename   - Output filename (without .png)
 */
export const exportToPng = async (elementId, filename = 'whatswrap-card') => {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`[exportToPng] Element #${elementId} not found.`);
    return;
  }

  // Hide export buttons before capture
  const exportBtns = node.querySelectorAll('.export-btn');
  exportBtns.forEach(btn => (btn.style.display = 'none'));

  try {
    // Ensure web fonts are loaded
    await document.fonts.ready;

    const canvas = await html2canvas(node, {
      backgroundColor:  '#e0e5e9',
      scale:             2,            // 2× for retina sharpness
      useCORS:           true,
      allowTaint:        false,
      logging:           false,
      scrollX:           0,
      scrollY:           0,
      // Use the actual viewport width so vw/clamp() units match the screen
      windowWidth:       window.innerWidth,
      windowHeight:      window.innerHeight,

      onclone: (_clonedDoc, clonedEl) => {
        // Fix gradient text before html2canvas touches the canvas
        fixGradientText(_clonedDoc);

        // Ensure every stat value div with overflow:hidden shows ellipsis
        // by forcing text-overflow to ellipsis on overflowing text nodes
        _clonedDoc.querySelectorAll('[style*="text-overflow"]').forEach(el => {
          el.style.setProperty('text-overflow', 'ellipsis', 'important');
        });

        // Kill all CSS animations / transitions so nothing is mid-frame
        _clonedDoc.querySelectorAll('*').forEach(el => {
          el.style.animation       = 'none';
          el.style.transition      = 'none';
          el.style.animationDelay  = '0s';
        });
      },
    });

    // ── Composite onto a padded canvas with watermark ─────────────────────────
    const MARGIN = 32;   // px padding around the card (at 1× — doubled for DPR)
    const WM_H   = 28;   // extra bottom space for watermark
    const DPR    = 2;    // must match scale above

    const outW = canvas.width  + MARGIN * 2 * DPR;
    const outH = canvas.height + MARGIN * 2 * DPR + WM_H * DPR;

    const out = document.createElement('canvas');
    out.width  = outW;
    out.height = outH;

    const ctx = out.getContext('2d');

    // Fill background
    ctx.fillStyle = '#e0e5e9';
    ctx.fillRect(0, 0, outW, outH);

    // Draw the captured card with margin
    ctx.drawImage(canvas, MARGIN * DPR, MARGIN * DPR);

    // ── Watermark ─────────────────────────────────────────────────────────────
    ctx.font         = `700 ${11 * DPR}px 'Outfit', system-ui, sans-serif`;
    ctx.fillStyle    = '#708492';
    ctx.globalAlpha  = 0.75;
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      'whatsupwrap.netlify.app',
      outW - MARGIN * DPR,
      canvas.height + MARGIN * 2 * DPR + (WM_H * DPR) / 2
    );
    ctx.globalAlpha = 1;

    // ── Download ──────────────────────────────────────────────────────────────
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = out.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (err) {
    console.error('[exportToPng] Failed:', err);
    alert('Export failed — check the browser console for details.');
  } finally {
    // Restore export buttons
    exportBtns.forEach(btn => (btn.style.display = ''));
  }
};
