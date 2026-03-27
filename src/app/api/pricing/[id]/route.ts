import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const plan = await prisma.pricingPlan.update({
      where: { id: params.id },
      data: body
    })
    return NextResponse.json(plan)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update pricing plan' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.pricingPlan.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete pricing plan' }, { status: 500 })
  }
}
