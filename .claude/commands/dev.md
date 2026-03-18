Start the Nexvora development environment.

Run these steps:
1. Check if Docker is running: `docker info`
2. Start the database: `docker compose -f docker-compose.dev.yml up postgres -d`
3. Wait for it to be ready, then run migrations: `npx prisma migrate dev`
4. Seed the database if empty: `npm run db:seed`
5. Start the full dev stack with nginx: `docker compose -f docker-compose.dev.yml up`

Or for local dev without Docker:
```bash
# Terminal 1 - DB only
docker compose -f docker-compose.dev.yml up postgres -d

# Terminal 2 - Next.js
npm run dev
```

Access: http://localhost:3000
Admin: http://localhost:3000/admin (admin@nexvora.com / Admin@Nexvora2024)
Prisma Studio: npx prisma studio
