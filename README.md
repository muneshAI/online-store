# Codex Ideas OS

This project is now a lightweight **full-stack** idea execution app instead of a static page.

## What changed

- Added a Node.js server that serves the frontend and exposes backend APIs.
- Added demo authentication with cookie-based sessions.
- Added file-backed persistence so idea notes, owners, and statuses survive refreshes and restarts.
- Upgraded the frontend into a real workspace where ideas can be filtered, assigned, annotated, and saved.

## Demo login

By default, use:

- **Email:** `admin@munesh.ai`
- **Password:** `codex123`

You can override these with environment variables:

```bash
DEMO_EMAIL=owner@example.com DEMO_PASSWORD=supersecret npm start
```

## Run locally

```bash
npm start
```

Then open `http://127.0.0.1:8000`.

## API endpoints

- `POST /api/login`
- `POST /api/logout`
- `GET /api/session`
- `GET /api/ideas`
- `PATCH /api/ideas/:id`

## Persistence

The app seeds its data from `data/seed.json` and stores live edits in `storage/ideas-db.json`.

## Scripts

- `npm start` — run the server.
- `npm run check` — syntax check backend and frontend JavaScript.
