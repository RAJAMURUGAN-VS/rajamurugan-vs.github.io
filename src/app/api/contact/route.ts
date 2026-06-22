import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { message, from_email } = await req.json()

    if (!message?.trim() || !from_email?.trim()) {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: from_email.trim(),
      subject: `New message from ${from_email.trim()}`,
      text: message.trim(),
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0d0d0d;color:#f2f2f2;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
          <p style="font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6EE7F7;margin:0 0 8px">New Portfolio Message</p>
          <h2 style="margin:0 0 20px;font-size:22px;color:#f2f2f2">From: ${from_email.trim()}</h2>
          <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;font-size:15px;line-height:1.7;color:#cccccc;white-space:pre-wrap">${message.trim()}</div>
          <p style="margin:20px 0 0;font-size:12px;color:#444">Reply directly to this email to respond to ${from_email.trim()}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] send error:', err)
    return NextResponse.json({ error: 'Failed to send.' }, { status: 500 })
  }
}
