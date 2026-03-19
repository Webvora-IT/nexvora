# ⚡ NEXVORA — IT Solutions Website

> Plateforme vitrine premium pour une entreprise IT, offrant développement web/mobile, DevOps, IA/ML, automatisation et cybersécurité.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)
![i18n](https://img.shields.io/badge/i18n-FR%20%7C%20EN%20%7C%20ES-green)

---

## 🎯 C'est quoi NEXVORA ?

NEXVORA est un **site vitrine professionnel** pour une agence IT mauritanienne. Il présente les services, les projets réalisés (portfolio), l'équipe, les témoignages clients et un blog — le tout en 3 langues (FR/EN/ES) avec un design dark haut de gamme.

### Problème résolu
Les agences IT n'ont pas de présence web professionnelle pour convaincre leurs clients. NEXVORA est une solution clé-en-main : visuel premium, contenu dynamique géré par un admin, formulaire de contact intégré.

---

## 🎬 Démo Vidéo

> 📹 **[Voir la démo complète](./docs/demo/nexvora-demo.mp4)**

https://github.com/user-attachments/assets/nexvora-demo

---

## 📸 Captures d'Écran

### Page d'Accueil
![Hero section](./docs/screenshots/01-hero.png)
*Section héro animée avec TypeAnimation et CTA*

### Services IT
![Services grid](./docs/screenshots/02-services.png)
*Grille des 6 services IT avec effets hover*

### Portfolio
![Portfolio filterable](./docs/screenshots/03-portfolio.png)
*Portfolio filtrable par catégorie*

### Équipe
![Team section](./docs/screenshots/04-team.png)
*Section équipe avec liens LinkedIn/GitHub*

### Témoignages
![Testimonials](./docs/screenshots/05-testimonials.png)
*Carousel des témoignages clients*

### Panel Admin — Dashboard
![Admin dashboard](./docs/screenshots/06-admin-dashboard.png)
*Tableau de bord avec statistiques en temps réel*

### Panel Admin — Projets
![Admin projects](./docs/screenshots/07-admin-projects.png)
*Gestion du portfolio avec upload Cloudinary*

### Panel Admin — Blog
![Admin blog](./docs/screenshots/08-admin-blog.png)
*Éditeur de blog avec statut draft/published*

---

## 👥 Rôles Utilisateurs

### 🌐 Visiteur (Public)

| Action | Description |
|--------|-------------|
| Consulter le site | Hero animé, services, portfolio, équipe, témoignages |
| Changer de langue | Basculer entre Français, English, Español |
| Lire le blog | Articles publiés filtrables par tag |
| Envoyer un message | Formulaire de contact → stocké en base de données |

### 🔑 Admin

| Section | Capacités |
|---------|-----------|
| **Dashboard** | Statistiques en temps réel (contacts, projets, services) |
| **Contacts** | Lire, archiver les messages de contact entrants |
| **Projets** | CRUD portfolio + upload images Cloudinary + réordonnancement |
| **Services** | CRUD des services IT (icône, titre, description) |
| **Équipe** | Ajouter/modifier membres (photo, rôle, LinkedIn, GitHub) |
| **Témoignages** | CRUD + publier/dépublier |
| **Blog** | Éditeur riche, tags, statut draft/published |
| **Paramètres** | Titre du site, SEO, configuration générale |

---

## 🏗️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Base de données | PostgreSQL 16 + Prisma ORM |
| Auth | NextAuth.js (JWT + Credentials) |
| Images | Cloudinary v2 |
| i18n | next-intl (FR / EN / ES) |
| Déploiement | Docker multi-stage + Nginx |

---

## 🔄 Comment ça marche ?

```
Visiteur                     Backend                    Admin
   │                            │                          │
   │── Accède à nexvora.com ──► │                          │
   │◄── Pages statiques (SSR) ──│                          │
   │                            │                          │
   │── Soumet formulaire ──────►│── Stocke en PostgreSQL   │
   │◄── Email de confirmation ──│                          │
   │                            │                          │
   │                            │◄── Admin se connecte ────│
   │                            │──► JWT token ───────────►│
   │                            │                          │
   │                            │◄── CRUD projets/blog ────│
   │◄── Contenu mis à jour ─────│                          │
```

---

## 📁 Structure du Projet

```
nexvora/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Pages publiques (FR/EN/ES)
│   │   │   ├── page.tsx       # Page d'accueil
│   │   │   └── blog/          # Liste des articles
│   │   ├── admin/             # Panel admin (sans préfixe locale)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── login/
│   │   │   ├── contacts/
│   │   │   ├── projects/
│   │   │   ├── services/
│   │   │   ├── team/
│   │   │   ├── testimonials/
│   │   │   ├── blog/
│   │   │   └── settings/
│   │   └── api/               # Routes API
│   ├── components/            # Hero, Services, Portfolio, Team, Testimonials...
│   ├── lib/                   # prisma, cloudinary, auth
│   └── i18n.ts
├── messages/                  # fr.json, en.json, es.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── nginx/
│   ├── nginx.conf
│   └── nginx.dev.conf
├── Dockerfile
├── docker-compose.yml         # Production (port 80)
└── docker-compose.dev.yml     # Développement (port 3000)
```

---

## 🚀 Démarrage

### Prérequis
- Node.js 20+
- Docker & Docker Compose
- Compte [Cloudinary](https://cloudinary.com)

### 1. Installation

```bash
cd nexvora
npm install
cp .env.example .env
```

### 2. Variables d'environnement (`.env`)

```env
DATABASE_URL="postgresql://nexvora:nexvora_password@localhost:5432/nexvora_db"
NEXTAUTH_SECRET="your-secret"           # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@nexvora.com"
ADMIN_PASSWORD="Admin@Nexvora2024"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Développement avec Docker

```bash
docker compose -f docker-compose.dev.yml up --build

# Première fois — migrations + seed
docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev
docker compose -f docker-compose.dev.yml exec app npm run db:seed
```

Accès : **http://localhost:3000**

### 4. Production

```bash
docker compose up --build -d
docker compose exec app npx prisma migrate deploy
```

Accès : **http://localhost:80**

---

## 🔑 Panel Admin

| URL | Description |
|-----|-------------|
| `/admin/login` | Connexion admin |
| `/admin` | Dashboard (statistiques live) |
| `/admin/contacts` | Messages de contact |
| `/admin/projects` | Portfolio (CRUD + images) |
| `/admin/services` | Services IT |
| `/admin/team` | Membres de l'équipe |
| `/admin/testimonials` | Témoignages clients |
| `/admin/blog` | Blog (éditeur riche) |
| `/admin/settings` | Configuration du site |

**Identifiants par défaut :**
- Email : `admin@nexvora.com`
- Password : `Admin@Nexvora2024`

> ⚠️ Changer ces identifiants avant de déployer en production.

---

## 🌍 Internationalisation

| Locale | URL | Langue |
|--------|-----|--------|
| Français | `/` | Défaut (sans préfixe) |
| Anglais | `/en/` | English |
| Espagnol | `/es/` | Español |

Fichiers de traduction : `messages/fr.json`, `messages/en.json`, `messages/es.json`

---

## 🗄️ Modèles de Données

| Modèle | Description |
|--------|-------------|
| `User` | Administrateur |
| `Contact` | Messages du formulaire de contact |
| `Project` | Projets du portfolio |
| `Service` | Services IT proposés |
| `TeamMember` | Membres de l'équipe |
| `Testimonial` | Témoignages clients |
| `BlogPost` | Articles de blog |
| `SiteConfig` | Configuration globale du site |

---

## 🎨 Design System

```
Fond :       #0a0a14 (dark profond)
Primaire :   #6366f1 (indigo)
Accent :     #22d3ee (cyan)
Glass :      rgba(255,255,255,0.05) + backdrop-blur
Gradient :   Indigo → Cyan → Violet
Police :     Inter (système)
```

---

## 📜 Licence

MIT — Fait avec ❤️ pour les entreprises IT mauritaniennes
