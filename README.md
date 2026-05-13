# Humphrey Come Home

A lost pet reunion web app that helps families find missing pets by searching nearby shelters, reporting found animals, and connecting pet owners in their community.

Live at [humphrey-come-home.netlify.app](https://humphrey-come-home.netlify.app/).

## Tech Stack

[React 19](https://react.dev), [Vite 6](https://vite.dev), [React Router 7](https://reactrouter.com), [TanStack Query 5](https://tanstack.com/query), [Supabase](https://supabase.com)

### Packages

[Lucide React](https://lucide.dev), [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps)

## Setup

### Prerequisites

- [Node.js](https://nodejs.org) 18+ (`node --version`)
- [Supabase](https://supabase.com/dashboard/project/mbviihyrshzccqhlhvab) project URL and publishable key
- [Google Maps](https://console.cloud.google.com) API key with Maps JavaScript API, Places API, and Geocoding API enabled

### Install and Run

```bash
git clone https://github.com/ChicoState/humphrey-come-home.git
cd humphrey-come-home
npm install             # install the required dependencies using node package manager
cp .env.example .env    # fill in our API keys 
npm run dev             # http://localhost:5173 start the local frontend test server
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_SITE_URL=https://humphrey-come-home.netlify.app

# Server-side only for scripts/backfill-shelter-coords.mjs
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Only variables with the `VITE_` prefix are exposed to the browser by Vite. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only; do not add a `VITE_` prefix to it.

The Google Maps key is locked to specific referrers. If your dev port isn't already on the list, add it in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — e.g. `http://localhost:5173/*`. Wildcard ports aren't accepted.

For production auth emails, set `VITE_SITE_URL` in Netlify to the public frontend origin. Also add the same origin to Supabase Auth redirect URLs, for example `https://humphrey-come-home.netlify.app/*`. Otherwise Supabase may fall back to a localhost Site URL in magic-link emails.

## Documentation

| Doc | What's in it |
|---|---|
| [Architecture](docs/architecture.md) | Data flow, auth, routing, state management |
| [Database Schema](docs/database-schema.md) | Tables, RLS policies, storage buckets |
| [Components](docs/components.md) | UI library reference, primitives, adding new components |

## License

[GNU General Public License v3.0](LICENSE)
