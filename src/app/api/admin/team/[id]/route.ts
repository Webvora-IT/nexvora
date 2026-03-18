import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const member = await prisma.teamMember.update({ where: { id: params.id }, data })
  return NextResponse.json(member)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.teamMember.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
