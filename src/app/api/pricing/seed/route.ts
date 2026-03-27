import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const existing = await prisma.pricingPlan.count()
    if (existing > 0) {
      return NextResponse.json({ message: 'Database already seeded' })
    }

    const plans = [
      {
        key: 'starter',
        name: 'Starter',
        description: 'Parfait pour les MVP et petites entreprises',
        price: 2999,
        period: '/ projet',
        features: ['Design Responsive', 'SEO Optimization', '5 Pages', 'Support 30 jours'],
        popular: false,
        color: 'from-blue-500 to-indigo-600',
        glow: 'rgba(99,102,241,0.15)',
        order: 0,
        published: true,
      },
      {
        key: 'professional',
        name: 'Professional',
        description: 'La solution complète pour votre croissance',
        price: 7999,
        period: '/ projet',
        features: ['Design Sur Mesure', 'Animations Avancées', 'Pages Illimitées', 'CMS Intégré', 'Dashboard Client', 'Support Prioritaire'],
        popular: true,
        color: 'from-primary-500 to-accent-500',
        glow: 'rgba(99,102,241,0.25)',
        order: 1,
        published: true,
      },
      {
        key: 'enterprise',
        name: 'Enterprise',
        description: 'Solutions sur mesure pour grands comptes',
        price: 0,
        period: '/ projet',
        features: ['Architecture Scalable', 'IA Intégrée', 'Sécurité Bancaire', 'Consulting Dédié', 'Maintenance Annuelle'],
        popular: false,
        color: 'from-purple-500 to-pink-600',
        glow: 'rgba(168,85,247,0.15)',
        order: 2,
        published: true,
      },
    ]

    for (const plan of plans) {
      await prisma.pricingPlan.create({ data: plan })
    }

    return NextResponse.json({ success: true, message: 'Pricing plans seeded' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 })
  }
}
