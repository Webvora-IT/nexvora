import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(contacts)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
