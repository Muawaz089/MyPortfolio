function plain(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function check(req) {
  const body = req.body || {};
  const name = plain(body.name);
  const email = plain(body.email);
  const subject = plain(body.subject);
  const message = String(body.message ?? '').trim();

  if (!name || name.length > 80) return { error: 'Name is required (max 80 characters).' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: 'A valid email address is required.' };
  if (!subject || subject.length > 120) return { error: 'Subject is required (max 120 characters).' };
  if (message.length < 10 || message.length > 2000) return { error: 'Message must be at least 10 characters long.' };

  return { name, email, subject, message };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Use POST for this endpoint.' });
  }

  const data = check(req);
  if (data.error) return res.status(400).json({ success: false, message: data.error });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is missing');
    return res.status(500).json({ success: false, message: 'Email is not configured yet.' });
  }

  const to = process.env.CONTACT_TO_EMAIL || 'mavizm233@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  const text = `From: ${data.name} (${data.email})\nSubject: ${data.subject}\n\nMessage:\n${data.message}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #BF0C2F;">New Contact Form Message</h2>
      <p><strong>From:</strong> ${escapeHtml(data.name)} (&lt;<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>&gt;)</p>
      <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${escapeHtml(data.message)}</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `[Portfolio Contact] ${data.subject}`,
        text,
        html
      }),
      signal: AbortSignal.timeout(10000)
    });

    const out = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error(`[contact] Resend ${response.status}:`, out.message || out);
      return res.status(502).json({ success: false, message: 'The message could not be emailed right now. Please try again later.' });
    }

    console.log(`[contact] delivered from ${data.name} <${data.email}>`);
    return res.status(200).json({ success: true, sent: true, message: 'Message sent.' });
  } catch (err) {
    console.error('[contact]', err.message);
    return res.status(502).json({ success: false, message: 'The message could not be emailed right now. Please try again later.' });
  }
}
