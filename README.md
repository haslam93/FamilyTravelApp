---
title: Family Travel Companion App
description: A kid-friendly, PWA-enabled travel planner for family trips with real-time flight tracking, Umrah guidance, and Azure-backed infrastructure
author: Hammad Aslam
ms.date: 2026-03-10
---

## Overview

A responsive, database-backed travel companion built with Next.js 16 for tracking two upcoming family trips:

* **Solo trip (April 2026)** — Hyderabad and Delhi, India
* **Family trip (December 2026)** — Cairo and Sharm El Sheikh (Egypt), Makkah and Madinah (Saudi Arabia) for Umrah — 5 people including 3 kids (ages 5, 3, and under 2)

The app features a vibrant, kid-friendly UI with large touch targets, playful animations, and offline-first PWA support so it works reliably while traveling internationally.

## Key Features

* **Dashboard** with trip cards, countdown timers, and upcoming flight banners
* **Day-by-day itinerary** with drag-and-drop reordering and activity timeline
* **Flight tracking** via AirLabs API with real-time status, gates, and delays
* **Places to visit** with search, category filters, and visited toggle
* **Nearby recommendations** via Google Places API with kid-friendly filters
* **Document vault** for passports, tickets, visas stored in Azure Blob Storage
* **Umrah guide** with step-by-step checklist, du'as, and holy places reference
* **Prayer times** via Aladhan API with current/next prayer tracking
* **Google Calendar sync** — bi-directional push/pull for itinerary events
* **PIN-based access** — simple PIN gate (no user accounts)
* **PWA** — installable with offline support via service worker

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full architecture diagram and component breakdown.

### High-level stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Database | Azure Database for PostgreSQL 16 via Prisma ORM and managed identity |
| Storage | Azure Blob Storage (Managed Identity) |
| Hosting | Azure App Service (Linux, Node 20) |
| IaC | Bicep (subscription-scoped, 4 modules) |
| CI/CD | GitHub Actions with OIDC federated credentials |
| Auth | Managed Identity for all Azure services, PIN for user access |

### External APIs

| API | Purpose |
|---|---|
| AirLabs | Real-time flight status and tracking |
| Google Calendar (OAuth 2.0) | Bi-directional itinerary sync |
| Google Maps / Places | Maps, place search, nearby recommendations |
| Aladhan | Prayer times by coordinates |

## Project Structure

```text
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # REST API routes (trips, activities, flights, etc.)
│   ├── trip/[id]/          # Dynamic trip detail page
│   ├── itinerary/          # Itinerary overview
│   ├── places/             # Places to visit
│   ├── recommendations/    # Nearby discover page
│   ├── flights/            # Flight tracking dashboard
│   ├── documents/          # Document vault
│   ├── umrah/              # Umrah guide and prayer times
│   ├── settings/           # App settings
│   └── pin/                # PIN gate
├── components/             # Reusable UI components
└── lib/                    # Shared utilities and API clients
infra/                      # Azure Bicep IaC modules
prisma/                     # Schema, migrations, and seed data
public/                     # Static assets and PWA manifest
.github/workflows/          # CI/CD pipeline
```

## Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL 16 (local or Docker)

### Local development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and optional API keys

# Create database and run migrations
npx prisma migrate dev --name init

# Seed sample trip data
npx prisma db seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Using Docker for PostgreSQL

```bash
docker run -d --name family-travel-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=family_travel \
  -p 5432:5432 postgres:16
```

## Azure Deployment

The app deploys to Azure using Bicep infrastructure-as-code. You can choose between Azure Developer CLI (`azd`) or Azure CLI (`az`).

```bash
# Option A: Azure Developer CLI (recommended)
azd auth login
azd up

# Option B: Azure CLI
az deployment sub create \
  --location eastus \
  --template-file infra/main.bicep \
  --parameters environmentName=prod resourceGroupName=my-rg-name
```

See [DEPLOY.md](DEPLOY.md) for complete deployment instructions, OIDC setup for GitHub Actions, and troubleshooting.

## CI/CD

Every push to `main` triggers the GitHub Actions pipeline which:

1. Builds and lints the Next.js app
2. Runs Azure Bicep `what-if` and only applies infra if infrastructure files changed or a manual deploy requests it
3. Packages standalone output into a real zip artifact
4. Deploys to App Service via `az webapp deploy --type zip`
5. Verifies deployment with a health check
6. Ensures the App Service managed identity has PostgreSQL access
7. Runs Prisma migrations against the production database

Manual infrastructure deployments can be triggered via `workflow_dispatch` in the Actions tab.

## Live Site

The app is deployed at [https://hammadtravel.azurewebsites.net](https://hammadtravel.azurewebsites.net).

## License

Private project — not licensed for redistribution.
