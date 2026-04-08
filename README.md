# ServiceFlow

A full-stack service request and reporting system for managing internal company requests — built as a full-stack assessment project.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)

---

## Overview

ServiceFlow allows teams to submit, track, and manage service requests across departments. It features a full reporting dashboard, role-based access control, and a clean business-ready UI.

## Features

- **Role-based auth** — Admin and User roles via Auth.js v5
- **CRUD requests** — Create, view, edit, soft-delete
- **Auto-generated codes** — Format: `SR-YYYY-NNNN`
- **Search & filters** — By status, type, department, priority, date
- **Dashboard** — Summary cards + 4 real-time charts
- **Reports** — Date range filters, grouped breakdowns (status/type/dept/priority)
- **Admin panel** — User management, role promotion/demotion

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui |
| ORM | Drizzle ORM |
| Database | PostgreSQL 16 |
| Auth | Auth.js v5 (credentials + JWT) |
| Validation | Zod v4 + React Hook Form |
| Charts | Recharts |
| Tables | TanStack Table v8 |
| Notifications | Sonner |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ running locally

### 1. Clone and install

```bash
git clone https://github.com/JayaTci/ServiceFlow.git
cd ServiceFlow
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/serviceflow"
AUTH_SECRET="your-secret"   # openssl rand -base64 32
AUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
# Create the database in PostgreSQL first
createdb serviceflow

# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role  | Email                    | Password |
|-------|--------------------------|----------|
| Admin | admin@serviceflow.com    | admin123 |
| User  | john@serviceflow.com     | user123  |
| User  | maria@serviceflow.com    | user123  |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register
│   ├── (dashboard)/     # Dashboard, Requests, Reports, Admin
│   └── api/auth/        # Auth.js handlers
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Sidebar, Header
│   ├── dashboard/       # Summary cards, Charts
│   ├── requests/        # Table, Form, Badges
│   ├── reports/         # Date range filter
│   └── admin/           # User management
├── lib/
│   ├── db/              # Drizzle schema, client, seed
│   ├── auth/            # Auth.js config, actions
│   ├── actions/         # Server actions (requests, users)
│   ├── queries/         # DB read queries
│   └── validations/     # Zod schemas
└── types/               # Shared TypeScript types
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Drizzle Studio |

## Screenshots

> Dashboard, request list, reports, and admin pages available after setup.
