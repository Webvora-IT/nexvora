import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(testimonials)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await req.json()
    if (!data.name || !data.content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 })
    }
    const testimonial = await prisma.testimonial.create({ data })
    return NextResponse.json(testimonial, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
