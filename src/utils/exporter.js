import { toPng } from 'html-to-image';

export const exportToPng = async (elementId, filename = 'whatswrap-card') => {
  const node = document.getElementById(elementId);
  if (!node) return;

  // Create an offscreen wrapper container to prevent viewport-based clipping
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '9999px';
  wrapper.style.top = '0';
  wrapper.style.width = '580px';
  wrapper.style.zIndex = '-9999';

  // Clone the element and clean its layouts
  const clone = node.cloneNode(true);
  clone.style.setProperty('width', '580px', 'important');
  clone.style.setProperty('max-width', '580px', 'important');
  clone.style.setProperty('box-sizing', 'border-box', 'important');
  clone.style.setProperty('margin', '0', 'important');
  clone.style.setProperty('position', 'relative', 'important');
  clone.style.setProperty('padding', '24px 24px 60px 24px', 'important'); // extra padding-bottom to clear watermark space
  clone.style.setProperty('background', '#e0e5e9', 'important');
  clone.style.setProperty('border-radius', '24px', 'important');

  // Hide buttons with .export-btn class inside the clone
  const buttons = clone.querySelectorAll('.export-btn');
  buttons.forEach(btn => btn.style.setProperty('display', 'none', 'important'));

  // Inject watermark at bottom right of the clone
  const watermark = document.createElement('div');
  watermark.innerText = 'whatsupwrap.netlify.app';
  watermark.style.position = 'absolute';
  watermark.style.bottom = '16px';
  watermark.style.right = '24px';
  watermark.style.fontSize = '10px';
  watermark.style.fontWeight = '700';
  watermark.style.fontFamily = 'var(--font-heading)';
  watermark.style.color = '#708492';
  watermark.style.opacity = '0.75';
  watermark.style.pointerEvents = 'none';
  watermark.style.zIndex = '9999';
  clone.appendChild(watermark);

  // Append elements to DOM for layout engine processing
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // Create high-res screenshot from the clean offscreen clone
    const dataUrl = await toPng(clone, {
      backgroundColor: '#e0e5e9',
      quality: 0.98,
      pixelRatio: 2.5, // Crisp 2.5x density for crystal-clear sharing!
    });

    // Create clean download link
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
  } finally {
    // Clean up offscreen nodes
    document.body.removeChild(wrapper);
  }
};
