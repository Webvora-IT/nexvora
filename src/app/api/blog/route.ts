import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
