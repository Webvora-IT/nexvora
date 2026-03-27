import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(plans)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pricing plans' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const plan = await prisma.pricingPlan.create({
      data: body
    })
    return NextResponse.json(plan)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pricing plan' }, { status: 500 })
  }
}
