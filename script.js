(() => {
  const $ = (selector) => document.querySelector(selector);
  const encryptForm = $('#encrypt-form');
  const decryptForm = $('#decrypt-form');
  const toast = $('#toast');
  const toastMessage = $('#toast-message');
  let toastTimer;

  function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.classList.toggle('error', type === 'error');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function validateKeyMaterial(key, iv) {
    if ([...key].length !== 8 || [...iv].length !== 8) {
      throw new Error('The secret key and IV must each contain exactly 8 characters.');
    }
  }

  function encrypt(plaintext, key, iv) {
    validateKeyMaterial(key, iv);
    if (!plaintext) throw new Error('Enter plaintext before encrypting.');
    const encrypted = CryptoJS.DES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  function decrypt(ciphertext, key, iv) {
    validateKeyMaterial(key, iv);
    if (!ciphertext.trim()) throw new Error('Enter Base64 ciphertext before decrypting.');
    const decrypted = CryptoJS.DES.decrypt(ciphertext.trim(), CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    if (!plaintext && ciphertext.trim()) throw new Error('Unable to decrypt. Check the ciphertext, key, and IV.');
    return plaintext;
  }

  function setOutput(id, value) {
    const output = document.getElementById(id);
    output.textContent = value;
    output.classList.remove('empty');
    document.querySelector(`[data-copy="${id}"]`).disabled = false;
  }

  function handleForm(form, action) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        if (action === 'encrypt') {
          const result = encrypt($('#encrypt-text').value, $('#encrypt-key').value, $('#encrypt-iv').value);
          setOutput('encrypt-output', result);
          $('#decrypt-text').value = result;
          showToast('Message encrypted successfully.');
        } else {
          const result = decrypt($('#decrypt-text').value, $('#decrypt-key').value, $('#decrypt-iv').value);
          setOutput('decrypt-output', result);
          showToast('Message decrypted successfully.');
        }
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }

  function resetWorkspace() {
    $('#encrypt-text').value = 'HELLO WORLD';
    $('#encrypt-key').value = '12345678';
    $('#encrypt-iv').value = '12345678';
    $('#decrypt-text').value = '';
    $('#decrypt-key').value = '12345678';
    $('#decrypt-iv').value = '12345678';
    document.querySelectorAll('.output-value').forEach((output) => {
      output.textContent = output.id === 'encrypt-output' ? 'Your ciphertext will appear here' : 'Your plaintext will appear here';
      output.classList.add('empty');
    });
    document.querySelectorAll('.copy-button').forEach((button) => { button.disabled = true; });
    updateCounts();
  }

  function updateCounts() {
    document.querySelectorAll('.char-count').forEach((counter) => {
      const field = document.getElementById(counter.dataset.countFor);
      counter.textContent = `${[...field.value].length}/8`;
      counter.style.color = [...field.value].length === 8 ? 'var(--teal)' : 'var(--orange)';
    });
  }

  handleForm(encryptForm, 'encrypt');
  handleForm(decryptForm, 'decrypt');
  $('#clear-all').addEventListener('click', () => { resetWorkspace(); showToast('Workspace cleared.'); });
  $('#use-sample').addEventListener('click', () => { resetWorkspace(); showToast('Sample values restored.'); });
  document.querySelectorAll('input[maxlength="8"]').forEach((input) => input.addEventListener('input', updateCounts));
  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = document.getElementById(button.dataset.copy).textContent;
      try {
        await navigator.clipboard.writeText(value);
        showToast('Output copied to clipboard.');
      } catch {
        showToast('Clipboard access is unavailable in this browser.', 'error');
      }
    });
  });

  document.querySelectorAll('.process-step').forEach((step) => step.addEventListener('click', () => {
    document.querySelectorAll('.process-step').forEach((item) => item.classList.remove('active'));
    step.classList.add('active');
  }));

  const menuToggle = $('.menu-toggle');
  const nav = $('.main-nav');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  updateCounts();
})();
