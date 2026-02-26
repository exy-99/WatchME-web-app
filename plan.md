# WatchMe — UI Improvements Implementation Plan
> Step-by-step implementation plan. Complete tasks in order within each section.
> Each task = one focused AI prompt. Attach only the files listed.

---

## SECTION 1 — Home Page Fixes & Improvements

---

### TASK 1.1 — Fix Hero Section Layout Bug (Large Titles)
**Problem:** When a movie has a long title, the genre tags (Action, Crime, etc.) get pushed out of view and the title overflows.

**What to change in `src/pages/Home.tsx`:**

1. **Genre chips row** — move it ABOVE the title (not below). This way the chips are always visible regardless of title length.

2. **Title element** — add these constraints:
   - `max-width: 80%` to prevent full-width overflow
   - Clamp font-size: `clamp(32px, 5vw, 80px)` so it scales down on long titles instead of overflowing
   - `line-height: 1.05`
   - `word-break: break-word`
   - Limit to 3 lines max with `-webkit-line-clamp: 3`

3. **Content area layout** — change from a fixed-bottom-positioned block to a flex column with `justify-content: flex-end` and `max-height: 60%` so all elements (chips + title + overview + buttons) stack naturally and never overlap each other.

4. **Overview text** — reduce from 3 lines to 2 lines clamp (`-webkit-line-clamp: 2`) when the title is longer than 20 characters. Use a JS check: `title.length > 20 ? 'line-clamp-2' : 'line-clamp-3'`.

5. **Bottom progress dots** — ensure they sit in their own fixed row with `flex-shrink: 0` so they are never pushed out.

**Files to attach:** `src/pages/Home.tsx`

---

### TASK 1.2 — Add "View All" Button to Section Headers
**What to change in `src/pages/Home.tsx`:**

1. **Section header row** — change the section title area from a single title element to a flex row with `justify-content: space-between` and `align-items: center`.

   Left side: existing title (Bebas Neue + accent bar).
   Right side: "View All →" button.

2. **"View All" button styling:**
   - Text: "View All" with a `→` arrow icon (or ChevronRight from lucide-react) on the right
   - Color: `#9CA3AF` by default
   - On hover: color shifts to `#7C3AED`, arrow translates right by 4px (Framer Motion `whileHover`)
   - No background, no border — text-only link style
   - Font: Inter Medium 14px

3. **Routing:** For now, both buttons can navigate to `/search` (since a dedicated genre/category page doesn't exist yet). Use `useNavigate` from react-router-dom.
   - "Top Rated" → `navigate('/search?category=top-rated')`
   - "New Releases" → `navigate('/search?category=new-releases')`
   *(The search page doesn't need to handle these params yet — this is just future-proofing the link.)*

4. Apply this same header pattern to BOTH the "Top Rated" and "New Releases" sections.

**Files to attach:** `src/pages/Home.tsx`

---

### TASK 1.3 — Increase Poster Size by 25% in Horizontal Rows
**What to change in `src/pages/Home.tsx` and `src/components/MediaCard.tsx`:**

1. **In `Home.tsx`** — wherever MediaCard is rendered inside the horizontal scroll rows, change the width/height props passed to the card:
   - Before: `width="w-[180px]"` `height="h-[270px]"`
   - After: `width="w-[225px]"` `height="h-[338px]"` *(180 × 1.25 = 225, 270 × 1.25 = 338)*

2. **Card gap** — increase gap between cards from `gap-3` to `gap-4` to give the larger cards breathing room.

3. **Row container** — add `pb-4` bottom padding to the scroll row so the bottom of taller cards (and their hover scale effect) isn't clipped.

4. **In `MediaCard.tsx`** — ensure the component accepts and applies width/height props correctly via Tailwind classes (it likely already does — just confirm no hardcoded size overrides the props).

**Files to attach:** `src/pages/Home.tsx`, `src/components/MediaCard.tsx`

---

### TASK 1.4 — Add Scroll Arrow Buttons to Horizontal Rows
**What to change in `src/pages/Home.tsx`:**

1. **Row wrapper** — wrap each horizontal scroll row in a `position: relative` container.

2. **Left arrow button:**
   - Position: `absolute left-0 top-50% transform -translate-y-1/2 z-10`
   - Style: 44px circle, `background: rgba(10,10,15,0.9)`, `border: 1px solid rgba(124,58,237,0.4)`, ChevronLeft icon (lucide-react), color white
   - On click: scroll the row container left by `500px` using `scrollBy({ left: -500, behavior: 'smooth' })`
   - Hidden when scroll position is at 0 (add state `canScrollLeft`)

3. **Right arrow button:**
   - Position: `absolute right-0 top-50% transform -translate-y-1/2 z-10`
   - Same style as left button but ChevronRight icon
   - On click: scroll right by `500px`
   - Hidden when scrolled to the end (add state `canScrollRight`)

4. **Visibility logic:**
   - Add a `ref` to each scroll row container
   - Add an `onScroll` handler that updates `canScrollLeft` and `canScrollRight` based on `scrollLeft`, `scrollWidth`, and `clientWidth`
   - Initial state: `canScrollLeft = false`, `canScrollRight = true`

5. **Fade-in on row hover:** Wrap each arrow in Framer Motion. Default: `opacity: 0`. On row hover (use `onMouseEnter`/`onMouseLeave` on the wrapper): `opacity: 1`. Transition: 0.2s ease.

6. **Edge gradient:** Add a `pointer-events: none` gradient overlay on the right edge of the row (width 80px, gradient from transparent to `#0A0A0F`) so cards softly fade out rather than hard-clipping.

Apply this to BOTH Top Rated and New Releases rows. Create a reusable wrapper if possible to avoid duplicating the logic.

**Files to attach:** `src/pages/Home.tsx`

---

## SECTION 2 — Search Page Improvements

---

### TASK 2.1 — Increase Poster Size by 25% on Search Results
**What to change in `src/pages/Search.tsx`:**

1. **Results grid** — update the CSS grid column definition:
   - Before: `grid-cols minmax(160px, 1fr)`
   - After: `grid-cols minmax(200px, 1fr)` *(160 × 1.25 = 200)*

2. **Card height** — if MediaCard height is passed as a prop:
   - Before: `h-[240px]`
   - After: `h-[300px]` *(240 × 1.25 = 300)*

3. **Grid gap** — increase from `gap-4` to `gap-5` to give larger cards proper spacing.

4. **On mobile** (< 640px): set a minimum of 2 columns so cards don't become too wide on small screens. Use `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`.

**Files to attach:** `src/pages/Search.tsx`, `src/components/MediaCard.tsx`

---

### TASK 2.2 — Add "Load More" Button with Paginated Fetching
**What to change in `src/pages/Search.tsx` and `src/services/api.ts`:**

**How the Simkl search API pagination works:**
The Simkl `/search/movie` endpoint natively supports pagination via query params:
```
GET /api/simkl/search/movie?q={query}&page={page}&limit=20&client_id=...
```
- `page` starts at 1, defaults to 1
- `limit` is items per page, max 50, default 10 — use 20
- Response headers include:
  - `X-Pagination-Page` — current page
  - `X-Pagination-Page-Count` — total number of pages
  - `X-Pagination-Item-Count` — total items

**Step 1 — Update `src/services/api.ts`:**
Update the `searchMovies` function to accept an optional `page` parameter and return both results AND pagination info:
```typescript
export async function searchMovies(query: string, page: number = 1): Promise<{ results: Movie[], totalPages: number }> {
  // pass &page=${page}&limit=20 to the axios call
  // read response.headers['x-pagination-page-count'] for totalPages
  // return { results: mappedResults, totalPages }
}
```
Keep all existing mapping logic (`mapSimklToMovie`, genre enrichment for top 10, etc.) unchanged.

**Step 2 — Update `src/pages/Search.tsx` state:**
```typescript
const [results, setResults] = useState<Movie[]>([])
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)
const [loadingMore, setLoadingMore] = useState(false)
const [currentQuery, setCurrentQuery] = useState('')
```

**Step 3 — Search behavior:**
1. On new search (query changes): reset `page` to 1, reset `results` to `[]`, set `currentQuery`.
2. On page 1: `setResults(newResults)`, `setTotalPages(totalPages)`.
3. On page > 1 (Load More): `setResults(prev => [...prev, ...newResults])`.
4. `hasMore` derived value: `page < totalPages`.

**Step 4 — "Load More" button:**
1. Show only when `page < totalPages` and `results.length > 0` and not initial loading.
2. Position: centered below the results grid, `margin-top: 40px`.
3. Style: ghost button — `border: 1px solid rgba(124,58,237,0.4)`, color `#C4B5FD`, border-radius 999px, padding `12px 40px`, Inter Medium 15px.
4. Loading state: when `loadingMore` is true, show spinning Loader2 icon (lucide-react) + "Loading...". Disable button.
5. On click: `setLoadingMore(true)` → fetch `page + 1` → append results → `setPage(p => p+1)` → `setLoadingMore(false)`.
6. New results animate in with stagger (same card entrance animation). Do NOT auto-scroll after load.

**Files to attach:** `src/pages/Search.tsx`, `src/services/api.ts`

---

## SECTION 3 — Saved Page Changes

---

### TASK 3.1 — Remove Watchlist Special Logic, Keep Card Visible
**What to change in `src/pages/Saved.tsx` and `src/store/collections.ts`:**

**In `src/pages/Saved.tsx`:**
1. Remove any conditional rendering that treats `isDefault` collections differently in the UI. The Watchlist card should render using the exact same component/template as all other collection cards.
2. Remove the `"Default"` badge pill from the Watchlist card.
3. Remove any progress ring or watchlist-completion percentage display.
4. Remove any special `isDefault` check that hides delete/rename options for Watchlist — show the same options as other collections.
5. The Watchlist card should appear first in the grid (index 0) naturally — no sorting needed.

**In `src/store/collections.ts`:**
1. Do NOT change the `isDefault` flag on the Watchlist in the store — leave the data structure as-is.
2. In `deleteCollection`, remove the guard `if (collection.isDefault) return` so Watchlist can be deleted like any other collection.

> **Note:** This does not touch any `addItem` / `removeItem` logic. The Watchlist will still work for saving movies — it just won't look or behave differently from other collections visually.

**Files to attach:** `src/pages/Saved.tsx`, `src/store/collections.ts`

---

## Summary of All Changes

| # | Page | Task | Files to Attach |
|---|------|------|-----------------|
| 1.1 | Home | Fix hero bug — long title hides genre chips | `Home.tsx` |
| 1.2 | Home | Add "View All →" button to section headers | `Home.tsx` |
| 1.3 | Home | Increase poster size by 25% in rows | `Home.tsx`, `MediaCard.tsx` |
| 1.4 | Home | Add left/right scroll arrow buttons to rows | `Home.tsx` |
| 2.1 | Search | Increase poster size by 25% in results grid | `Search.tsx`, `MediaCard.tsx` |
| 2.2 | Search | Add "Load More" with paginated API fetch | `Search.tsx`, `api.ts` |
| 3.1 | Saved | Remove Watchlist special logic, keep card visible | `Saved.tsx`, `collections.ts` |

> **Important:** Do tasks 1.3 and 2.1 back-to-back since both touch `MediaCard.tsx`. Make all size changes in one session to avoid conflicts.