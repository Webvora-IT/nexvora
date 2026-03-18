Database operations for Nexvora.

Common commands:
```bash
# Create a new migration
npx prisma migrate dev --name add_field_name

# Apply migrations in production
docker compose exec app npx prisma migrate deploy

# Open Prisma Studio (visual DB editor)
npx prisma studio

# Seed the database
npm run db:seed

# Reset database (DESTRUCTIVE — dev only)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate
```

Models: User, Contact, Project, Service, Testimonial, BlogPost, SiteConfig, TeamMember
DB port: 5432 (local), internal postgres:5432 (Docker)
