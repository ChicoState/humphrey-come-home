# Humphrey Come Home

A lost pet reunion web app that helps families find missing pets by searching nearby shelters, reporting found animals, and connecting pet owners in their community.

## Tech Stack

[React 19](https://react.dev), [Vite 6](https://vite.dev), [React Router 7](https://reactrouter.com), [TanStack Query 5](https://tanstack.com/query), [Supabase](https://supabase.com)

### Packages

[Lucide React](https://lucide.dev), [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps)

## Setup

DM me (@Jaden Watson) on Slack for API keys and credentials.

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
```

All variables are `VITE_`-prefixed so Vite exposes them to the client. Don't put secret keys here.

## Documentation

| Doc | What's in it |
|---|---|
| [Architecture](docs/architecture.md) | Data flow, auth, routing, state management |
| [Database Schema](docs/database-schema.md) | Tables, RLS policies, storage buckets |
| [Components](docs/components.md) | UI library reference, primitives, adding new components |

## License

[GNU General Public License v3.0](LICENSE)
