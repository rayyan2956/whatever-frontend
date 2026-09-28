# whatever-frontend

Landing page and customer website (Next.js 16). Talks to `whatever-backend`.

## Run it

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3001
```

The API must be running at `NEXT_PUBLIC_API_URL` with `http://localhost:3001` in its `CORS_ORIGINS`.

## What's here

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/login`, `/register` | Email + password, and Google when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set |
| `/verify-email`, `/forgot-password`, `/reset-password` | Links from emails |
| `/account` | Profile, change password, logged-in devices (protected) |

## Auth

`src/lib/api.ts` keeps the access token in memory only. The refresh token is an httpOnly cookie (`wf_rt`) set by the API, so JavaScript never sees it. On a `TOKEN_EXPIRED` response the client refreshes once (single-flight) and retries. On page load, `AuthProvider` calls `/auth/refresh` to restore the session.

`src/lib/api.ts`, `auth.tsx`, `errors.ts` and `components/ui.tsx` are shared with `whatever-vendor` and `whatever-admin` by copy. Keep them in sync until types are generated from the API's OpenAPI spec (`/docs-json`).
