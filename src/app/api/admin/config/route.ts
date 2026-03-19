import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const config = await prisma.siteConfig.findMany()
    const configMap = Object.fromEntries(config.map(c => [c.key, c.value]))
    return NextResponse.json(configMap)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await req.json() as Record<string, string>
    const updates = await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.siteConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    )
    return NextResponse.json({ success: true, count: updates.length })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
