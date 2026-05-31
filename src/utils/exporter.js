import { toPng } from 'html-to-image';

export const exportToPng = async (elementId, filename = 'whatswrap-card') => {
  const node = document.getElementById(elementId);
  if (!node) return;
  try {
    // Temporarily hide buttons with .export-btn class inside the element
    const buttons = node.querySelectorAll('.export-btn');
    buttons.forEach(btn => btn.style.setProperty('display', 'none', 'important'));

    // Create high-res screenshot
    const dataUrl = await toPng(node, {
      backgroundColor: 'var(--bg-base)',
      style: {
        borderRadius: '24px',
        padding: '24px',
      },
      quality: 0.98,
      pixelRatio: 2.5, // Crisp 2.5x density for crystal-clear sharing!
    });

    // Restore buttons
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
