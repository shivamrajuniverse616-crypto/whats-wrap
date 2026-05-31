import { toPng } from 'html-to-image';

export const exportToPng = async (elementId, filename = 'whatswrap-card') => {
  const node = document.getElementById(elementId);
  if (!node) return;
  try {
    // Temporarily hide buttons with .export-btn class inside the element
    const buttons = node.querySelectorAll('.export-btn');
    buttons.forEach(btn => btn.style.setProperty('display', 'none', 'important'));

    // Inject watermark at bottom right of the node
    const watermark = document.createElement('div');
    watermark.innerText = 'whatsupwrap.netlify.app';
    watermark.style.position = 'absolute';
    watermark.style.bottom = '12px';
    watermark.style.right = '20px';
    watermark.style.fontSize = '10px';
    watermark.style.fontWeight = '700';
    watermark.style.fontFamily = 'var(--font-heading)';
    watermark.style.color = 'var(--on-surface-mute)';
    watermark.style.opacity = '0.75';
    watermark.style.pointerEvents = 'none';
    watermark.style.zIndex = '9999';
    node.appendChild(watermark);

    // Create high-res screenshot
    const dataUrl = await toPng(node, {
      backgroundColor: 'var(--bg-base)',
      style: {
        borderRadius: '24px',
        padding: '24px 24px 36px 24px', // extra padding-bottom to clear watermark space
      },
      quality: 0.98,
      pixelRatio: 2.5, // Crisp 2.5x density for crystal-clear sharing!
    });

    // Remove watermark and restore buttons
    node.removeChild(watermark);
    buttons.forEach(btn => btn.style.removeProperty('display'));

    // Create clean download link
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
  }
};
