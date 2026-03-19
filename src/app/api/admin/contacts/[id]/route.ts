import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await req.json()
    const contact = await prisma.contact.update({ where: { id: params.id }, data })
    return NextResponse.json(contact)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await req.json()
    const contact = await prisma.contact.update({ where: { id: params.id }, data })
    return NextResponse.json(contact)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    await prisma.contact.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
