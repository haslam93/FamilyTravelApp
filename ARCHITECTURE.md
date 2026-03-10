---
title: Architecture Overview
description: High-level architecture diagram and component breakdown for the Family Travel Companion App
author: Hammad Aslam
ms.date: 2026-03-10
ms.topic: concept
---

## System Architecture

```mermaid
graph TB
    subgraph Client["Client (Browser / PWA)"]
        SW["Service Worker<br/>Offline Cache"]
        UI["Next.js App Router<br/>React + Tailwind + shadcn/ui<br/>Framer Motion"]
    end

    subgraph Azure["Azure Cloud"]
        subgraph AppService["Azure App Service (Linux, Node 20)"]
            SSR["Next.js Server<br/>Standalone Build"]
            API["API Routes<br/>/api/*"]
            MW["Middleware<br/>PIN Gate"]
        end

        subgraph Data["Data Layer"]
            PG["Azure Database for<br/>PostgreSQL Flexible Server<br/>v16 (Burstable B1ms)"]
            BLOB["Azure Blob Storage<br/>documents container"]
        end

        MI["User-Assigned<br/>Managed Identity"]
    end

    subgraph External["External APIs"]
        TRIPIT["TripIt API<br/>OAuth 1.0a"]
        AIRLABS["AirLabs API<br/>Flight Status"]
        GCAL["Google Calendar<br/>OAuth 2.0"]
        GMAPS["Google Maps /<br/>Places API"]
        ALADHAN["Aladhan API<br/>Prayer Times"]
    end

    subgraph CI["CI/CD"]
        GH["GitHub Actions<br/>OIDC Federated Creds"]
        BICEP["Bicep IaC<br/>4 Modules"]
    end

    UI --> SW
    UI -->|HTTPS| MW
    MW --> SSR
    MW --> API

    API -->|Prisma ORM| PG
    API -->|Managed Identity| BLOB
    API --> TRIPIT
    API --> AIRLABS
    API --> GCAL
    API --> GMAPS
    API --> ALADHAN

    MI -.->|Auth| AppService
    MI -.->|Auth| PG
    MI -.->|Auth| BLOB

    GH -->|Deploy| AppService
    BICEP -->|Provision| Azure
```

## Component Breakdown

### Frontend Layer

```mermaid
graph LR
    subgraph Pages["App Router Pages"]
        DASH["/ Dashboard"]
        TRIP["/trip/[id]"]
        ITIN["/itinerary"]
        PLACES["/places"]
        DISC["/recommendations"]
        FLT["/flights"]
        DOCS["/documents"]
        UMRAH["/umrah"]
        SETT["/settings"]
        PIN["/pin"]
    end

    subgraph Components["Shared Components"]
        NAV["Sidebar / BottomNav"]
        TRIP_CARD["TripCard"]
        ACT_CARD["ActivityCard"]
        FLT_CARD["FlightCard"]
        PLACE_CARD["PlaceCard"]
        DOC_CARD["DocumentCard"]
        PRAYER["PrayerTimesWidget"]
        UMRAH_CL["UmrahChecklist"]
        DND["SortableActivityList<br/>@dnd-kit"]
    end

    Pages --> Components
```

### API Layer

```mermaid
graph TD
    subgraph Routes["API Routes (/api)"]
        R1["/trips — CRUD"]
        R2["/activities — CRUD + reorder"]
        R3["/places — CRUD + visited toggle"]
        R4["/documents — Upload / download"]
        R5["/flights/status — AirLabs proxy"]
        R6["/prayer-times — Aladhan proxy"]
        R7["/recommendations — Places Nearby"]
        R8["/tripit/sync — TripIt import"]
        R9["/calendar/sync — Google Calendar push/pull"]
        R10["/calendar/calendars — List calendars"]
        R11["/auth/pin — PIN verification"]
        R12["/auth/google/callback — OAuth callback"]
    end

    subgraph Clients["API Clients (src/lib)"]
        C1["tripit-client.ts"]
        C2["airlabs-client.ts"]
        C3["google-calendar-client.ts"]
        C4["prisma.ts"]
    end

    Routes --> Clients
```

### Data Model

```mermaid
erDiagram
    Trip ||--o{ TripDay : "has days"
    Trip ||--o{ Flight : "has flights"
    Trip ||--o{ Document : "has documents"
    TripDay ||--o{ Activity : "has activities"
    TripDay ||--o{ Place : "has places"
    TripDay ||--o{ Recommendation : "has recommendations"
    Trip ||--o{ CalendarSync : "syncs with"

    Trip {
        string id PK
        string name
        string destination
        datetime startDate
        datetime endDate
        string status
        string type
    }

    TripDay {
        string id PK
        int dayNumber
        datetime date
        string city
        string notes
    }

    Activity {
        string id PK
        string title
        string type
        datetime startTime
        datetime endTime
        string status
        int sortOrder
    }

    Flight {
        string id PK
        string airline
        string flightNumber
        string departure
        string arrival
        string status
    }

    Place {
        string id PK
        string name
        string category
        float rating
        boolean visited
    }

    Document {
        string id PK
        string name
        string type
        string blobUrl
    }

    Recommendation {
        string id PK
        string name
        string category
        float rating
    }

    CalendarSync {
        string id PK
        string calendarId
        string eventId
    }

    Settings {
        string id PK
        string key
        string value
    }
```

### Azure Infrastructure

```mermaid
graph TB
    subgraph Subscription["Azure Subscription"]
        subgraph RG["Resource Group (rg-{env})"]
            MI["User-Assigned<br/>Managed Identity<br/>azid{token}"]
            ASP["App Service Plan<br/>Linux B1<br/>azasp{token}"]
            APP["Web App<br/>Node 20 LTS<br/>azapp{token}"]
            PG["PostgreSQL<br/>Flexible Server v16<br/>Burstable B1ms<br/>azpg{token}"]
            ST["Storage Account<br/>Standard LRS<br/>azst{token}"]
            CONT["Blob Container<br/>documents"]
        end
    end

    ASP --> APP
    ST --> CONT
    MI -.->|Identity| APP
    MI -.->|AAD Auth| PG
    MI -.->|Blob Data Contributor| ST
    APP -->|DATABASE_URL| PG
    APP -->|Managed Identity| ST
```

### CI/CD Pipeline

```mermaid
graph LR
    subgraph Trigger["Triggers"]
        PUSH["Push to main"]
        PR["Pull Request"]
        MANUAL["workflow_dispatch"]
    end

    subgraph Jobs["GitHub Actions Jobs"]
        BUILD["Build<br/>npm ci → prisma generate<br/>→ lint → next build"]
        INFRA["Infra<br/>az deployment sub create<br/>Bicep templates"]
        DEPLOY["Deploy<br/>azure/webapps-deploy<br/>+ prisma migrate"]
    end

    PUSH --> BUILD
    PR --> BUILD
    PUSH --> INFRA
    MANUAL --> INFRA
    BUILD --> DEPLOY
    INFRA --> DEPLOY
```

## Design Principles

* **Kid-friendly UI** — Vibrant colors, rounded shapes, playful animations, and large touch targets suitable for family members of all ages
* **Mobile-first** — Responsive design that works seamlessly on phones and tablets while traveling
* **Offline-capable** — Service worker caches pages and static assets for use without connectivity
* **Zero-password infrastructure** — All Azure services authenticate via Managed Identity; no connection strings or passwords stored in configuration
* **Infrastructure as Code** — All Azure resources defined in Bicep, deployable via `azd up` or `az deployment sub create`
* **Continuous delivery** — Every push to `main` provisions infrastructure and deploys automatically through GitHub Actions with OIDC
