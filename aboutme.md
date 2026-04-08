# ServiceFlow — Project Overview

## What Is ServiceFlow?

ServiceFlow is a full-stack internal service request management system built for organizations that need a structured, trackable way to handle operational requests across departments. It replaces ad-hoc emails, chat messages, and spreadsheets with a centralized platform where employees submit requests, track their status, and administrators manage workflows end-to-end.

The system is designed for small-to-medium organizations — HR, IT, facilities, and operations teams — who need accountability and visibility over internal service delivery without the complexity of enterprise ticketing systems.

---

## Problem It Solves

Without a dedicated system, internal service requests get lost in email threads, forgotten in chat, or tracked inconsistently across spreadsheets. ServiceFlow brings:

- **Traceability** — every request has a unique code, status trail, and ownership
- **Accountability** — assigned roles and departments make responsibility clear
- **Visibility** — dashboards and reports let leadership see bottlenecks and workload distribution
- **Standardization** — request types, priorities, and statuses enforce a consistent process

---

## Core Capabilities

### Service Request Lifecycle
Employees create service requests with a title, description, type, department, priority, and date. The system auto-generates a unique request code (`SR-YYYY-NNNN`). Requests move through a defined status workflow:

```
Pending → In Progress → Resolved → Closed
                              ↘ Cancelled
```

Users can edit their own requests; admins can edit any request. Deleted requests use soft delete — data is preserved with a `deleted_at` timestamp.

### Request Types
- IT Support
- Maintenance
- Office
- Document Processing
- General

### Priority Levels
`Low` · `Medium` · `High` · `Urgent`

### Role-Based Access Control
Two roles: **Admin** and **User**.

| Capability | User | Admin |
|---|---|---|
| Create requests | ✓ | ✓ |
| Edit own requests | ✓ | ✓ |
| Edit any request | ✗ | ✓ |
| View all requests | ✓ | ✓ |
| Access admin panel | ✗ | ✓ |
| Manage users | ✗ | ✓ |
| View reports | ✓ | ✓ |

### Dashboard
Real-time summary of request activity:
- KPI cards: Total, Pending, In Progress, Resolved counts
- Pie chart: requests by status
- Bar charts: by request type, by department, monthly trend (last 6 months)
- Recent requests quick list

### Reports Module
Date-range filtered analysis with four breakdowns:
- By Status
- By Request Type
- By Department
- By Priority

Each tab renders a chart + breakdown table with counts and percentages.

### Admin User Management
Admins can view all users, promote/demote roles, create new accounts with role assignment, and delete users (self-deletion protected).

### Search & Filter
Request list supports:
- Full-text search by title, request code, department
- Filters: status, type, department, priority
- URL-synced state (bookmarkable, shareable filter combinations)
- Server-side pagination (10 per page)

---

## Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Lucide React |
| Database | PostgreSQL 16 |
| ORM | Drizzle ORM + Drizzle Kit |
| Auth | Auth.js v5 (next-auth@beta), bcryptjs |
| Forms | React Hook Form + Zod v4 |
| Charts | Recharts 3 |
| Tables | TanStack Table v8 |
| Notifications | Sonner |
| Date Utilities | date-fns 4 |

### Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register pages
│   ├── (dashboard)/     # Protected app routes
│   │   ├── page.tsx     # Dashboard home
│   │   ├── requests/    # Request list, new request, detail/edit
│   │   ├── reports/     # Reports module
│   │   └── admin/       # Admin panel (users management)
│   └── api/             # API route handlers
├── components/          # Shared UI components
├── lib/
│   ├── actions/         # Server Actions (mutations)
│   ├── auth/            # Auth.js config + session helpers
│   ├── db/              # Drizzle schema, seed, DB client
│   ├── queries/         # Server-side data fetching (requests, users)
│   └── validations/     # Zod schemas
└── types/               # Shared TypeScript types
```

### Database Schema

Two core tables:

**`users`**
- `id`, `name`, `email` (unique), `password_hash`, `role` (admin/user), `department`, timestamps

**`service_requests`**
- `id`, `request_code` (unique, auto-generated), `title`, `description`, `request_type`, `department`, `requested_by_id` (FK → users), `date_requested`, `priority`, `status`, `deleted_at` (soft delete), timestamps

### Data Flow

```
Browser → Next.js Server Component (fetch query) → Drizzle ORM → PostgreSQL
Browser → Form Submit → Server Action → Zod validation → Drizzle mutation → DB
Auth.js manages sessions via JWT; middleware enforces route protection
```

---

## Design & UX

- Dark mode default, light mode toggle via `next-themes`
- Responsive layout: collapsible drawer sidebar on mobile, persistent sidebar on desktop
- Skeleton loading states on all data-heavy pages
- Error boundaries per route
- Toast notifications (Sonner) for all create/update/delete operations
- Clean, business-professional visual language

---

## Security Model

- Passwords hashed with bcryptjs
- Sessions via Auth.js JWT (server-validated on every request)
- Middleware protects all `/admin/**` routes from non-admin access
- All mutations go through Server Actions with server-side Zod validation
- Role checks enforced on both client (UI hiding) and server (action guards)

---

## Who Built This

Built by **Chester** as a full-stack portfolio project demonstrating modern Next.js App Router architecture, type-safe database access with Drizzle ORM, and production-ready authentication with Auth.js v5.
