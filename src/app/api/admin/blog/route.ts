import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await req.json()
    if (!data.title || !data.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
    }
    const post = await prisma.blogPost.create({ data })
    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
