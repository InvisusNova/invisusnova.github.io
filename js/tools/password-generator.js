/* Password Generator Logic */
document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('password-output');
  const copyBtn = document.getElementById('copy-btn');
  const generateBtn = document.getElementById('generate-btn');
  const lengthSlider = document.getElementById('length-slider');
  const lengthVal = document.getElementById('length-val');
  const upperCb = document.getElementById('include-upper');
  const lowerCb = document.getElementById('include-lower');
  const numbersCb = document.getElementById('include-numbers');
  const symbolsCb = document.getElementById('include-symbols');
  const strengthBar = document.getElementById('strength-bar');
  const strengthLabel = document.getElementById('strength-label');

  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  function generatePassword() {
    let charset = '';
    if (upperCb.checked) charset += UPPER;
    if (lowerCb.checked) charset += LOWER;
    if (numbersCb.checked) charset += NUMBERS;
    if (symbolsCb.checked) charset += SYMBOLS;

    if (charset === '') {
      output.textContent = 'Please select at least one character type';
      return;
    }

    const length = parseInt(lengthSlider.value);
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }

    output.textContent = password;
    evaluateStrength(password);
  }

  function evaluateStrength(pwd) {
    let score = 0;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 20) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      strengthBar.style.width = '33%';
      strengthBar.style.background = '#F85149';
      strengthLabel.textContent = 'Weak';
      strengthLabel.style.color = '#F85149';
    } else if (score <= 4) {
      strengthBar.style.width = '66%';
      strengthBar.style.background = '#FF9800';
      strengthLabel.textContent = 'Good';
      strengthLabel.style.color = '#FF9800';
    } else {
      strengthBar.style.width = '100%';
      strengthBar.style.background = '#3FB950';
      strengthLabel.textContent = 'Unbreakable';
      strengthLabel.style.color = '#3FB950';
    }
  }

  lengthSlider.addEventListener('input', () => {
    lengthVal.textContent = lengthSlider.value;
    generatePassword();
  });

  [upperCb, lowerCb, numbersCb, symbolsCb].forEach(cb => {
    cb.addEventListener('change', generatePassword);
  });

  generateBtn.addEventListener('click', generatePassword);

  copyBtn.addEventListener('click', () => {
    const text = output.textContent;
    if (text && text !== 'Click Generate' && text !== 'Please select at least one character type') {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast('Password copied to clipboard!', 'success');
      });
    }
  });

  // Initial generation
  generatePassword();
});
