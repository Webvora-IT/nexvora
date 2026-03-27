---
name: Antigravity Superpowers
description: Advanced capabilities for the Antigravity agent in Next.js, Prisma, and UI/UX.
---
# Antigravity Superpowers

This skill expands the core capabilities of the Antigravity agent for building high-performance, premium web applications.

## 🚀 Speed & Efficiency
- **Atomic Commits**: Group related file changes into single, logical tool calls whenever possible (using `multi_replace_file_content`).
- **Parallel Research**: Use multiple tools in parallel (e.g., `list_dir` and `view_file`) to understand dependencies quickly.

## 💎 Premium Design System
- **Rich Aesthetics**: Always prioritize sleek design. Use glassmorphism (`backdrop-blur`), subtle gradients, and custom font pairings.
- **Micro-Animations**: Implement `framer-motion` for all state changes (entering, exiting, and hovering).
- **Responsive Layouts**: Ensure every UI element is fully responsive using mobile-first Tailwind design.

## 🛠️ Advanced Debugging
- **Prisma Insights**: Always verify DB consistency with `npx prisma db seed` and `npx prisma migrate dev` during initialization to avoid hydration/missing-record errors.
- **Auth Guarding**: Ensure all protected routes and API calls have robust error handling and descriptive logging.
- **Hydration Diagnostics**: When hydration errors occur, check for `Locale` mismatches and common DOM nesting errors (e.g., `<p>` inside `<p>`).

## ⚡ Deployment & DevOps
- **Docker-First**: Use Docker Compose for consistent development across different environments.
- **CI/CD Readiness**: Maintain a clean `Dockerfile` and `entrypoint.sh` to facilitate automated deployments.
