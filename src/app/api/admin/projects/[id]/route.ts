import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const data = await req.json()
  const project = await prisma.project.update({ where: { id: params.id }, data })
  return NextResponse.json(project)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin()
  if (authError) return authError
  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
