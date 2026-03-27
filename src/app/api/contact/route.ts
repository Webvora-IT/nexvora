import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, company, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: { name, email, phone, company, service, message },
    })

    // Fetch config to check if notifications are enabled
    const config = await prisma.siteConfig.findMany({
      where: {
        key: { in: ['notifyNewContact', 'adminEmail'] }
      }
    })
    
    const configMap = Object.fromEntries(config.map(c => [c.key, c.value]))
    const shouldNotify = configMap.notifyNewContact === 'true'
    const adminEmail = configMap.adminEmail || process.env.ADMIN_EMAIL

    // Send emails (non-blocking)
    const emailPromises = []
    
    // Notification to admin (if enabled)
    if (shouldNotify) {
      emailPromises.push(
        sendContactNotification({ 
          name, email, phone, company, service, message,
          toEmail: adminEmail 
        })
      )
    }

    // Confirmation to user
    emailPromises.push(sendContactConfirmation({ name, email }))

    Promise.all(emailPromises).catch(err => console.error('Email send error:', err))

    return NextResponse.json({ success: true, id: contact.id })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
