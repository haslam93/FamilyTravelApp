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

## Phase 4 — TripIt Integration (REMOVED)

- [x] ~~Set up TripIt OAuth 1.0a client~~ *Removed — TripIt public API shut down*
- [x] ~~Build sync API route (`api/tripit/sync`)~~ *Removed*
- [x] ~~Create "Sync from TripIt" button on dashboard~~ *Removed*
- [x] ~~Map TripIt objects to database models~~ *Removed*

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
- [x] Configure Azure Managed Identity (federated credentials for GitHub Actions)
- [x] Provision Azure resources (az deployment sub create)
- [x] Deploy app to Azure App Service (hammadtravel.azurewebsites.net)
- [x] Verify end-to-end deployment
- [ ] Configure CNAME in GoDaddy (the user will do this manually)

## Phase 12 — PWA and Polish

- [x] Configure next-pwa for offline support
- [ ] Run Lighthouse audit and optimize
- [ ] Test on mobile devices
- [ ] Final UI polish and animation tuning

## Phase 13 — Post-deployment fixes

- [x] Fix broken Unsplash image URLs (Hyderabad, Cairo, Makkah — returned 404)
- [x] Rewrite CI/CD workflow to use `az webapp deploy --type zip` instead of `azure/webapps-deploy`
- [x] Add PostgreSQL auto-start check to CI/CD pipeline
- [x] Add deployment health-check verification step
- [x] Stabilize GitHub Actions pipeline (lint cleanup, packaging fix, OIDC deploy)
- [x] Update all documentation (README, DEPLOY, ARCHITECTURE, progress)

## Phase 14 — UI Rethink and Full CRUD

- [x] Remove TripIt integration (API shut down — deleted client and sync route)
- [x] Fix Google Calendar OAuth flow (created `/api/auth/google/start` route)
- [x] Redesign dashboard (floating emojis, gradient hero, family avatars, quick actions)
- [x] Redesign trip detail page (Edit Trip modal, Edit Flight modal, add/edit/delete flights, gradient stats)
- [x] Rewrite flights page with Add/Edit/Delete modals and enhanced route visualization
- [x] Rewrite places page with Add/Edit/Delete modals and kid-friendly toggle
- [x] Rewrite documents page with Add/Edit modal and upload button
- [x] Verify build compiles and passes TypeScript checks

## Phase 15 — Real Data Migration and Stays

- [x] Replace remaining demo-backed trip and dashboard flows with API-backed data
- [x] Add dedicated stays model and CRUD API
- [x] Load actual Hyderabad and Egypt family trip flight and hotel data from screenshots into seed data
- [x] Add flight autofill on blur using flight number lookup
- [x] Migrate flights page to real CRUD data
- [x] Migrate places page to real CRUD data with correct Google Maps links
- [x] Add dedicated stays page and navigation
- [ ] Apply targeted visual polish after persistence fixes

## Notes

> Update this file after completing each task. Mark items with [x] when done and [~] when in progress.
>
> **Session 1 (2026-03-09)**: Completed Phase 1 (setup), Phase 2 (schema), Phase 3 (UI shell), Phase 4 (TripIt), Phase 5 (flights). Build compiles successfully. Middleware deprecation warning is cosmetic (Next.js 16 renaming). Prisma v5.22 used due to Node 20.14 compatibility.
>
> **Session 2**: Built all remaining pages and API routes: trip detail page with day selector and activity timeline, itinerary overview, places page with filtering, flights dashboard, document vault, settings page, and full CRUD API routes for trips/activities/places/documents. Added Umrah/prayer features: Aladhan API client for prayer times, prayer times widget with current/next prayer tracking, Umrah step-by-step checklist with 6 steps (du'as, tips, kid-friendly notes), du'as reference with 7 essential du'as, holy places guide for Makkah and Madinah, prayer times API route. Build compiles successfully with 22 routes total.
>
> **Session 3**: Installed @dnd-kit packages for drag-and-drop. Created comprehensive seed data script (prisma/seed.ts) with both trips fully populated. Built sortable activity list component with drag-and-drop reordering. Created Google Calendar bi-directional sync API routes (push/pull). Built nearby recommendations page with Google Places API, city selector, category filters, kid-friendly/open-now toggles. Configured PWA with manual service worker (offline page, cache-first strategy). Added Discover page to sidebar and bottom nav. Build compiles successfully with 26 routes.
>
> **Session 3 (continued — deployment)**: Deployed app to Azure. App name set to `hammadtravel` at `https://hammadtravel.azurewebsites.net`. Resource group `rg-familytravelapp`, location `swedencentral`. Used `az deployment sub create` for provisioning and `az webapp deploy --type zip` for deployment. Key discoveries: WEBSITE_RUN_FROM_PACKAGE must NOT be set; Oryx must be disabled (ENABLE_ORYX_BUILD=false, SCM_DO_BUILD_DURING_DEPLOYMENT=false); startup command is `node server.js`. Created README.md and ARCHITECTURE.md. Pushed to GitHub at https://github.com/haslam93/FamilyTravelApp.
>
> **Session 3 (fixes)**: Fixed 3 broken Unsplash image URLs (Hyderabad photo-1572638075568 → photo-1599661046289, Cairo photo-1539768942893 → photo-1553913861, Makkah photo-1591604129939 → photo-1580418827493). Rewrote CI/CD workflow: replaced `azure/webapps-deploy@v3` with `az webapp deploy --type zip`, added PostgreSQL auto-start, deployment health-check, and proper zip packaging via tar. Updated all documentation.
>
> **Session 4 (UI rethink + CRUD)**: Removed TripIt integration entirely (API shut down per help.tripit.com). Fixed Google Calendar OAuth — settings page was redirecting to callback URL instead of Google consent screen; created new `/api/auth/google/start` route. Full UI redesign across all pages: dashboard with floating emojis, gradient hero card, animated family avatars, 6 quick action buttons; trip detail page with Edit Trip modal (name, dates, travelers, cities), Edit Flight modal (full flight form), inline add/edit/delete for flights; flights page with full CRUD modals; places page with Add/Edit/Delete modals and kid-friendly toggle; documents page with Add/Edit modal. Fixed trailing code in trip page, TypeScript `type: "spring"` narrowing issues. Build compiles cleanly.
>
> **Session 5 (deployment hardening)**: Stabilized GitHub Actions by fixing lint blockers, switching artifact packaging from invalid tar-based zip generation to a real zip, and updating Bicep to preview on every deploy while only applying infra when infra files change. Reworked Azure PostgreSQL access to use App Service managed identity with Microsoft Entra authentication, added PostgreSQL principal/permission setup in the deploy workflow, updated runtime Prisma connection handling for token refresh, and refreshed README and environment documentation.
>
> **Session 6 (real data migration)**: Began replacing demo-backed travel flows with database-backed data. Added a new implementation phase for dedicated stays, real flight CRUD, and loading actual Hyderabad and Egypt family trip travel records from provided screenshots so the app data matches the itinerary being planned.
>
> **Session 6 (implementation checkpoint)**: Added a dedicated `Stay` model to Prisma, created `/api/flights` and `/api/stays` CRUD routes, updated the trip detail page to prefer API data while falling back to local data, added flight-number autofill on blur in the flight editor, and loaded the screenshot-based Hyderabad and Egypt/Umrah flights and hotel stays into both seed data and the trip fallback state. Local database sync was blocked because `DATABASE_URL` is not configured in the current shell, so `prisma db push` and reseeding could not be executed from this environment.
>
> **Session 6 (UI migration completion)**: Replaced the remaining demo-backed dashboard, flights, and places views with API-backed implementations, added the dedicated stays page and navigation entries, and corrected place link generation so Google Maps actions use persisted place IDs or stable query URLs.
