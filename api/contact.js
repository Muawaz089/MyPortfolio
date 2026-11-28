const TYPES = new Set([
  'Landing Page Design',
  'Website Debugging',
  'Excel Cleanup',
  'Word / PDF Formatting',
  'Something else'
]);

function plain(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

function check(req) {
  const body = req.body || {};
  const name = plain(body.name);
  const email = plain(body.email);
  const type = plain(body.type);
  const budget = plain(body.budget);
  const message = String(body.message ?? '').trim();

  if (!name || name.length > 80) return { error: 'Enter your name (max 80 characters).' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: 'Enter a valid email address.' };
  if (!TYPES.has(type)) return { error: 'Pick a valid project type.' };
  if (message.length < 10 || message.length > 2000) return { error: 'Message must be between 10 and 2000 characters.' };

  return { name, email, type, budget: budget.slice(0, 40), message };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Use POST for this endpoint.' });
  }

  const data = check(req);
  if (data.error) return res.status(400).json({ ok: false, message: data.error });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is missing');
    return res.status(500).json({ ok: false, message: 'Email is not configured yet. Please email mavizm233@gmail.com directly.' });
  }

  const to = process.env.CONTACT_TO_EMAIL || 'mavizm233@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Project type: ${data.type}`,
    data.budget ? `Budget: PKR ${data.budget}` : '',
    '',
    'Message:',
    data.message
  ].filter((line) => line !== undefined).join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;color:#1A1614">
      <h2>New portfolio message</h2>
      <p><b>Name:</b> ${escapeHtml(data.name)}</p>
      <p><b>Email:</b> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
      <p><b>Project type:</b> ${escapeHtml(data.type)}</p>
      ${data.budget ? `<p><b>Budget:</b> PKR ${escapeHtml(data.budget)}</p>` : ''}
      <hr />
      <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
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
        subject: `[Portfolio] ${data.type} — ${data.name}`,
        text,
        html
      }),
      signal: AbortSignal.timeout(10000)
    });

    const out = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error(`[contact] Resend ${response.status}:`, out.message || out);
      return res.status(502).json({ ok: false, message: 'Delivery failed right now. Please email mavizm233@gmail.com directly.' });
    }

    console.log(`[contact] delivered from ${data.email} (${data.type})`);
    return res.status(200).json({ ok: true, message: 'Message sent.' });
  } catch (err) {
    console.error('[contact]', err.message);
    return res.status(502).json({ ok: false, message: 'Delivery failed right now. Please email mavizm233@gmail.com directly.' });
  }
}
