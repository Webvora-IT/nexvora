---
name: FixBugs Agent
description: Advanced debugging, testing, and error resolution for Next.js, Prisma, and UI components.
---
# FixBugs Agent

This skill focuses on resolving errors at the source and preventing regressions.

## 🕵️ Investigation
- **Log Analysis**: Always request and inspect server logs (`docker logs nexvora_app_dev`) for 500/401/404 errors.
- **Trace Hydration**: Identify early hydration mismatches by comparing HTML structure in layouts.
- **Network Tracing**: Debug client-to-server calls to ensure payloads and responses match expectations.

## 🛠️ Typical Fixes
- **Prisma**: Check migrations (`migrate dev`), seed data (`db seed`), and adapter initialization.
- **NextAuth**: Diagnose 401 errors using detailed `authorize` logging.
- **API Errors**: Implement defensive `if (!res.ok)` and `Array.isArray()` checks for robust data fetching.

## 🧪 Testing & Verification
- **Functional Testing**: Verify that login/logout, blog posting, and service updates work as expected.
- **Component Unit Testing**: (Optional) Use `vitest` or `jest` for pure utility functions.
- **Visual Testing**: Ensure new responsive changes don't break existing layouts.
