import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@Nexvora2024', 12)

  await prisma.user.upsert({
    where: { email: 'admin@nexvora.com' },
    update: {},
    create: {
      email: 'admin@nexvora.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Seed services
  const servicesData = [
    {
      title: 'Web Development',
      description: 'Custom web applications built with Next.js, React, and modern technologies.',
      icon: 'Globe',
      features: ['React / Next.js', 'Progressive Web Apps', 'E-commerce Solutions', 'API Development'],
      order: 1,
    },
    {
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications for iOS and Android.',
      icon: 'Smartphone',
      features: ['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment'],
      order: 2,
    },
    {
      title: 'DevOps & Cloud',
      description: 'Streamline your development pipeline with CI/CD and cloud infrastructure.',
      icon: 'GitBranch',
      features: ['Docker & Kubernetes', 'CI/CD Pipelines', 'AWS / GCP / Azure', 'Infrastructure as Code'],
      order: 3,
    },
    {
      title: 'AI & Machine Learning',
      description: 'Intelligent solutions powered by machine learning and generative AI.',
      icon: 'Brain',
      features: ['Custom ML Models', 'NLP & Chatbots', 'Computer Vision', 'Data Analytics'],
      order: 4,
    },
    {
      title: 'Automation',
      description: 'Automate repetitive tasks and workflows to save time and reduce costs.',
      icon: 'Zap',
      features: ['Workflow Automation', 'RPA Solutions', 'API Integration', 'Process Optimization'],
      order: 5,
    },
    {
      title: 'Cybersecurity',
      description: 'Protect your digital assets with comprehensive security solutions.',
      icon: 'Shield',
      features: ['Security Audits', 'Penetration Testing', 'Data Protection', 'Compliance'],
      order: 6,
    },
  ]

  await prisma.service.createMany({
    data: servicesData,
    skipDuplicates: true,
  })

  // Seed testimonials
  const testimonialsData = [
    {
      name: 'James Wilson',
      company: 'TechStart Inc.',
      position: 'CTO',
      content: 'Nexvora transformed our entire infrastructure. The DevOps pipeline they built reduced our deployment time by 75%.',
      rating: 5,
    },
    {
      name: 'Sarah Kim',
      company: 'RetailPro',
      position: 'CEO',
      content: 'The AI recommendation system Nexvora built for us increased our sales by 40% in just 3 months.',
      rating: 5,
    },
    {
      name: 'David Okafor',
      company: 'HealthBridge',
      position: 'Product Manager',
      content: 'Outstanding work on our healthcare platform. They delivered on time, within budget, and the quality exceeded expectations.',
      rating: 5,
    },
  ]

  await prisma.testimonial.createMany({
    data: testimonialsData,
    skipDuplicates: true,
  })

  console.log('Seed completed successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
