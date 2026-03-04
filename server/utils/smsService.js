// Simple SMS/email mock sender. In production replace with Twilio or other provider.
export const sendSms = async (phone, message) => {
  // If TWILIO env configured, you could integrate here. For now, log to console.
  console.log(`>> SMS from 9025200383 to ${phone}: ${message}`)
  return { ok: true }
}

export const sendEmail = async (to, subject, text) => {
  // Only attempt to use nodemailer when SMTP config is provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({ from: 'satheeshkanna888@gmail.com', to, subject, text })
      return { ok: true }
    } catch (err) {
      console.error('Failed to send email via SMTP:', err)
    }
  }

  console.log(`>> Email from satheeshkanna888@gmail.com to ${to}: ${subject} - ${text}`)
  return { ok: true }
}
