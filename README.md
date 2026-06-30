================================================================================
  PROJECT OVERVIEW REPORT
  WatchMe Web App
  Generated: 2026-02-22
================================================================================

--------------------------------------------------------------------------------
1. PROJECT NAME & VERSION
--------------------------------------------------------------------------------
  Name    : web-app (WatcMe Web App)
  Version : 0.0.0 (pre-release / development)
  Type    : ES Module (Private)

--------------------------------------------------------------------------------
2. DESCRIPTION
--------------------------------------------------------------------------------
  WatcMe is a modern web-based movie discovery and tracking application.
  It allows users to:

    - Browse trending, top-rated, and newly released movies
    - Search for movies by title
    - View detailed information about individual movies (overview, rating,
      trailer, genres, director, cast)
    - Save movies to personal collections (Watchlist + custom collections)
      with data persisted in the browser's localStorage

  The app is the web counterpart to a React Native Expo mobile app
  (located at d:/app dev/movie-app/) and replicates much of its feature set
  in a browser-first format.

  API: All media data is sourced from the Simkl API (https://api.simkl.com)
  using a Vite dev-server proxy to avoid CORS restrictions. Images are
  served directly from the Simkl CDN (https://simkl.in).

--------------------------------------------------------------------------------
3. TECH STACK
--------------------------------------------------------------------------------
  RUNTIME & LANGUAGE
    - TypeScript ~5.9.3      (primary language)
    - React 19.2.0           (UI framework)
    - React DOM 19.2.0       (browser renderer)

  BUILD TOOLING
    - Vite 7.3.1             (dev server, bundler, HMR)
    - @vitejs/plugin-react   (Babel-based Fast Refresh)
    - PostCSS 8.5.6
    - Autoprefixer 10.4.24

  ROUTING
    - React Router DOM 7.13.0  (BrowserRouter, nested routes)

  STATE MANAGEMENT
    - Zustand 5.0.11           (lightweight global store)
    - zustand/middleware persist (localStorage persistence)

  STYLING
    - Tailwind CSS 4.2.0       (@tailwindcss/postcss integration)
    - tailwind-merge 3.5.0     (conditional class merging)
    - clsx 2.1.1               (class utility)

  NETWORKING
    - Axios 1.13.5             (HTTP client for Simkl API calls)

  ICONS
    - lucide-react 0.575.0     (icon library: Star, Search, Film, etc.)

  LINTING
    - ESLint 9.39.1
    - eslint-plugin-react-hooks 7.0.1
    - eslint-plugin-react-refresh 0.4.24
    - typescript-eslint 8.48.0

  EXTERNAL API
    - Simkl API (https://api.simkl.com)
      Auth method : Client ID via query param (?client_id=...)
      API key env : VITE_SIMKL_CLIENT_ID (stored in .env)
      Proxy path  : /api/simkl  →  https://api.simkl.com (via Vite)

--------------------------------------------------------------------------------
4. KEY SCRIPTS
--------------------------------------------------------------------------------
  npm run dev       → Start Vite development server with HMR
  npm run build     → TypeScript compile + Vite production build
  npm run lint      → Run ESLint across all source files
  npm run preview   → Preview the production dist locally

--------------------------------------------------------------------------------
5. DIRECTORY STRUCTURE SUMMARY
--------------------------------------------------------------------------------
  d:\app dev\WatcMe web-app\
  │
  ├── src/                          Core application source
  │   ├── main.tsx                  Entry point — mounts <App /> into #root
  │   ├── App.tsx                   Route configuration (BrowserRouter + Routes)
  │   ├── index.css                 Global styles (Tailwind base + custom vars)
  │   │
  │   ├── pages/                    Route-level page components (4 pages)
  │   │   ├── Home.tsx              Home page: hero banner + top-rated + new releases rows
  │   │   ├── Search.tsx            Search page: text input → movie results grid
  │   │   ├── Saved.tsx             Saved page: user collections browser
  │   │   └── MovieDetails.tsx      Detail page: full movie info, trailer, genres, cast
  │   │
  │   ├── components/               Reusable UI building blocks (3 components)
  │   │   ├── AppHeader.tsx         Sticky top navigation bar + mobile bottom nav
  │   │   ├── Layout.tsx            App shell: <AppHeader> + <Outlet> (child routes)
  │   │   └── MediaCard.tsx         Movie card: poster, rating badge, hover effects, link
  │   │
  │   ├── services/                 API and caching layer (2 files)
  │   │   ├── api.ts                Simkl API integration (all fetch functions)
  │   │   └── cache.ts              localStorage cache with 24-hour TTL
  │   │
  │   ├── store/                    Zustand global state (1 store)
  │   │   └── collections.ts        Collections store: CRUD for user saved lists
  │   │
  │   ├── types/                    TypeScript interfaces (1 file)
  │   │   └── ui.ts                 Shared types: Movie, MovieDetails, Collection, etc.
  │   │
  │   └── assets/                   Static image assets
  │
  ├── public/                       Public static files served at root
  ├── dist/                         Production build output (vite build)
  ├── index.html                    HTML shell — Vite entry point
  ├── vite.config.ts                Vite configuration + Simkl API proxy
  ├── tailwind.config.js            Tailwind CSS configuration
  ├── postcss.config.js             PostCSS configuration
  ├── tsconfig.json                 TypeScript project references root
  ├── tsconfig.app.json             TS config for src/ (strict mode)
  ├── tsconfig.node.json            TS config for vite.config.ts
  ├── eslint.config.js              ESLint v9 flat config
  ├── package.json                  NPM manifest
  ├── package-lock.json             Dependency lock file
  ├── .env                          Environment variables (VITE_SIMKL_CLIENT_ID)
  └── .gitignore                    Git ignore rules

--------------------------------------------------------------------------------
6. APPLICATION ROUTES
--------------------------------------------------------------------------------
  /                          Home page          (Home.tsx)
  /search                    Search page        (Search.tsx)
  /saved                     Saved collections  (Saved.tsx)
  /saved/collection/:id      Collection detail  (placeholder — coming soon)
  /details/movie/:id         Movie detail page  (MovieDetails.tsx)
  *                          404 fallback       (inline message)

  All routes share the Layout component which renders AppHeader + page content.

--------------------------------------------------------------------------------
7. KEY MODULES IN DETAIL
--------------------------------------------------------------------------------

  [ src/services/api.ts ]
  ─────────────────────────────────────────────────────────────
  The central API layer. Uses axios with a pre-configured Simkl client
  (baseURL: /api/simkl). All requests are wrapped in `fetchSimkl<T>()`,
  which automatically:
    1. Checks localStorage cache (24h TTL) before each request
    2. Handles HTTP 401 (auth error) and 429 (rate limit) gracefully
    3. Saves successful responses to cache

  Core exported functions:
    getHeroMovies()         → 5 trending-today movies for hero banner
    getTopRatedMovies()     → 10 top-rank trending movies
    getNewReleases()        → 10 trending-this-week movies
    getContentRows()        → Combined { topRated, newReleases }
    getMovieDetails(id)     → Full movie detail by Simkl ID
    searchMovies(query)     → Search results, enriched with genres for top 10
    getMoviesByGenre(genre) → Movies filtered by genre slug
    getGenres()             → Static list of 17 supported genres

  Internal mappers:
    mapSimklToMovie()       → Converts raw Simkl response → Movie type
    mapSimklToDetails()     → Converts raw Simkl response → MovieDetails type
    getPosterUrl(path)      → Constructs https://simkl.in/posters/{path}_m.webp
    getFanartUrl(path)      → Constructs https://simkl.in/fanart/{path}_medium.webp

  Note: Series/Actor functions exist as stubs (return empty/null) for
  future implementation.

  [ src/services/cache.ts ]
  ─────────────────────────────────────────────────────────────
  localStorage-based caching utility with:
    - generateCacheKey(endpoint, params)  → Sorted, deterministic cache key
    - getCachedData<T>(key)               → Returns cached value or null if expired
    - setCachedData<T>(key, data)         → Stores value with current timestamp
    - clearAppCache()                     → Removes all keys with prefix 'movie_app_web_cache_'
  Cache TTL: 24 hours (86,400,000 ms)
  Key prefix: 'movie_app_web_cache_'

  [ src/store/collections.ts ]
  ─────────────────────────────────────────────────────────────
  Zustand store (persisted via localStorage, key: 'movie-app-collections').
  Manages user's saved movie collections.

  State shape:
    collections[]       → Array of Collection objects
    savedItemIds{}      → Hash map for O(1) "is item saved?" lookups

  Actions:
    createCollection(title)                → Adds new custom collection
    deleteCollection(id)                   → Removes collection (non-default only)
    renameCollection(id, newTitle)         → Renames any collection
    addItem(collectionId, item)            → Adds MediaItem to a collection
    removeItem(collectionId, itemId)       → Removes item, updates savedItemIds
    isItemInAnyCollection(itemId)          → O(1) saved status check
    isItemInCollection(collectionId, id)   → Checks membership in a specific list

  Default collection: "Watchlist" (isDefault: true, cannot be deleted)

  [ src/types/ui.ts ]
  ─────────────────────────────────────────────────────────────
  Core TypeScript interfaces used across the entire app:

    Movie              Base media type (id, title, imdbId, genres, imageSet, ...)
    MovieDetails       Extends Movie with cast, director, tagline, budget, revenue
    SeriesDetail       TV series type (future use — currently stubbed in API)
    Actor              { id, name, image, role }
    Episode            { id, title, season, episode, aired, ... }
    ImageSet           { verticalPoster: { w480, w720 }, horizontalPoster: { w1080 } }
    Recommendation     Lightweight item for "similar" suggestions
    Collection         { id, title, isDefault, items: MediaItem[], createdAt }
    MediaItem          Union type = SeriesDetail | MovieDetails
    isMovie()          Type guard to determine if a MediaItem is a MovieDetails

  [ src/components/AppHeader.tsx ]
  ─────────────────────────────────────────────────────────────
  Sticky header component. Renders:
    - App logo (gradient Clapperboard icon + "MovieApp" text)
    - Desktop nav: Home, Search, Saved links (active state highlighting)
    - Mobile bottom nav: fixed bottom bar with icon + label per route

  [ src/components/MediaCard.tsx ]
  ─────────────────────────────────────────────────────────────
  Card component for displaying a Movie in grid/row layouts.
  Features:
    - Lazy-loaded poster image (w480 → w720 fallback → placeholder)
    - Gradient overlay from bottom
    - Rating badge (Star icon + score) in top-right corner
    - Hover: scale-105 + title color shift to indigo
    - Links to /details/movie/{item.imdbId}
    - Configurable width/height (Tailwind class strings)

  [ src/pages/Home.tsx ]
  ─────────────────────────────────────────────────────────────
    - Hero section: full-width fanart banner (first trending movie)
      with gradient overlay + title/description text
    - "Top Rated" horizontal scroll row (10 MediaCards, snap-x)
    - "New Releases" horizontal scroll row (10 MediaCards, snap-x)
    - Data fetched in parallel via Promise.all on mount

  [ src/pages/Search.tsx ]
  ─────────────────────────────────────────────────────────────
    - Controlled text input for movie title queries
    - Calls searchMovies(query) which enriches top 10 results with genres
    - Renders results in a responsive grid of MediaCards

  [ src/pages/Saved.tsx ]
  ─────────────────────────────────────────────────────────────
    - Reads collections from Zustand store
    - Displays all user-created collections + default Watchlist
    - Allows browsing saved media items per collection

  [ src/pages/MovieDetails.tsx ]
  ─────────────────────────────────────────────────────────────
    - Route param: /details/movie/:id (Simkl ID)
    - Fetches full movie details via getMovieDetails(id)
    - Displays: fanart hero, poster, title, year, rating, genres,
      overview, director, YouTube trailer embed, cast list
    - "Save to Collection" action via Zustand store

--------------------------------------------------------------------------------
8. KEY CONFIGURATION FILES
--------------------------------------------------------------------------------
  .env
    VITE_SIMKL_CLIENT_ID=<api_key>   ← Required: Simkl API authentication

  vite.config.ts
    - Plugin: @vitejs/plugin-react (Babel Fast Refresh)
    - Proxy: /api/simkl → https://api.simkl.com (CORS bypass for dev server)

  tsconfig.app.json
    - target: ES2020, strict mode enabled
    - Covers: src/**/*.ts, src/**/*.tsx

  tailwind.config.js
    - Minimal config (Tailwind v4 uses PostCSS-first approach)

  postcss.config.js
    - Plugins: @tailwindcss/postcss, autoprefixer

  eslint.config.js (ESLint v9 flat config)
    - Extends: @eslint/js recommended, typescript-eslint recommended
    - Plugins: react-hooks, react-refresh

--------------------------------------------------------------------------------
9. DATA FLOW OVERVIEW
--------------------------------------------------------------------------------

  User Action
      │
      ▼
  React Component (page/component)
      │  calls async function
      ▼
  src/services/api.ts
      │  checks cache first
      ├─► localStorage cache (cache.ts)  ← HIT → return cached data
      │
      │  MISS → makes HTTP call
      ▼
  Vite Dev Proxy (/api/simkl/...)
      │
      ▼
  Simkl API (https://api.simkl.com/...)
      │  returns raw SimklItem[]
      ▼
  Mapper (mapSimklToMovie / mapSimklToDetails)
      │  normalizes to Movie / MovieDetails type
      ▼
  Component State (useState) → UI Render

  Collections/Saved Flow:
  User saves item → useCollectionsStore.addItem() → Zustand state update
                 → zustand/persist → localStorage('movie-app-collections')

--------------------------------------------------------------------------------
10. KNOWN LIMITATIONS & NOTES
--------------------------------------------------------------------------------
  - Series support is stubbed (API stubs return empty/null). Only movies
    are fully implemented.
  - Actor/cast data is not returned by the Simkl /movies/{id} endpoint
    directly; cast is always an empty array in MovieDetails.
  - Genre enrichment on search results makes N+10 additional API calls
    for the top 10 results to retrieve genre data.
  - /saved/collection/:id route shows a "coming soon" placeholder.
  - The mobile hamburger menu in AppHeader is also a placeholder.
  - Image URLs point directly to simkl.in CDN — no fallback proxy if CDN
    is unreachable (replaced earlier failed proxy approach).
  - API rate limits (HTTP 429) are logged as warnings but not retried.

================================================================================
  END OF REPORT
================================================================================
