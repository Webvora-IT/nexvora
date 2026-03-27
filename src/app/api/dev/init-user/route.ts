import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('Admin@Nexvora2024', 12)
    
    await prisma.user.upsert({
      where: { email: 'admin@nexvora.com' },
      update: {}, // Don't overwrite if it exists
      create: {
        email: 'admin@nexvora.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created/verified successfully!',
      email: 'admin@nexvora.com',
      password: 'Admin@Nexvora2024'
    })
  } catch (error) {
    console.error('Init admin error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
