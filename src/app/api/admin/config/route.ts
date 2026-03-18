import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const config = await prisma.siteConfig.findMany()
  const configMap = Object.fromEntries(config.map(c => [c.key, c.value]))
  return NextResponse.json(configMap)
}

export async function POST(req: NextRequest) {
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
}
