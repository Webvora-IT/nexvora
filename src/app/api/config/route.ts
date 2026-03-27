import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// These keys are safe to expose to the public
const publicKeys = [
  'siteName',
  'siteUrl',
  'tagline',
  'socialGithub',
  'socialTwitter',
  'socialLinkedin',
  'socialInstagram',
  'socialFacebook',
  'statProjects',
  'statClients',
  'statYears',
  'statSatisfaction',
  'supportEmail',
  'contactPhone',
  'contactAddress'
]

export async function GET() {
  try {
    const config = await prisma.siteConfig.findMany({
      where: {
        key: { in: publicKeys }
      }
    })
    
    // Create a defaults map for keys not in DB
    const configMap = Object.fromEntries(config.map(c => [c.key, c.value]))
    
    return NextResponse.json(configMap)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
