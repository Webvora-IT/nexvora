import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(team)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await req.json()
    if (!data.name || !data.role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 })
    }
    const member = await prisma.teamMember.create({ data })
    return NextResponse.json(member, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
