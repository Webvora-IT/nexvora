import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [contacts, projects, testimonials, posts, newContacts, recentContacts] = await Promise.all([
    prisma.contact.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.contact.count({ where: { status: 'NEW' } }),
    prisma.contact.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ])
  return NextResponse.json({ stats: { contacts, projects, testimonials, posts, newContacts }, recentContacts })
}
