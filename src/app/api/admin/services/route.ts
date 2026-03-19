import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(services)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await req.json()
    if (!data.title || !data.description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }
    const service = await prisma.service.create({ data })
    return NextResponse.json(service, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
