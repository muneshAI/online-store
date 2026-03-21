# Codex Ideas OS

This project is now a lightweight **full-stack** idea execution app instead of a static page.

## What changed

- Added a Node.js server that serves the frontend and exposes backend APIs.
- Added demo authentication with cookie-based sessions.
- Added file-backed persistence so idea notes, owners, and statuses survive refreshes and restarts.
- Upgraded the frontend into a real workspace where ideas can be filtered, assigned, annotated, and saved.
- Added configured payment-system identities for eSewa and Khalti using `+977 9802100151`.

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


## Put it on the internet

This local sandbox cannot publish a permanent public URL by itself, but the project is now ready to deploy.

### Fastest option: Render

1. Push this repository to GitHub.
2. Sign in to Render.
3. Create a new **Blueprint** or **Web Service** from the repo.
4. Render will detect `render.yaml` and use:
   - `npm install` as the build command
   - `npm start` as the start command
5. After deploy, Render will give you a public URL such as `https://codex-ideas-os.onrender.com`.

### Docker option

You can also deploy anywhere that supports Docker:

```bash
docker build -t codex-ideas-os .
docker run -p 8000:8000 codex-ideas-os
```

Then deploy that container to Render, Railway, Fly.io, or any VPS.
