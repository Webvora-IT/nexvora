import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(testimonials)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const testimonial = await prisma.testimonial.create({ data })
  return NextResponse.json(testimonial, { status: 201 })
}
