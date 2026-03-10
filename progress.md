---
title: Family Travel App — Progress Tracker
description: Living task tracker for the Family Travel Companion App build
author: Hammad Aslam
ms.date: 2026-03-09
---

## Status Legend

- [ ] Not started
- [~] In progress
- [x] Complete

## Phase 1 — Project Setup

- [x] Initialize Next.js 15 project with TypeScript and Tailwind CSS
- [x] Install core dependencies (Prisma, shadcn/ui, Framer Motion, next-pwa, etc.)
- [x] Set up project folder structure
- [x] Create `.env.example` with all required environment variable keys
- [x] Initialize Git repository

## Phase 2 — Database and Schema

- [x] Define Prisma schema (Trip, TripDay, Activity, Flight, Place, Document, Recommendation, CalendarSync)
- [x] Configure Prisma for PostgreSQL with Azure Managed Identity auth
- [ ] Run initial migration
- [x] Seed database with trip data (India April, Egypt/Saudi December)

## Phase 3 — Core UI Shell

- [x] Build kid-friendly theme (vibrant colors, rounded shapes, playful typography)
- [x] Create responsive layout with bottom nav (mobile) and sidebar (desktop)
- [x] Build dashboard page with trip cards and countdown timers
- [x] Implement PIN-based gate middleware
- [x] Add Framer Motion page transitions and micro-interactions

## Phase 4 — TripIt Integration

- [x] Set up TripIt OAuth 1.0a client
- [x] Build sync API route (`api/tripit/sync`)
- [x] Create "Sync from TripIt" button on dashboard
- [x] Map TripIt objects to database models

## Phase 5 — Flight Tracking

- [x] Integrate AirLabs API for real-time flight status
- [x] Build flight status API route with 10-minute caching
- [x] Create flight card component (status badge, gate, countdown)
- [x] Add upcoming flight banner to dashboard
- [x] Build flights dashboard page grouped by trip with airline logos

## Phase 6 — Day-by-Day Itinerary and Google Calendar Sync

- [x] Build day-by-day itinerary view with accordion/tab per day
- [x] Build trip detail page with day selector, schedule/places/flights/docs tabs
- [x] Build activity card with timeline and status cycling
- [x] Build add-activity modal with type grid
- [x] Build itinerary overview page listing all trips
- [x] Add drag-and-drop reordering with @dnd-kit
- [x] Integrate Google Calendar API (OAuth 2.0)
- [x] Implement bi-directional sync (app to Google Calendar and back)
- [ ] Build timeline view option

## Phase 7 — Places to Visit and Eat

- [x] Build places page with search, category pills, city filter, visited toggle
- [x] Create place card component (photo, rating, maps link, visited toggle)
- [ ] Build map view with Google Maps JavaScript API
- [x] Add filter/sort by category, visited status, day
- [ ] Pre-populate known places for both trips

## Phase 8 — Nearby Recommendations

- [x] Integrate Google Places Nearby Search API
- [x] Build "Discover Nearby" feature per day/city
- [x] Create recommendation cards with "Add to Itinerary" action
- [x] Add kid-friendly and open-now filters

## Phase 9 — Document Vault

- [ ] Set up Azure Blob Storage with Managed Identity access
- [ ] Build upload API with signed URLs
- [x] Create document management UI (categorized by type)
- [x] Add per-trip document section

## Phase 10 — Umrah and Prayer Features

- [x] Integrate Aladhan API for prayer times
- [x] Build prayer time widget with current/next prayer tracking
- [x] Create Umrah step-by-step checklist component (6 steps with du'as, tips, kid notes)
- [x] Add du'as reference section (7 essential du'as with Arabic, transliteration, translation)
- [x] Build holy places guide for Makkah and Madinah
- [x] Create Umrah/prayer page with sections (prayer times, Umrah guide, holy places)
- [x] Add Umrah to sidebar and bottom-nav navigation

## Phase 11 — CI/CD and Azure Deployment

- [x] Create GitHub Actions workflow (build, test, deploy)
- [x] Create Bicep IaC files (main + modules: identity, postgres, storage, appservice)
- [x] Create azd configuration (azure.yaml)
- [x] Update CD workflow with infrastructure provisioning via Bicep
- [x] Write deployment instructions (DEPLOY.md) for azd and az cli
- [x] Parameterize resource group name for user customization
- [ ] Configure Azure Managed Identity (federated credentials for GitHub Actions)
- [ ] Provision Azure resources (run azd up or az deployment sub create)
- [ ] Configure CNAME in GoDaddy (the user will do this manually)
- [ ] Verify end-to-end deployment

## Phase 12 — PWA and Polish

- [x] Configure next-pwa for offline support
- [ ] Run Lighthouse audit and optimize
- [ ] Test on mobile devices
- [ ] Final UI polish and animation tuning

## Notes

> Update this file after completing each task. Mark items with [x] when done and [~] when in progress.
>
> **Session 1 (2026-03-09)**: Completed Phase 1 (setup), Phase 2 (schema), Phase 3 (UI shell), Phase 4 (TripIt), Phase 5 (flights). Build compiles successfully. Middleware deprecation warning is cosmetic (Next.js 16 renaming). Prisma v5.22 used due to Node 20.14 compatibility.
>
> **Session 2**: Built all remaining pages and API routes: trip detail page with day selector and activity timeline, itinerary overview, places page with filtering, flights dashboard, document vault, settings page, and full CRUD API routes for trips/activities/places/documents. Added Umrah/prayer features: Aladhan API client for prayer times, prayer times widget with current/next prayer tracking, Umrah step-by-step checklist with 6 steps (du'as, tips, kid-friendly notes), du'as reference with 7 essential du'as, holy places guide for Makkah and Madinah, prayer times API route. Build compiles successfully with 22 routes total.
>
> **Session 3**: Installed @dnd-kit packages for drag-and-drop. Created comprehensive seed data script (prisma/seed.ts) with both trips fully populated. Built sortable activity list component with drag-and-drop reordering. Created Google Calendar bi-directional sync API routes (push/pull). Built nearby recommendations page with Google Places API, city selector, category filters, kid-friendly/open-now toggles. Configured PWA with manual service worker (offline page, cache-first strategy). Added Discover page to sidebar and bottom nav. Build compiles successfully with 26 routes.
>
> **Session 3 (continued)**: Created full Azure Bicep infrastructure: main.bicep (subscription-scoped with parameterized resource group name), main.parameters.json (azd-compatible), and four modules (identity, postgres, storage, appservice). Created azure.yaml for azd workflows. Updated GitHub Actions CD workflow with infrastructure provisioning job (Bicep deployment), proper standalone packaging, Prisma migration step, and workflow_dispatch for manual infra deployments. Wrote comprehensive DEPLOY.md with step-by-step instructions for both azd and az cli deployment, OIDC setup, and troubleshooting. Build compiles successfully with 26 routes.
