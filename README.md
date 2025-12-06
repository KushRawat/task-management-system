# Task Management System – Full-Stack

Complete implementation for the Task Management System with a secure Node.js API (TypeScript + Prisma + JWT) and a polished Next.js (App Router) frontend.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma (SQLite by default), JWT access/refresh tokens, bcrypt, Zod validation.
- **Frontend:** Next.js 14 (App Router) + TypeScript, Tailwind CSS, React Query, Zustand, React Hook Form + Zod, React Hot Toast.
- **Auth:** Short-lived access tokens in-memory + auto refresh via httpOnly cookie; password hashing; refresh rotation + revocation.

## Quickstart
### Backend
1) `cd backend && npm install`
2) Copy env: `cp .env.example .env` (set strong secrets and database URL if not using SQLite).
3) Generate + migrate Prisma: `npx prisma generate && npx prisma migrate dev --name init`
4) Run dev server: `npm run dev` (default `http://localhost:4000`)

### Frontend
1) `cd frontend && npm install`
2) Copy env: `cp .env.example .env.local` (update API base URL if needed).
3) Run dev server: `npm run dev` (default `http://localhost:3000`)

## API Highlights
- `POST /auth/register | /auth/login | /auth/logout | /auth/refresh` – JWT auth with refresh rotation + cookie storage.
- `GET /tasks` – Pagination, status filter, and title search scoped to the authenticated user.
- `POST /tasks` – Create task; `PATCH /tasks/:id` – Update; `DELETE /tasks/:id` – Remove; `PATCH /tasks/:id/toggle` – Quick status toggle.

## Frontend Experience
- Responsive dashboard with gradient/glass aesthetic, bold typography, and crisp cards.
- Task filters (search + status), paginated lists, optimistic CRUD with toasts, and modal create/edit forms.
- Auth forms with Zod validation; session persisted in Zustand; automatic token refresh on 401.

## Testing & Notes
- The backend uses Prisma with SQLite for easy local setup; swap `DATABASE_URL` for Postgres/MySQL as needed.
- Global error handling returns clear messages and standard status codes.
- If you hit auth issues, clear cookies for `localhost` and re-login to rotate refresh tokens.
