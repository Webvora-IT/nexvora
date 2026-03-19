# ⚡ NEXVORA — IT Solutions Website

> Premium IT company website offering web/mobile development, DevOps, AI/ML, automation, and cybersecurity services.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)

---

## 👥 Roles Utilisateurs

### Visiteur (public)
- Consulter les services IT, portfolio, blog, témoignages
- Voir l'équipe avec profils détaillés (LinkedIn, GitHub)
- Envoyer un message via le formulaire de contact
- Naviguer en FR, EN ou ES

### Admin
- Tableau de bord avec statistiques en temps réel
- Gestion des contacts (lire, répondre, archiver)
- Gestion du portfolio (CRUD projets + images Cloudinary)
- Gestion des services IT (CRUD)
- Gestion des témoignages (CRUD, publier/dépublier)
- Gestion du blog (éditeur riche, tags, statut draft/published)
- Gestion de l'équipe (ajouter/modifier membres, liens LinkedIn/GitHub)
- Configuration du site (nom, titre, SEO)

---

## ✨ Features

- **Dark theme** — Premium design with glass morphism effects
- **Multilingual** — French (default), English, Spanish via `next-intl`
- **Dynamic Admin Panel** — Full CRUD with live data (SWR)
- **Team section** — Public team showcase with social links, managed from admin
- **Cloudinary** — Image upload & management
- **Authentication** — NextAuth.js with JWT (credentials)
- **Nginx** — Reverse proxy with gzip, rate limiting, security headers
- **Docker** — Multi-stage builds (dev / builder / production)
- **Animations** — Framer Motion with scroll-triggered effects

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Database | PostgreSQL 16 + Prisma ORM |
| Auth | NextAuth.js (JWT) |
| Images | Cloudinary v2 |
| i18n | next-intl (FR / EN / ES) |
| Deployment | Docker + Nginx |

## 📁 Project Structure

```
nexvora/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Public pages (locale-aware)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── admin/             # Admin panel
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── login/         # Auth
│   │   │   ├── contacts/
│   │   │   ├── projects/
│   │   │   ├── services/
│   │   │   ├── testimonials/
│   │   │   ├── blog/
│   │   │   ├── team/
│   │   │   └── settings/
│   │   └── api/               # API routes
│   ├── components/            # UI components
│   ├── lib/                   # prisma, cloudinary, auth
│   └── i18n.ts
├── messages/                  # fr.json, en.json, es.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── nginx/
│   ├── nginx.conf             # Production
│   └── nginx.dev.conf         # Development
├── Dockerfile                 # Multi-stage
├── docker-compose.yml         # Production
└── docker-compose.dev.yml     # Development
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- A [Cloudinary](https://cloudinary.com) account

### 1. Clone & Install

```bash
git clone https://github.com/ibrahim-a-developper/nexvora.git
cd nexvora
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
DATABASE_URL="postgresql://nexvora:nexvora_password@localhost:5432/nexvora_db"
NEXTAUTH_SECRET="your-secret-here"           # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@nexvora.com"
ADMIN_PASSWORD="Admin@Nexvora2024"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Start Development

```bash
# Start DB + Nginx + App with HMR
docker compose -f docker-compose.dev.yml up --build

# First time: run migrations & seed
docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev
docker compose -f docker-compose.dev.yml exec app npm run db:seed
```

Access: **http://localhost:3000**

### 4. Production Deploy

```bash
docker compose up --build -d
docker compose exec app npx prisma migrate deploy
```

Access via Nginx: **http://localhost:80**

## 🔑 Admin Panel

| URL | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin` | Dashboard (live stats) |
| `/admin/contacts` | Contact management |
| `/admin/projects` | Portfolio CRUD + images |
| `/admin/services` | Services management |
| `/admin/testimonials` | Testimonials CRUD |
| `/admin/blog` | Blog editor |
| `/admin/team` | Team management |
| `/admin/settings` | Site configuration |

**Default credentials:**
- Email: `admin@nexvora.com`
- Password: `Admin@Nexvora2024`

> ⚠️ Change these credentials before deploying to production.

## 🌍 Internationalization

| Locale | URL | Language |
|---|---|---|
| French | `/` | Default (no prefix) |
| English | `/en/` | English |
| Spanish | `/es/` | Spanish |

Translation files: `messages/fr.json`, `messages/en.json`, `messages/es.json`

## 🐳 Docker Stages

| Stage | Target | Use |
|---|---|---|
| `base` | — | Node 20 Alpine |
| `dev-deps` | — | All dependencies |
| `dev` | `dev` | Hot reload dev server |
| `builder` | `builder` | Next.js production build |
| `runner` | `runner` | Minimal production image |

```bash
# Build specific stage
docker build --target runner -t nexvora:prod .
docker build --target dev    -t nexvora:dev  .
```

## 🗄️ Database Schema

Models: `User` · `Contact` · `Project` · `Service` · `Testimonial` · `BlogPost` · `SiteConfig` · `TeamMember`

```bash
npx prisma studio          # Visual DB editor
npx prisma migrate dev     # Create migration
npx prisma db seed         # Seed data
```

## 🎨 Design System

```
Background:  #0a0a14 (deep dark)
Primary:     #6366f1 (indigo)
Accent:      #22d3ee (cyan)
Glass:       rgba(255,255,255,0.05) + backdrop-blur
Gradient:    Indigo → Cyan → Purple
```

## 📜 License

MIT — Built with ❤️ by [Ibrahim](https://github.com/ibrahim-a-developper)
