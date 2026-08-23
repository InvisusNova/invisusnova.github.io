/* Color Palette Generator Logic */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('palette-container');
  const randomizeBtn = document.getElementById('randomize-btn');
  const exportCssBtn = document.getElementById('export-css-btn');

  let colors = [
    { hex: '#0066FF', locked: false },
    { hex: '#7C3AED', locked: false },
    { hex: '#3FB950', locked: false },
    { hex: '#FF9800', locked: false },
    { hex: '#0A0A0A', locked: false }
  ];

  function getRandomHex() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function renderPalette() {
    container.innerHTML = '';
    colors.forEach((c, index) => {
      const swatch = document.createElement('div');
      swatch.className = 'palette-swatch';
      swatch.style.background = c.hex;

      const hexLabel = document.createElement('span');
      hexLabel.textContent = c.hex;

      const lockBtn = document.createElement('button');
      lockBtn.className = 'lock-btn';
      lockBtn.textContent = c.locked ? '🔒' : '🔓';
      lockBtn.title = c.locked ? 'Unlock color' : 'Lock color';
      lockBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        c.locked = !c.locked;
        lockBtn.textContent = c.locked ? '🔒' : '🔓';
        lockBtn.style.opacity = c.locked ? '1' : '';
      });

      if (c.locked) {
        lockBtn.style.opacity = '1';
      }

      swatch.appendChild(lockBtn);
      swatch.appendChild(hexLabel);

      swatch.addEventListener('click', () => {
        navigator.clipboard.writeText(c.hex).then(() => {
          window.showToast(`Copied ${c.hex} to clipboard!`, 'success');
        });
      });

      container.appendChild(swatch);
    });
  }

  function generateNewPalette() {
    colors.forEach(c => {
      if (!c.locked) {
        c.hex = getRandomHex();
      }
    });
    renderPalette();
  }

  randomizeBtn.addEventListener('click', generateNewPalette);

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      generateNewPalette();
    }
  });

  exportCssBtn.addEventListener('click', () => {
    const cssVars = colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n');
    const fullCss = `:root {\n${cssVars}\n}`;
    navigator.clipboard.writeText(fullCss).then(() => {
      window.showToast('CSS Variables copied to clipboard!', 'success');
    });
  });

  renderPalette();
});
