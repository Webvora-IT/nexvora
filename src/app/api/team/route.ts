import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        role: true,
        bio: true,
        imageUrl: true,
        linkedin: true,
        github: true,
        order: true,
      },
    })
    return NextResponse.json(team)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
