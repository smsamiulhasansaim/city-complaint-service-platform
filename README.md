# City Complaint Service Platform — Frontend

Next.js 16 (App Router) frontend for the City Complaint & Service Platform.
Three roles (Citizen, Agent, Admin), Stripe payments, complaint timeline,
service requests, notifications, and admin analytics.

## Stack

- **Framework:** Next.js 16.3+ (App Router, React 19)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (`@theme` tokens in `app/globals.css`)
- **Data fetching:** TanStack Query v5
- **Client state:** Zustand
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Charts:** Recharts
- **Toasts:** Sonner
- **Lint/format:** Biome
- **Package manager:** pnpm

## Auth model

- Backend issues a JWT on login/register/Google.
- The Next.js BFF route handlers (`app/api/auth/*`) call the backend, set the
  JWT in an **httpOnly cookie**, and return only the user object to the browser.
- Authenticated requests go through `app/api/proxy/[...path]` which reads the
  cookie and forwards the `Authorization: Bearer` header to the backend.
- The client never sees or persists the JWT.
- `middleware.ts` performs role-based route guarding (UX only; the backend
  verifies every request).

## Getting started

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL and (optionally) Cloudinary + Google client ID.

# 3. Run
pnpm dev