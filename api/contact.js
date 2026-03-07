// api/contact.js — Vercel serverless function
// Sends contact form submissions to Anastasiia's email via Resend.
// Required env var: RESEND_API_KEY (set in Vercel dashboard → Settings → Environment Variables)

const TO_EMAIL   = 'budkoanastasia08@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const { firstName, lastName, email, phone, interest, message } = req.body ?? {};

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const subject = `New Enquiry: ${interest || 'General'} — ${firstName} ${lastName || ''}`.trim();

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1c1b1a;">
      <div style="border-bottom:2px solid #C9A55A;padding-bottom:16px;margin-bottom:24px;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A55A;margin:0;">
          New enquiry via anastasiia-lykhosherstova.com
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.8;">
        <tr>
          <td style="padding:8px 0;color:#666;width:120px;vertical-align:top;">Name</td>
          <td style="padding:8px 0;font-weight:bold;">${firstName} ${lastName || ''}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;vertical-align:top;">Email</td>
          <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#C9A55A;">${email}</a></td>
        </tr>
        ${phone ? `<tr>
          <td style="padding:8px 0;color:#666;vertical-align:top;">Phone</td>
          <td style="padding:8px 0;">${phone}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:8px 0;color:#666;vertical-align:top;">Interested in</td>
          <td style="padding:8px 0;">${interest || 'Not specified'}</td>
        </tr>
      </table>

      <div style="margin-top:24px;padding:20px;background:#f7f3ec;border-left:3px solid #C9A55A;">
        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#999;margin:0 0 12px;">Message</p>
        <p style="margin:0;font-size:15px;line-height:1.75;white-space:pre-wrap;">${message}</p>
      </div>

      <p style="margin-top:24px;font-size:11px;color:#aaa;">
        Reply directly to this email to respond to ${firstName}.
      </p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Anastasiia's Website <${FROM_EMAIL}>`,
        to:   [TO_EMAIL],
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(502).json({ error: err.message || 'Email delivery failed' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
