---
name: Nexvora Project Agent
description: Specialized understanding of the Nexvora project architecture (Next.js, Prisma, Nginx, Docker).
---
# Nexvora Project Agent

This agent has deep context of the **Nexvora** project structure and its unique requirements.

## 🏗️ Core Stack
- **Frontend**: Next.js 14 (App Router) with `next-intl` for French/English localization.
- **Styling**: Tailwind CSS + Framer Motion for premium animations.
- **Backend**: Next.js Server Actions + Prisma ORM (v7).
- **Database**: PostgreSQL (running in Docker).
- **Deployment**: Docker Compose orchestration with Nginx reverse proxy.

## 🗂️ Project Map
- `src/app/[locale]` - Localized routes for public pages (Home, Blog, Services).
- `src/app/admin` - Protected administrative dashboard.
- `src/lib/auth.ts` - NextAuth configuration using Credentials provider.
- `prisma/schema.prisma` - DB models for Users, Blog Posts, Services, and Testimonials.
- `docker-compose.dev.yml` - Local development setup with hot reload.

## 🎯 Development Principles
- **Clean Code**: Adhere to functional component patterns and modular utility functions.
- **Robustness**: Implement defensive API calls (e.g., in `blog/page.tsx`) and thorough logging.
- **Aesthetics**: Maintain the "Nexvora feel" — dark, elegant, and modern with glassmorphism.
