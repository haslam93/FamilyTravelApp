---
description: "Project context and task-tracking protocol for the Family Travel Companion App"
applyTo: "**"
---

## Project Overview

This is the Family Travel Companion App — a responsive, database-backed Next.js 15 application for tracking two family trips:

* **Solo trip (April 2026)**: Hyderabad and Delhi, India
* **Family trip (December 2026)**: Cairo and Sharm El Sheikh (Egypt), Makkah and Madinah (Saudi Arabia) for Umrah — 5 people including 3 kids (ages 5, 3, and under 2)

## Tech Stack

* Next.js 15 (App Router) + TypeScript
* Tailwind CSS + shadcn/ui + Framer Motion
* Prisma ORM + Azure Database for PostgreSQL Flexible Server
* Azure Blob Storage for documents
* Azure App Service (Linux, Node 20) for hosting
* Azure Managed Identity for all Azure auth (no connection strings or passwords)
* GitHub Actions CI/CD with federated credentials
* TripIt API (OAuth 1.0a) for itinerary sync
* AirLabs API for flight tracking
* Google Calendar API for bi-directional itinerary sync
* Google Maps/Places API for maps, place search, and recommendations
* Aladhan API for prayer times
* PWA via next-pwa for offline support

## Key Design Principles

* Kid-friendly, cutting-edge UI with vibrant colors, rounded shapes, playful animations, and large touch targets
* Mobile-first responsive design
* PIN-based access protection (no user accounts)
* Offline-capable via PWA

## Task Tracking Protocol

**You MUST follow this protocol when working on this project:**

1. Before starting any task, read `progress.md` to understand current status.
2. Mark the task you are starting as `[~]` (in progress) in `progress.md`.
3. After completing a task, mark it as `[x]` (complete) in `progress.md`.
4. If a task is blocked or paused, add a note under the `## Notes` section explaining why.
5. If you add new tasks not listed in `progress.md`, append them under the appropriate phase.
6. Always save `progress.md` before ending a session so work can resume seamlessly.

## Conventions

* Use TypeScript strict mode throughout
* Use server components by default; mark client components explicitly with `'use client'`
* API routes go in `src/app/api/`
* Shared utilities go in `src/lib/`
* Reusable UI components go in `src/components/`
* Prisma schema lives in `prisma/schema.prisma`
* Environment variables documented in `.env.example`
* All Azure connections use Managed Identity — never store connection strings or passwords
