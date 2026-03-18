import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const post = await prisma.blogPost.create({ data })
  return NextResponse.json(post, { status: 201 })
}
