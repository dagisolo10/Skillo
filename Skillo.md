---
title: Skillo
tags: [app-idea, web-app, skill-swap, community, project]
status: planning
created: 2026-11-10
---

# Skillo

## One-liner

A web app where people teach what they're good at to earn credits, and spend credits to learn what they want. **Teach to learn.**

## Why it fits the goals

- Not a tracker, not a generic app
- Real value: learning from real people
- Built-in reasons to return: credits to earn and spend, ongoing sessions, teaching reputation

## Core concept

- Each person creates a profile with:
    - Skills they are good at (offered)
    - Skills they want to learn (wanted)
- **Matching is one-directional.** A match happens whenever someone's offered skill is on another person's want list. No mutual swap required.
    - Example: Ben is good at TypeScript, guitar, skateboarding and wants Python. John is good at Python and drums. Ben and John match, because John offers what Ben wants.
- Flexible format: people choose how to learn together, not a fixed live-video session.

## Credit economy

- Teaching someone earns the teacher a credit.
- Learning from someone costs a credit.
- Teachers also earn a badge and profile counts: **taught count** and **learned count**.
- Credit is given only when a session is **closed**, and the profile counts update at that point.

## Skill levels

- Each offered skill carries a tag or experience level (e.g. 10 years vs 6 months).
- Learners know what to expect: a 6-month teacher and a 10-year teacher are not held to the same expectation.

## Browsing and ranking

- Learner sees everyone who offers the skill they want (e.g. "40 people have this skill").
- All of them are visible, sorted by rank. Not only the top-ranked ones are shown, so less experienced teachers still get visibility.
- The learner chooses who they want.

## Demand visibility

- Show how many people want a given skill (e.g. "12 people want to learn guitar").
- Gives people a reason to add what they're good at, and shows where teaching is most needed.

## Connection between users

Two options under consideration (not chosen yet):

1. **Built-in chat**: people don't have to leave the platform.
2. **Contact link**: the app is where people find each other, then they choose where to learn (Telegram, etc.). More flexible.

Suggested: built-in chat as the default, plus an optional shared link to move to Telegram, Zoom, etc. Reasons: close-the-session and credits work best when the conversation lives on the platform, and report/block tools help with safety.

## Sessions

- No timer and no limit.
- Either person can close a session whenever they've learned what they want.
- A closed session becomes **read-only**.
- Credit is given and learned/taught counts update on close.
- Edge case deliberately deferred: learning a second skill inside the same session. A skill takes time to learn, so limiting people isn't ideal. Decide after launch.

## Suggestions to decide on (not confirmed)

- **Starter credits**: new users start with a couple of free credits so they can try learning before teaching.
- **One credit per session**: simple. Long learning becomes several sessions.
- **Hold the credit on accept, pay on close**: stops learners from opening sessions they can't pay for, and ties the teacher's reward to the close.
- **Credit farming guards**: learner confirms the close (quick "did you learn something?" tap or rating), minimum session activity before payout, weekly credit cap per pair.
- **Supply imbalance**: popular skills may have too many learners and few teachers. Demand visibility helps, and high-demand skills could pay more later.
- **Pay it forward nudges**: encourage people who learned a skill to teach it.
- Frame teaching as "share what you know", not "be an expert", since supply is the biggest risk.

## Tech stack

- **Frontend**: Next.js
- **Backend**: dedicated NestJS server (Next.js server-side is stateless, so it can't hold websockets)
- **Database**: PostgreSQL with Prisma ORM, hosted on Supabase
- **Auth**: Supabase Auth
- **Realtime**: Socket.IO for websockets and notifications
- **Client state**: TanStack Query

### Likely additions

- Validation: Zod or class-validator
- NestJS guard verifying the Supabase JWT, also on the Socket.IO handshake
- Prisma with Supabase: pooled connection for the app, direct connection for migrations
- UI: Tailwind + shadcn/ui, React Hook Form + Zod
- **Credits ledger**: a `credit_transactions` table updated in database transactions, not just a balance field
- NestJS hosting: Railway, Render or Fly.io (not Vercel). Next.js can stay on Vercel.
- Rate limiting: `@nestjs/throttler`
- Later: Redis (Socket.IO adapter and jobs), BullMQ (email notifications, stale session reminders, auto-closing abandoned sessions), Resend for email, Sentry, Postgres full-text search + `pg_trgm` for skill lookup, moderation (report/block tables, admin view)
- Alternative to keep in mind: Supabase Realtime instead of Socket.IO
- Optional: pnpm + Turborepo monorepo to share types and schemas, PostHog for analytics

## Risks

- **Cold start**: an empty marketplace is useless. Consider launching in one niche or community first.
- **Supply of teachers**: many want to learn, fewer feel qualified to teach.
- **Trust and safety**: strangers talking to strangers. Needs profiles, ratings, report/block.
- **Credit abuse**: fake sessions between friends.
- **No-shows and abandoned sessions**.

## Naming

- Chosen name: **Skillo**
- Other names considered: Learnloop, Passalong, Skillbarter, Crosstrain, Tradewise, Skilloop
- Rejected: "Skills" (too generic) and "Skillz" (an existing gaming company by that name, as far as I know, and the respelling feels dated)
- TODO: check domain availability, trademark conflicts in software/education, and social handles

## Next steps / ideas to explore

- [ ] Decide chat vs contact link
- [ ] Define credit rules (starter credits, cost per session, hold-and-pay on close)
- [ ] Design anti-farming rules
- [ ] Sketch screens: profile, skill browse, session/chat
- [ ] Prisma schema: users, skills, user skills (offered/wanted), sessions, messages, credit ledger
- [ ] Pick launch niche or community
- [ ] Check name availability for Skillo

## Related

- Collective Story Relay (other shortlisted idea)
