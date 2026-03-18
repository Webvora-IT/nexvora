Build and deploy Nexvora with Docker (production).

Steps:
1. Make sure `.env` has all production values (especially NEXTAUTH_SECRET, DATABASE_URL, Cloudinary vars)
2. Build and start: `docker compose up --build -d`
3. Run migrations: `docker compose exec app npx prisma migrate deploy`
4. Seed if first deploy: `docker compose exec app npx prisma db seed`
5. Check logs: `docker compose logs -f app nginx`

Access via Nginx:
- Site: http://localhost (port 80)
- Admin: http://localhost/admin

Build a specific stage:
```bash
docker build --target runner -t nexvora:prod .
docker build --target dev -t nexvora:dev .
```
