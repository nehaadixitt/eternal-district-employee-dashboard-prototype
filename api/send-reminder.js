export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { merchantName, contactName, email, phone, reminderNum, channels } = req.body

  const results = {}

  if (channels.includes('Email')) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MerchantFlow <onboarding@resend.dev>',
        to: [process.env.TEST_EMAIL || email],
        subject: `Action Required: Sign your onboarding contract — ${merchantName}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111827">
            <h2 style="margin:0 0 8px">Contract Signature Required</h2>
            <p style="color:#6b7280;margin:0 0 24px">Reminder #${reminderNum}</p>
            <p>Hi ${contactName},</p>
            <p>This is a reminder to complete the digital signature for your onboarding contract with us.</p>
            <p>Please sign at your earliest convenience to proceed with your account activation.</p>
            <p style="margin-top:32px;color:#9ca3af;font-size:13px">— MerchantFlow Onboarding Team</p>
          </div>
        `,
      }),
    })
    results.email = r.ok ? 'sent' : 'failed'
  }

  res.status(200).json({ ok: true, results })
}
