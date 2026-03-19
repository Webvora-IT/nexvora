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

    // Send emails (non-blocking)
    Promise.all([
      sendContactNotification({ name, email, phone, company, service, message }),
      sendContactConfirmation({ name, email }),
    ]).catch(err => console.error('Email send error:', err))

    return NextResponse.json({ success: true, id: contact.id })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

