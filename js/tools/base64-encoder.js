/* Base64 & URL Encoder/Decoder Logic */
document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('text-input');
  const textOutput = document.getElementById('text-output');
  const charCount = document.getElementById('input-char-count');
  const copyBtn = document.getElementById('copy-output-btn');
  const buttons = {
    'base64-encode': document.getElementById('mode-base64-encode'),
    'base64-decode': document.getElementById('mode-base64-decode'),
    'url-encode': document.getElementById('mode-url-encode'),
    'url-decode': document.getElementById('mode-url-decode')
  };

  let currentMode = 'base64-encode';

  function processText() {
    const val = textInput.value;
    charCount.textContent = `${val.length} chars`;

    if (!val) {
      textOutput.value = '';
      return;
    }

    try {
      switch (currentMode) {
        case 'base64-encode':
          textOutput.value = btoa(unescape(encodeURIComponent(val)));
          break;
        case 'base64-decode':
          textOutput.value = decodeURIComponent(escape(atob(val)));
          break;
        case 'url-encode':
          textOutput.value = encodeURIComponent(val);
          break;
        case 'url-decode':
          textOutput.value = decodeURIComponent(val);
          break;
      }
    } catch (e) {
      textOutput.value = `[Error: Invalid input for ${currentMode}]`;
    }
  }

  Object.entries(buttons).forEach(([mode, btn]) => {
    btn.addEventListener('click', () => {
      Object.values(buttons).forEach(b => {
        b.className = 'btn btn-secondary';
      });
      btn.className = 'btn btn-primary';
      currentMode = mode;
      processText();
    });
  });

  textInput.addEventListener('input', processText);

  copyBtn.addEventListener('click', () => {
    if (textOutput.value && !textOutput.value.startsWith('[Error')) {
      navigator.clipboard.writeText(textOutput.value).then(() => {
        window.showToast('Result copied to clipboard!', 'success');
      });
    }
  });
});
