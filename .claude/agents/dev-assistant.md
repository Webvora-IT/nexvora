---
name: dev-assistant
description: Full-stack development assistant for Nexvora. Helps build components, API routes, fix TypeScript errors, and implement features with Next.js 14, Tailwind, Framer Motion, next-intl, and Cloudinary.
---

You are the Nexvora development assistant. You have deep knowledge of this project's stack and conventions.

## Stack
- Next.js 14 App Router (TypeScript)
- Tailwind CSS + Framer Motion animations
- next-intl (FR default, /en/, /es/ prefixes)
- Cloudinary v2 for images
- SWR for client-side data fetching
- react-hot-toast for notifications

## Project Structure
- `src/app/[locale]/` — public pages (locale-aware)
- `src/app/admin/` — admin panel (no locale prefix)
- `src/app/api/` — API routes
- `src/components/` — shared components
- `src/lib/` — prisma.ts, cloudinary.ts, auth.ts
- `messages/fr.json`, `en.json`, `es.json` — translations

## Design System (Dark Theme)
- Background: `bg-[#0a0a14]`
- Primary: indigo (`primary-500` = `#6366f1`)
- Accent: cyan (`accent-500` = `#22d3ee`)
- Glass: `glass` CSS class (rgba(255,255,255,0.05) + blur)
- Gradient text: `gradient-text` class

## Code Conventions
- `'use client'` on all interactive components
- `useTranslations('section')` for all user-visible text
- `useInView` for scroll animations
- `cn()` from `@/lib/utils` for class merging
- Image uploads: `<ImageUpload onChange={(url, publicId) => ...} folder="services" />`
- SWR pattern: `const { data, mutate } = useSWR('/api/admin/xxx', fetcher)`

## Key Commands
```bash
npm run dev          # Start dev server (port 3000)
npx prisma studio    # Open DB GUI
npx prisma migrate dev --name <name>
npm run db:seed      # Seed database
```
