# NEXVORA — IT Company Website

## Project Overview
NEXVORA is a premium IT company website offering web/mobile development, DevOps, AI/ML, automation, and cybersecurity services.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js
- **Deployment**: Docker + Docker Compose

## Project Structure
```
src/
  app/
    page.tsx              # Main landing page
    layout.tsx            # Root layout
    globals.css           # Global styles
    admin/                # Admin panel
      page.tsx            # Dashboard
      contacts/           # Contact management
      projects/           # Project management
      testimonials/       # Testimonials management
      blog/               # Blog management
    api/
      contact/route.ts    # Contact form API
      admin/              # Admin APIs
  components/
    Navbar.tsx
    Hero.tsx
    Services.tsx
    Portfolio.tsx
    About.tsx
    Testimonials.tsx
    Contact.tsx
    Footer.tsx
  lib/
    prisma.ts             # Prisma client
    utils.ts              # Utility functions
prisma/
  schema.prisma           # Database schema
  seed.ts                 # Seed data
```

## Design System
- **Background**: Dark (`#0a0a14`)
- **Primary**: Indigo (`#6366f1`)
- **Accent**: Cyan (`#22d3ee`)
- **Text**: White / Gray-400
- **Glass effect**: `rgba(255,255,255,0.05)` with blur
- **Gradient text**: Indigo → Cyan → Purple

## Database Schema
Models: User, Contact, Project, Service, Testimonial, BlogPost

## Environment Variables
See `.env.example` for required variables.

## Commands
```bash
# Development
npm install
cp .env.example .env
docker-compose up postgres -d
npx prisma migrate dev
npm run dev

# Production
docker-compose up -d

# Database
npm run prisma:studio    # Open Prisma Studio
npm run prisma:migrate   # Run migrations
```

## Admin Panel
- URL: `/admin`
- Default credentials: admin@nexvora.com / Admin@Nexvora2024
- Sections: Dashboard, Contacts, Projects, Testimonials, Blog, Settings

## Key Features
1. Animated hero with TypeAnimation
2. Services grid with hover effects
3. Filterable portfolio
4. Team section
5. Testimonials carousel
6. Contact form with DB storage
7. Full admin panel

## Code Conventions
- Use `'use client'` for interactive components
- Use Framer Motion for all animations
- Use `useInView` for scroll-triggered animations
- All colors from Tailwind config
- Use `cn()` utility for class merging

## Agents Available
- `/dev` - Start development environment
- `/deploy` - Build and deploy with Docker
- `/db` - Database operations
- `/admin` - Admin panel tasks
