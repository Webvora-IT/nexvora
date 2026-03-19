import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendContactNotification(data: {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return

  await transporter.sendMail({
    from: `"Nexvora" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || 'admin@nexvora.com',
    subject: `Nouveau message de ${data.name} — Nexvora`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a14; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #22d3ee); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Nouveau contact — Nexvora</h1>
        </div>
        <div style="padding: 32px; background: #111827;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #9ca3af; font-size: 13px; width: 120px;">Nom</td><td style="padding: 8px 0; color: #fff; font-weight: 600;">${data.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af; font-size: 13px;">Email</td><td style="padding: 8px 0; color: #22d3ee;">${data.email}</td></tr>
            ${data.phone ? `<tr><td style="padding: 8px 0; color: #9ca3af; font-size: 13px;">Téléphone</td><td style="padding: 8px 0; color: #fff;">${data.phone}</td></tr>` : ''}
            ${data.company ? `<tr><td style="padding: 8px 0; color: #9ca3af; font-size: 13px;">Entreprise</td><td style="padding: 8px 0; color: #fff;">${data.company}</td></tr>` : ''}
            ${data.service ? `<tr><td style="padding: 8px 0; color: #9ca3af; font-size: 13px;">Service</td><td style="padding: 8px 0; color: #6366f1; font-weight: 600;">${data.service}</td></tr>` : ''}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #6366f1;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px; margin-bottom: 8px;">MESSAGE</p>
            <p style="margin: 0; color: #e5e7eb; line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/contacts" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #6366f1, #22d3ee); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
              Voir dans l'admin
            </a>
          </div>
        </div>
        <div style="padding: 16px 32px; background: #0a0a14; text-align: center;">
          <p style="margin: 0; color: #4b5563; font-size: 12px;">© ${new Date().getFullYear()} Nexvora. Tous droits réservés.</p>
        </div>
      </div>
    `,
  })
}

export async function sendContactConfirmation(data: { name: string; email: string }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return

  await transporter.sendMail({
    from: `"Nexvora" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: data.email,
    subject: 'Votre message a bien été reçu — Nexvora',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a14; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #22d3ee); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Merci, ${data.name} !</h1>
        </div>
        <div style="padding: 32px; background: #111827; text-align: center;">
          <p style="color: #e5e7eb; line-height: 1.7; font-size: 15px;">
            Votre message a bien été reçu par l'équipe <strong style="color: #22d3ee;">Nexvora</strong>.<br>
            Nous reviendrons vers vous dans les plus brefs délais.
          </p>
          <div style="margin: 24px 0; padding: 16px; background: rgba(99,102,241,0.1); border-radius: 8px; border: 1px solid rgba(99,102,241,0.3);">
            <p style="margin: 0; color: #a5b4fc; font-size: 14px;">
              En attendant, découvrez nos services et réalisations sur notre site.
            </p>
          </div>
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #6366f1, #22d3ee); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Visiter notre site
          </a>
        </div>
        <div style="padding: 16px 32px; background: #0a0a14; text-align: center;">
          <p style="margin: 0; color: #4b5563; font-size: 12px;">© ${new Date().getFullYear()} Nexvora. Tous droits réservés.</p>
        </div>
      </div>
    `,
  })
}
