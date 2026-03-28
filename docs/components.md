# Components

Quick reference for the shared component library. Each component has a header comment in its file with the full prop list.

## UI Components (`src/components/ui/`)

| Component | What it does |
|---|---|
| **Button** | Primary action element. Variants: primary, secondary, ghost, danger, outline. Supports loading state and icons. |
| **Input** | Text input or textarea with label and error display. |
| **Card** | Clickable surface. Can render as a `<div>` or React Router `<Link>`. |
| **Badge** | Small colored label for status (success, warning, error, info). |
| **Spinner** | Loading indicator (sm, md, lg). |
| **Image** | Lazy-loaded `<img>` wrapper with optional priority loading. |
| **EmptyState** | Centered placeholder with icon, title, subtitle, and optional CTA button. |
| **Dropdown** | Click-triggered popover menu. |
| **DashedBox** | SVG dashed-border container. |
| **PolaroidRail** | Infinite-scroll marquee of polaroid-style photo cards. |
| **SuggestionList** | Dropdown list for autocomplete suggestions. Used by LocationInput. |

## Form Components (`src/components/forms/`)

| Component | What it does |
|---|---|
| **ImageUpload** | Drag-and-drop image picker with preview. Validates file type and size. |
| **LocationInput** | Google Places autocomplete input with geolocation button. Returns `{ address, lat, lng }`. |

## Layout Components (`src/components/layout/`)

| Component | What it does |
|---|---|
| **Layout** | Page shell — wraps Header + route content + Footer. |
| **Header** | Top nav bar with logo, nav links, and auth controls (profile dropdown or sign-in button). |
| **Footer** | Site footer with product links, external resources, and legal links. |

## Other Components (`src/components/`)

| Component | What it does |
|---|---|
| **ProtectedRoute** | Route wrapper that redirects to `/login` if not authenticated. |
| **ScrollToTop** | Scrolls to top on route changes. |

## Primitives (`src/components/primitives/`)

Composable layout building blocks inspired by SwiftUI.

| Component | What it does |
|---|---|
| **VStack** | Vertical flex container. `gap` prop uses 4px units. |
| **HStack** | Horizontal flex container. Same gap system, optional `wrap`. |
| **ZStack** | `position: relative` wrapper for layering. |
| **Text** | Typography with variants (h1, h2, h3, body, sm, xs, label) and color options. |
| **Container** | Centered max-width wrapper (sm=480, md=640, lg=1024, xl=1200). |
| **Spacer** | `flex: 1` element that pushes siblings apart. |
| **ScrollRail** | Horizontal scroll container with optional marquee animation. |
| **Divider** | Horizontal rule with optional centered text label. |

## Adding a New Component

1. Put it in the right folder: `ui/` for generic widgets, `forms/` for form inputs, `layout/` for page structure.
2. One component per file, with a colocated `.module.css` file.
3. Add a header comment documenting what it does and what props it accepts.
4. Keep it generic — UI components should not import hooks or Supabase.
