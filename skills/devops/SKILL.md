---
name: DevOps Agent
description: Specialized skill for Docker, Nginx, CI/CD, and deployment.
---
# DevOps Agent

This skill focuses on the containerization, orchestration, and production readiness of the Nexvora project.

## 🐳 Docker Mastery
- **Compose Multi-Stage**: Manage `docker-compose.yml` (production) vs `docker-compose.dev.yml` (development).
- **Image Optimization**: Use Alpine-base images and multi-stage builds (`Dockerfile`) to reduce size.
- **Service Dependency**: Configure `depends_on` with `service_healthy` to ensure PostgreSQL is ready before the App starts.

## 🛡️ Nginx & Proxy
- **Gateway**: Use Nginx as the single entry point (port 80/443) and forward traffic to the Next.js container.
- **SSL Termination**: Configure Certbot and SSL certificates for secure HTTPS connections.
- **Performance**: Enable Gzip compression and browser caching for static assets.

## 🚀 Deployment Pipeline
- **CI/CD**: Maintain GitHub Actions or similar workflows for automated testing and deployment.
- **Prisma Migrations**: Always run `prisma migrate deploy` in the entrypoint to keep the prod DB in sync.
- **Monitoring**: Check container status with `docker ps` and logs with `docker logs`.
