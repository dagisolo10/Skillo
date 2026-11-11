# Skillo Web

The Skillo frontend — a peer-to-peer skill-exchange network UI (Next.js 16, App Router, TanStack Query, Tailwind 4, Supabase auth).

## Running

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Auth runs against the local Supabase stack (`NEXT_PUBLIC_SUPABASE_URL` in `.env`).

## Mock data mode

While the NestJS backend is not wired up, **all domain data comes from a hardcoded in-memory dataset** — no localStorage, no backend calls:

- `src/lib/mock/data.ts` — the hardcoded dataset (users, skills, sessions, matches, demands, ledger).
- `src/lib/mock/db.ts` — the read/write layer the TanStack Query hooks call. Mutations update the in-memory arrays (plus the query cache with optimistic updates); **a browser refresh resets everything** to the hardcoded state.
- `src/hooks/tan-stack/*` — the hooks. They resolve mock data and expose the same query/mutation shapes the real API will use, so swapping `db.ts` for real HTTP calls later is a drop-in change.

Supabase remains the only real integration: it owns sign-in/sign-up and the session. The signed-in identity is merged over the hardcoded demo user (Dagmawi Benti, `u-me`) until you edit your profile locally. Other "network" users are simulated — background peers accept bookings and reply to chat on timers, and live pages poll with `refetchInterval`.

## Structure

- `src/app/(app)/` — app pages (dashboard, skills, sessions, demands, matches, profile, public profiles).
- `src/components/` — UI kit (`ui/`) and domain components (`skills/`, `sessions/`, `auth/`).
- `src/types/` — domain models, DTOs, and query/mutation option types.
- `src/constants/query-keys.ts` — TanStack Query key factories.
