# Architecture

Humphrey Come Home is a client-side React SPA backed by Supabase (Postgres, Auth, Storage). There is no custom server.

## How Data Flows

```
Component → TanStack Query Hook → Supabase Client → Supabase API
```

Components never call Supabase directly — all data access goes through query hooks in `src/hooks/queries/`. TanStack Query handles caching, background refetching, and loading/error states.

## Auth

We use Supabase OTP (email-based, no passwords). The flow:

1. User enters email → receives a one-time code
2. Code is verified → Supabase returns a session
3. `AuthContext` listens to `onAuthStateChange` and stores the user in state
4. `useAuth()` exposes `user`, `loading`, `signInWithOtp`, `verifyOtp`, `signOut`
5. Profile data is fetched separately via `useProfile()` (React Query, not context)
6. Protected routes use `ProtectedRoute` wrapper which redirects to `/login` if not signed in

Sessions are persisted in `localStorage` by the Supabase client.

## State Management

| What | How |
|---|---|
| Server data (DB rows) | TanStack Query |
| Auth state | React Context (`AuthContext`) |
| UI state (forms, toggles) | `useState` |

No Redux, Zustand, or other global state libraries.

## Routes

Defined in `App.jsx`. All routes are lazy-loaded except Landing.

| Path | Screen | Auth? |
|---|---|---|
| `/` | Landing | No |
| `/search` | SearchResults | No |
| `/login` | Login | No |
| `/signup` | SignUp (redirects to Login) | No |
| `/lost` | LostAnimal | No |
| `/found` | FoundAnimal | No |
| `/image-search` | ImageSearch | No |
| `/posts/:id` | PostDetail | No |
| `/animals/:id` | AnimalDetail | No |
| `/profile` | Profile | Yes |
| `/settings` | Settings | Yes |
| `/privacy`, `/terms`, `/cookies` | Legal pages | No |
| `*` | NotFound | No |

## External Services

- **Supabase** — database, auth, file storage
- **Google Maps Places API** — location autocomplete in `LocationInput`

## Storage Buckets

| Bucket | Purpose |
|---|---|
| `avatars` | Profile pictures |
| `posts` | Lost/found pet photos |

Both are public-read, authenticated-write.
