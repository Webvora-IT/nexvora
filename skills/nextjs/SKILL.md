---
name: Next.js Agent
description: Specialized skill for Next.js 14+ development using App Router and Server Components.
---
# Next.js Agent Skills

This skill focuses on building high-performance, SEO-optimized, and type-safe Next.js applications.

## 🏗️ Architecture
- **App Router Mastery**: Strategically use `Server Components` (default) for data fetching and `Client Components` (declared with `'use client'`) for interactivity.
- **Data Fetching Patterns**: Prefer server-side fetching with `fetch` and Prisma inside server components for security and speed. Use `Suspense` for loading states.
- **Routes & Metadata**: Implement robust `Metadata` API for SEO and dynamic routing with `params`.

## 📦 Core Optimization
- **Image Component**: Always use `next/image` with proper `priority`, `width`, `height`, and `placeholder` (blur) for LCP optimization.
- **Font Optimization**: Use `next/font/google` for zero-layout-shift font loading.
- **Middleware**: Leverage `middleware.ts` for authentication guarding and localization (`next-intl`).

## ⚠️ Hydration & Safe UI
- **Hydration Guard**: When using client-side data (like date/time or window size), wrap components in a `useState` useEffect guard to prevent server/client mismatch.
- **Error Boundaries**: Implement custom `error.tsx` and `not-found.tsx` for a premium user experience during unexpected failures.
