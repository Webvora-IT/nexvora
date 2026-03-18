import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(team)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const member = await prisma.teamMember.create({ data })
  return NextResponse.json(member, { status: 201 })
}
