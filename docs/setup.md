# Setup Guide

How to get Humphrey Come Home running locally.

## Prerequisites

- Node.js 18+ (`node --version`)
- A [Supabase](https://supabase.com) project (free tier works)
- A Google Maps API key with Places API enabled

## 1. Clone and Install

```bash
git clone https://github.com/ChicoState/humphrey-come-home.git
cd humphrey-come-home
npm install
```

## 2. Supabase Setup

If you're working on the existing project, ask a team member for the Supabase credentials and skip to step 5.

If setting up a new project:

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. In the SQL Editor, run the schema from `docs/database-schema.md`
3. Create two **public** storage buckets: `avatars` and `posts`
4. Go to Dashboard > Settings > API and copy the **Project URL** and **publishable** key

## 3. Google Maps API Key

1. In [Google Cloud Console](https://console.cloud.google.com), enable **Maps JavaScript API**, **Places API**, and **Geocoding API**
2. Create an API key and restrict it to `http://localhost:5173/*` for dev

## 4. Environment Variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

All variables are `VITE_`-prefixed so Vite exposes them to the client. Don't put secret keys here.

## 5. Run

```bash
npm run dev        # dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

## Troubleshooting

| Problem | Fix |
|---|---|
| "Invalid API key" in console | Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`. Restart dev server after changes. |
| Autocomplete not working | Verify Places API is enabled in Google Cloud and API key isn't restricted to a different referrer. |
| "Permission denied for table" | RLS policies may be missing. Check `docs/database-schema.md` for the expected policies. |
| Port 5173 in use | `npm run dev -- --port 3000` |
