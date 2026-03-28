# Humphrey Come Home

A lost pet reunion web app that helps families find missing pets by searching nearby shelters, reporting found animals, and connecting pet owners in their community.

## Tech Stack

React 19, Vite 6, React Router 7, TanStack Query 5, Supabase, CSS Modules

## Quick Start

```bash
# Install Node.js 18+ if you don't have it: https://nodejs.org
git clone https://github.com/ChicoState/humphrey-come-home.git
cd humphrey-come-home
npm install             # install the required dependencies using node package manager
cp .env.example .env    # fill in API your keys
npm run dev             # http://localhost:5173 starts the local frontend test server
```

See [docs/setup.md](docs/setup.md) for full setup instructions (Supabase, Google Maps, env vars).

## Documentation

| Doc | What's in it |
|---|---|
| [Setup](docs/setup.md) | Local dev setup, environment variables, troubleshooting |
| [Architecture](docs/architecture.md) | Data flow, auth, routing, state management |
| [Database Schema](docs/database-schema.md) | Tables, RLS policies, storage buckets |
| [Components](docs/components.md) | UI library reference, primitives, adding new components |

## License

[GNU General Public License v3.0](LICENSE)
