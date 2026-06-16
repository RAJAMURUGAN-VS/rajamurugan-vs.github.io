import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// ─── Rate limiting (in-memory, per-process) ───────────────────────────────────
// Prevents abuse — max 5 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

// ─── Input validation ─────────────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, '').trim().slice(0, 2000)
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse body
    const body = await req.json()
    const senderEmail = sanitize(body?.senderEmail ?? '')
    const message = sanitize(body?.message ?? '')

    // Validate
    if (!senderEmail || !isValidEmail(senderEmail)) {
      return NextResponse.json({ error: 'Invalid sender email address.' }, { status: 400 })
    }
    if (!message || message.length < 3) {
      return NextResponse.json({ error: 'Message is too short.' }, { status: 400 })
    }

    // Check env vars
    const gmailUser = process.env.GMAIL_USER
    const gmailPass = process.env.GMAIL_APP_PASSWORD
    const contactTo = process.env.CONTACT_TO ?? gmailUser

    if (!gmailUser || !gmailPass) {
      console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars')
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    })

    // Send email
    await transporter.sendMail({
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: contactTo,
      replyTo: senderEmail,
      subject: `New message from ${senderEmail}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0f0f0f;padding:32px;border-radius:12px;border:1px solid #222">
          <h2 style="color:#6EE7F7;margin:0 0 8px;font-size:18px;letter-spacing:0.05em">New Portfolio Message</h2>
          <p style="color:#555;font-size:12px;margin:0 0 24px;font-family:monospace">Sent via rajamuruganvs.dev contact form</p>

          <div style="background:#161616;border-radius:8px;padding:20px;border:1px solid #1e1e1e;margin-bottom:20px">
            <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 8px;font-family:monospace">Message</p>
            <p style="color:#f2f2f2;font-size:15px;line-height:1.7;margin:0">${message}</p>
          </div>

          <div style="background:#161616;border-radius:8px;padding:16px;border:1px solid #1e1e1e">
            <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 6px;font-family:monospace">From</p>
            <a href="mailto:${senderEmail}" style="color:#6EE7F7;font-size:14px;text-decoration:none">${senderEmail}</a>
          </div>

          <p style="color:#333;font-size:11px;margin:24px 0 0;font-family:monospace">
            Reply directly to this email to respond to ${senderEmail}
          </p>
        </div>
      `,
      text: `New message from: ${senderEmail}\n\n${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
