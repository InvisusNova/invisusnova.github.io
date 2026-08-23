/* Contact Form → Google Sheets */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Replace this URL with your deployed Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = {
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      subject: form.querySelector('[name="subject"]').value,
      message: form.querySelector('[name="message"]').value,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      window.showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
    } catch (error) {
      window.showToast('Failed to send message. Please try again or email us directly.', 'error');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
});

/*
========================================
GOOGLE APPS SCRIPT SETUP INSTRUCTIONS
========================================

1. Go to https://script.google.com
2. Create a new project
3. Paste this code:

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.subject,
    data.message
  ]);
  return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}

4. Link it to a Google Sheet (Extensions → Apps Script)
5. Deploy → New Deployment → Web App → Anyone can access
6. Copy the URL and paste it in GOOGLE_SCRIPT_URL above

========================================
*/
