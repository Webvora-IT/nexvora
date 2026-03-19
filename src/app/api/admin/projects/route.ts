import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await req.json()
    if (!data.title || !data.description || !data.category) {
      return NextResponse.json({ error: 'Title, description and category are required' }, { status: 400 })
    }
    const project = await prisma.project.create({ data })
    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
