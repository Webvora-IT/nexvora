import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Clear existing to allow re-seeding with new data
    await prisma.pricingPlan.deleteMany({})

    const plans = [
      {
        key: 'starter',
        name: 'Starter',
        description: 'Solutions agiles pour MVP et petites structures',
        price: 2999,
        period: '/ projet',
        features: ['Design Responsive', 'SEO Optimization', 'Backend Django / Firebase', 'Intégration Supabase', '5 Pages'],
        popular: false,
        color: 'from-blue-500 to-indigo-600',
        glow: 'rgba(99,102,241,0.15)',
        order: 0,
        published: true,
      },
      {
        key: 'professional',
        name: 'Professional',
        description: 'Performance et scalabilité pour votre croissance',
        price: 7999,
        period: '/ projet',
        features: ['Architecture Django / SpringBoot', 'Caching Redis Ultra-Rapide', 'DevSecOps & CI/CD', 'Real-time avec Kafka', 'CMS & Dashboard Sur Mesure', 'Support Prioritaire'],
        popular: true,
        color: 'from-primary-500 to-accent-500',
        glow: 'rgba(99,102,241,0.25)',
        order: 1,
        published: true,
      },
      {
        key: 'enterprise',
        name: 'Enterprise',
        description: 'Transformez votre entreprise avec des solutions ERP & Big Data',
        price: 0,
        period: '/ projet',
        features: ['Intégration ERP Odoo Sur Mesure', 'Infrastructures Kafka & Redis', 'Microservices SpringBoot Scalables', 'DevSecOps Complet & Sécurité Bancaire', 'Architecture Cloud Hybride', 'Support 24/7 & Consulting'],
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
