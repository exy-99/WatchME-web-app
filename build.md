# WatchMe UI Redesign — AI Build Tasks
> Feed each task individually to your AI code editor. Complete them in order.
> Attach the relevant file(s) mentioned in each task when prompting.

---

## CONTEXT BLOCK
> Paste this at the start of EVERY prompt session (add to `.cursorrules` or `AGENTS.md`)

```
Project: WatchMe — React 19 + Vite 7 + Tailwind 4 + Zustand 5 + React Router 7
Design System:
  - Background: #0A0A0F  |  Surface: #141420  |  Surface2: #1E1A3A
  - Brand Purple: #7C3AED  |  Accent Pink: #EC4899  |  Gold: #F59E0B
  - Text Primary: #F9FAFB  |  Text Muted: #9CA3AF
  - Fonts: Bebas Neue (display/titles), Inter (body/ui)
  - All animations: Framer Motion, spring { stiffness: 300, damping: 30, mass: 1 }
  - Respect prefers-reduced-motion on ALL animations
  - Use Tailwind utility classes. No inline styles unless absolutely necessary.
  - Do NOT change any API calls, Zustand store logic, or TypeScript types.
```

---

## PHASE 1 — Design System Foundation
> Goal: Get the base layer right before touching any components.

---

### TASK 1.1 — Install Dependencies
**Prompt:**
```
Install the following packages into my Vite React project and confirm they are added to package.json:

npm install framer-motion
npm install @fontsource/bebas-neue @fontsource/inter
npm install fast-average-color
npm install clsx tailwind-merge   (already installed, skip if present)

Do not change any existing code. Just install and show me the updated dependencies section of package.json.
```
**Files to attach:** `package.json`

---

### TASK 1.2 — Extend Tailwind Config with Design Tokens
**Prompt:**
```
Extend my tailwind.config.js to add the following custom design tokens.
Do not remove anything that already exists.

Colors to add:
  brand: { purple: '#7C3AED', pink: '#EC4899', gold: '#F59E0B' }
  bg: { base: '#0A0A0F', surface: '#141420', surface2: '#1E1A3A' }
  text: { primary: '#F9FAFB', muted: '#9CA3AF' }

Font families to add:
  display: ['Bebas Neue', 'sans-serif']
  body: ['Inter', 'sans-serif']

Keyframe animations to add:
  shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }
  glow-pulse: { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } }
  float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } }
```
**Files to attach:** `tailwind.config.js`

---

### TASK 1.3 — Update Global CSS Variables & Base Styles
**Prompt:**
```
Update src/index.css to:

1. Import the fonts at the very top:
   @import '@fontsource/bebas-neue';
   @import '@fontsource/inter/400.css';
   @import '@fontsource/inter/500.css';
   @import '@fontsource/inter/700.css';

2. Add CSS custom properties to :root:
   --color-brand-purple: #7C3AED;
   --color-accent-pink: #EC4899;
   --color-gold: #F59E0B;
   --color-bg-base: #0A0A0F;
   --color-bg-surface: #141420;
   --gradient-brand: linear-gradient(135deg, #7C3AED, #EC4899);
   --shadow-glow-purple: 0 0 30px rgba(124, 58, 237, 0.4);
   --shadow-glow-pink: 0 0 30px rgba(236, 72, 153, 0.3);

3. Set body defaults:
   background-color: #0A0A0F;
   font-family: 'Inter', sans-serif;
   color: #F9FAFB;

4. Add a utility class .text-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }

5. Add scrollbar styles:
   ::-webkit-scrollbar { width: 6px; height: 6px; }
   ::-webkit-scrollbar-track { background: #141420; }
   ::-webkit-scrollbar-thumb { background: #7C3AED; border-radius: 999px; }

Do not remove existing Tailwind directives (@tailwind base/components/utilities).
```
**Files to attach:** `src/index.css`

---

### TASK 1.4 — Create Skeleton Loader Component
**Prompt:**
```
Create a new file src/components/ui/Skeleton.tsx

Build a Skeleton component with these variants:
- <Skeleton variant="card" /> — renders a 180×270px rounded rectangle with shimmer animation
- <Skeleton variant="hero" /> — renders a full-width 500px tall block with shimmer
- <Skeleton variant="text" width="...%" /> — renders a single line text placeholder

Shimmer effect: animated gradient sweep from left to right using the CSS keyframe 'shimmer' defined in tailwind config.
Background: #1E1A3A with shimmer overlay using backgroundImage gradient.
Use Tailwind classes wherever possible.
Export as default.
```
**Files to attach:** none

---

### TASK 1.5 — Create GlassCard Utility Component
**Prompt:**
```
Create src/components/ui/GlassCard.tsx

A reusable wrapper component that applies glassmorphism styling to its children.

Styles to apply:
  background: rgba(255, 255, 255, 0.04)
  backdrop-filter: blur(16px)
  -webkit-backdrop-filter: blur(16px)
  border: 1px solid rgba(255, 255, 255, 0.08)
  border-radius: 16px

Props:
  children: ReactNode
  className?: string  (merged with twMerge/clsx)
  padding?: 'sm' | 'md' | 'lg'  (default: 'md')

Export as default.
```
**Files to attach:** none

---

### TASK 1.6 — Create GenreChip Component
**Prompt:**
```
Create src/components/ui/GenreChip.tsx

A pill-shaped genre tag component.

Props:
  label: string
  onClick?: () => void
  active?: boolean

Default style: 
  background: rgba(124, 58, 237, 0.15)
  border: 1px solid rgba(124, 58, 237, 0.3)
  color: #C4B5FD
  border-radius: 999px
  padding: 4px 12px
  font: Inter Medium 12px

Active style:
  background: #7C3AED
  color: white
  border-color: #7C3AED

Hover animation using Framer Motion: scale 1.05, slight glow box-shadow on hover.
Add transition for active state with layout animation.
```
**Files to attach:** none

---

## PHASE 2 — App Header & Navigation

---

### TASK 2.1 — Redesign AppHeader Desktop Nav
**Prompt:**
```
Redesign src/components/AppHeader.tsx — desktop navigation only (keep mobile nav unchanged for now).

Changes:
1. Header background: rgba(10, 10, 15, 0.8) with backdrop-filter: blur(20px). Add a 1px bottom border: rgba(255,255,255,0.06).
2. Logo: keep the Clapperboard icon but wrap it in a div with background: linear-gradient(135deg, #7C3AED, #EC4899), border-radius 10px, padding 8px. Add a subtle drop-shadow glow. Change "MovieApp" text to font-family Bebas Neue, font-size 24px, letter-spacing 2px, color white.
3. Nav links: replace plain text links with styled pills. 
   - Default: color #9CA3AF, no background
   - Hover: color white, background rgba(124,58,237,0.15)
   - Active (current route): background linear-gradient(135deg,#7C3AED,#EC4899), color white, border-radius 999px, padding 8px 20px
   - Animate the active pill sliding between links using Framer Motion layoutId="active-pill"
4. Use useLocation() from react-router-dom to determine active route.

Do not change the mobile nav or any routing logic.
```
**Files to attach:** `src/components/AppHeader.tsx`

---

### TASK 2.2 — Redesign Mobile Bottom Navigation
**Prompt:**
```
Redesign the mobile bottom navigation in src/components/AppHeader.tsx.

Replace the current fixed bottom bar with a floating pill navbar:

1. Container: position fixed, bottom 24px, left 50%, transform translateX(-50%). 
   Background: rgba(20, 20, 32, 0.9), backdrop-filter blur(20px), border 1px solid rgba(255,255,255,0.1), border-radius 999px, padding 8px 16px.
   Add box-shadow: 0 8px 32px rgba(0,0,0,0.4).

2. Show only icons (no labels) by default. On active route, show icon + label with a smooth width expand animation.

3. Active icon background: linear-gradient(135deg, #7C3AED, #EC4899), border-radius 999px, padding 8px 16px.
   Use Framer Motion layoutId="mobile-active-pill" for the sliding blob.

4. Tap/click animation: scale 0.9 on press, spring back to 1 on release (whileTap={{ scale: 0.9 }}).

Keep all existing route links. Only change the visual presentation.
```
**Files to attach:** `src/components/AppHeader.tsx`

---

## PHASE 3 — Movie Cards

---

### TASK 3.1 — Redesign MediaCard Base Styles
**Prompt:**
```
Redesign src/components/MediaCard.tsx — base visual styles only (no animations yet).

Changes:
1. Card container: border-radius 12px, overflow hidden, position relative, cursor pointer.
   background: #141420. Add box-shadow: 0 4px 24px rgba(0,0,0,0.6).

2. Poster image: width 100%, height 100%, object-fit cover.
   Add a gradient overlay on top of the image:
   background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)

3. Rating badge (top-right): 
   background: rgba(0,0,0,0.7), backdrop-filter blur(8px)
   border: 1px solid rgba(245,158,11,0.4)
   border-radius 999px, padding 4px 10px
   Star icon color: #F59E0B, text color: #F9FAFB, font Inter Medium 13px.

4. Card bottom info area (always visible, not on hover):
   Movie title: font-family Bebas Neue, font-size 18px, color white, max 2 lines, line-clamp-2
   Year: Inter 12px, color #9CA3AF, margin-top 2px

Do not add hover effects yet. Do not change props, routing, or image loading logic.
```
**Files to attach:** `src/components/MediaCard.tsx`

---

### TASK 3.2 — Add Hover Interactions to MediaCard
**Prompt:**
```
Add hover interactions to src/components/MediaCard.tsx using Framer Motion.

1. Wrap the card in a Framer Motion <motion.div>.
   On hover: scale 1.05, y: -4px, z-index 10.
   Transition: spring, stiffness 300, damping 25.

2. Add a 3D tilt effect using useMotionValue for mouseX and mouseY.
   On mouse move over card: rotateX up to ±6deg, rotateY up to ±6deg.
   Reset to 0 on mouse leave. Use useTransform to map mouse position to rotation.
   Wrap in style={{ rotateX, rotateY, transformPerspective: 800 }}.

3. Add a slide-up info panel that appears on hover:
   Position: absolute, bottom 0, left 0, right 0
   Background: linear-gradient(to top, rgba(10,10,15,0.98), rgba(10,10,15,0.7))
   On hover: animate from y: 20, opacity: 0 → y: 0, opacity: 1
   Show: movie title (Bebas Neue 20px), year (Inter 12px muted)

4. Add a glow effect on hover:
   box-shadow animates to: 0 0 30px rgba(124,58,237,0.5), 0 8px 32px rgba(0,0,0,0.8)
   Use Framer Motion animate prop on the card.
```
**Files to attach:** `src/components/MediaCard.tsx`

---

### TASK 3.3 — Add Skeleton Loading to MediaCard
**Prompt:**
```
Update src/components/MediaCard.tsx to show a skeleton loader while the poster image loads.

1. Add a useState: const [imageLoaded, setImageLoaded] = useState(false)

2. While imageLoaded is false, render the <Skeleton variant="card" /> component from src/components/ui/Skeleton.tsx in place of the image.

3. On the <img> element, add:
   onLoad={() => setImageLoaded(true)}
   className that hides the img when not loaded: opacity-0 when !imageLoaded, opacity-100 when loaded
   Transition: transition-opacity duration-500

4. Wrap the image reveal in a Framer Motion animate: opacity from 0 to 1, scale from 0.97 to 1, duration 0.4s.

Import Skeleton from '../ui/Skeleton'.
```
**Files to attach:** `src/components/MediaCard.tsx`, `src/components/ui/Skeleton.tsx`

---

## PHASE 4 — Home Page Hero Section

---

### TASK 4.1 — Build Hero Carousel Structure
**Prompt:**
```
Redesign the hero section in src/pages/Home.tsx — structure and layout only (no auto-cycling yet).

1. Hero container: height 70vh (min-height 500px), position relative, overflow hidden, border-radius 0 0 24px 24px.

2. Background layer: full-bleed fanart image (use the first hero movie's fanart).
   Apply: object-fit cover, width 100%, height 100%.
   Overlay gradient: 
     linear-gradient(to right, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 50%, transparent 100%)
   Plus a bottom fade: linear-gradient(to top, #0A0A0F 0%, transparent 40%) 

3. Content area (left side, absolute positioned, bottom 15%, left 5%):
   - Genre chips row (use GenreChip component, show first 3 genres)
   - Movie title: font-family Bebas Neue, font-size clamp(48px, 8vw, 96px), color white, line-height 1, max-width 600px
   - Overview text: Inter 15px, color #D1D5DB, max-width 480px, max 3 lines (line-clamp-3), margin-top 12px
   - Button row: "▶ Watch Trailer" button (gradient bg #7C3AED→#EC4899, white text, border-radius 999px, padding 12px 28px) + "＋ Add to Watchlist" ghost button (border 1px rgba(255,255,255,0.2), same sizing)

4. Progress dots (bottom-center, absolute):
   5 small dots, active dot is a wider pill shape, color #7C3AED.

Keep the existing data fetching logic (getHeroMovies). Display only the first movie for now.
```
**Files to attach:** `src/pages/Home.tsx`

---

### TASK 4.2 — Add Auto-Cycling to Hero Carousel
**Prompt:**
```
Add auto-cycling behavior to the hero section in src/pages/Home.tsx.

1. Add state: const [activeIndex, setActiveIndex] = useState(0)

2. Add useEffect that cycles activeIndex through 0–4 every 6000ms. Clear interval on unmount.

3. Wrap the hero background image and content in Framer Motion <AnimatePresence mode="wait">.
   On each activeIndex change:
   - Image: crossfades (opacity 0→1, duration 1s, ease "easeInOut")
   - Title: slides up (y: 20→0, opacity 0→1, delay 0.2s)
   - Overview: slides up (y: 20→0, opacity 0→1, delay 0.35s)
   - Buttons: slides up (y: 20→0, opacity 0→1, delay 0.5s)
   Use key={activeIndex} on the animated container to trigger re-animation.

4. Progress dots: clicking a dot sets activeIndex. Active dot animates width from 8px to 28px using Framer Motion layoutId.

5. Pause auto-cycling on hover (add onMouseEnter/onMouseLeave to pause/resume the interval).
```
**Files to attach:** `src/pages/Home.tsx`

---

### TASK 4.3 — Redesign Section Titles & Horizontal Rows
**Prompt:**
```
Redesign the "Top Rated" and "New Releases" sections in src/pages/Home.tsx.

1. Section title styling:
   - Font: Bebas Neue, 48px, color white
   - Add a left accent bar: 4px wide, 48px tall, background linear-gradient(#7C3AED, #EC4899), border-radius 2px, margin-right 16px
   - Animate title on scroll into view using Framer Motion whileInView: x from -20 to 0, opacity 0 to 1. viewport: { once: true }

2. Horizontal scroll row container:
   - Add padding: 16px 0
   - Show a gradient fade on the right edge: pseudo-element or overlay div, background linear-gradient(to left, #0A0A0F, transparent), width 80px, pointer-events none
   - Add scroll-snap-type: x mandatory on the container
   - Add scroll-behavior: smooth

3. Each card in the row:
   - Add scroll-snap-align: start
   - Add flex-shrink: 0
   - Width: 180px on default, 200px for the card currently in the center viewport (use IntersectionObserver — skip if complex, just use uniform size)

4. Add left/right arrow buttons that appear on row hover:
   Circular buttons (40px), background rgba(124,58,237,0.8), position absolute left and right of row.
   On click: scroll the row by 600px in the respective direction.
   Animate in/out with Framer Motion opacity 0→1 on parent hover.
```
**Files to attach:** `src/pages/Home.tsx`

---

## PHASE 5 — Movie Detail Page

---

### TASK 5.1 — Redesign Detail Page Hero Section
**Prompt:**
```
Redesign the top hero area of src/pages/MovieDetails.tsx.

1. Full-viewport-width backdrop: use the movie's fanart image.
   Height: 55vh. Position relative, overflow hidden.
   Apply: filter blur(2px) scale(1.05) on the image (the blur+scale trick avoids blurry edges).
   Overlay: background linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, #0A0A0F 100%)

2. Below the backdrop (NOT overlaid), show the main content area with 2 columns:
   Left column (width 220px, flex-shrink 0):
     - Movie poster image, border-radius 12px, box-shadow 0 8px 40px rgba(0,0,0,0.8)
     - Animate poster on load: y from 20→0, opacity 0→1
     - Poster should overlap the backdrop by ~80px using negative margin-top: -80px

   Right column (flex 1, padding-left 32px):
     - Title: Bebas Neue, clamp(36px, 5vw, 64px), color white
     - Meta row: year • runtime • rating badge (gold) — Inter 14px, color #9CA3AF, gap 8px
     - Genre chips row using GenreChip component
     - Overview: Inter 15px, color #D1D5DB, max-width 600px, line-height 1.7

3. Wrap the entire content area in the GlassCard component from src/components/ui/GlassCard.tsx.

Keep all existing data fetching (getMovieDetails) and routing logic unchanged.
```
**Files to attach:** `src/pages/MovieDetails.tsx`, `src/components/ui/GlassCard.tsx`, `src/components/ui/GenreChip.tsx`

---

### TASK 5.2 — Redesign Detail Page Action Buttons
**Prompt:**
```
Redesign the "Save to Collection" button and add action buttons in src/pages/MovieDetails.tsx.

1. Primary CTA — "Save to Watchlist":
   Background: linear-gradient(135deg, #7C3AED, #EC4899)
   Color white, border-radius 999px, padding 14px 32px, font Inter 600 15px
   Icon: Bookmark (lucide-react) on the left
   On click (when saving): animate icon morph from Bookmark to BookmarkCheck using Framer Motion AnimatePresence
   Add a micro confetti burst: on save, emit 12 tiny colored dots that fly outward and fade. Implement with Framer Motion using absolute positioned spans with random trajectories.

2. Secondary button — "Watch Trailer":
   Border: 1px solid rgba(255,255,255,0.2), background transparent
   Same sizing as primary. On hover: background rgba(255,255,255,0.06)
   Icon: Play (lucide-react)

3. Already-saved state:
   If movie is already in any collection (use isItemInAnyCollection from Zustand store):
   Show a filled BookmarkCheck icon, gradient border instead of fill background.

Keep the existing Zustand store calls and collection logic unchanged.
```
**Files to attach:** `src/pages/MovieDetails.tsx`, `src/store/collections.ts`

---

### TASK 5.3 — Redesign Trailer & Cast Sections
**Prompt:**
```
Redesign the trailer embed and cast section in src/pages/MovieDetails.tsx.

TRAILER SECTION:
1. Wrap the YouTube iframe in a container: border-radius 16px, overflow hidden, position relative.
   Add a custom play overlay that fades out when the user clicks play.
   Overlay: background rgba(10,10,15,0.6), backdrop-filter blur(4px), display flex, align/justify center.
   Center a Play button: 72px circle, background linear-gradient(135deg,#7C3AED,#EC4899), Play icon white 32px.
   On click: hide overlay, start video (add ?autoplay=1 to iframe src on click).

2. Section title "Trailer": Bebas Neue 36px with the same accent bar style from Home.tsx sections.

CAST SECTION:
1. If cast array is empty, hide the section entirely (cast is currently always empty per known limitation).

2. If cast exists in future: render a horizontal scroll row of cast cards.
   Each cast card: 100px wide, circular avatar image (100px circle), name Inter 13px bold below, role Inter 11px muted.
   Hover: scale 1.05, name color shifts to #C4B5FD.

3. Section title "Cast": same Bebas Neue + accent bar style.
```
**Files to attach:** `src/pages/MovieDetails.tsx`

---

## PHASE 6 — Search Page

---

### TASK 6.1 — Redesign Search Input & Empty State
**Prompt:**
```
Redesign the search input and empty state in src/pages/Search.tsx.

SEARCH INPUT:
1. Make the input full-width, height 56px, border-radius 16px.
   background: rgba(30, 26, 58, 0.8), backdrop-filter blur(8px)
   border: 1px solid rgba(124,58,237,0.3)
   color: white, font Inter 16px, padding 0 20px 0 52px (for search icon)

2. Add a Search icon (lucide-react) on the left inside the input, color #9CA3AF.

3. On focus:
   border-color: #7C3AED
   box-shadow: 0 0 0 3px rgba(124,58,237,0.2)
   Animate with Framer Motion: transition duration 0.2s

4. Animated placeholder using a typewriter effect: cycle through placeholder strings
   ["Search for a movie...", "Try 'Inception'...", "Find your next obsession..."]
   Change every 3s using setInterval + useState. Only show when input is empty and unfocused.

EMPTY STATE (no query entered):
1. Show a centered layout with:
   - A large Film icon (lucide-react, 80px, color rgba(124,58,237,0.4))
   - Headline: "Find Your Next Obsession" — Bebas Neue 48px, gradient text (#7C3AED→#EC4899)
   - Subtext: "Search across thousands of movies" — Inter 16px, #9CA3AF

Keep all existing search logic (searchMovies, useState for results) unchanged.
```
**Files to attach:** `src/pages/Search.tsx`

---

### TASK 6.2 — Redesign Search Results Grid
**Prompt:**
```
Redesign the search results display in src/pages/Search.tsx.

1. Results count header: when results exist, show "X results for 'query'" — Inter 14px, color #9CA3AF, margin-bottom 24px.

2. Results grid: 
   CSS grid with auto-fill columns, minmax(160px, 1fr), gap 20px.
   Cards stagger in using Framer Motion:
   Each card: initial={{ opacity: 0, y: 20 }}, animate={{ opacity: 1, y: 0 }}
   Delay each card by index * 0.05s (max 8 staggered, rest appear instantly).
   Use AnimatePresence with mode="popLayout" so old results animate out.

3. No results state (query entered, 0 results):
   Center layout with Film icon (muted), 
   Text: "No results for '{query}'" — Bebas Neue 32px
   Subtext: "Try a different title" — Inter 14px muted.
   Animate in with opacity 0→1, y 10→0.

4. Loading state (while fetching):
   Show a 4-column grid of <Skeleton variant="card" /> (8 skeletons total) using the Skeleton component.

Keep all existing search state and API calls unchanged.
```
**Files to attach:** `src/pages/Search.tsx`, `src/components/ui/Skeleton.tsx`

---

## PHASE 7 — Saved / Collections Page

---

### TASK 7.1 — Redesign Collections Grid
**Prompt:**
```
Redesign src/pages/Saved.tsx — collections overview layout.

1. Page title: "My Collections" — Bebas Neue 56px, gradient text (background-clip text, color transparent, background linear-gradient(135deg,#7C3AED,#EC4899)).

2. Collections grid: CSS grid, auto-fill, minmax(260px, 1fr), gap 24px.

3. Each collection card (replace the current list item):
   Height: 200px, border-radius 16px, overflow hidden, position relative, cursor pointer.
   
   Background mosaic: if collection has 4+ items, show a 2x2 grid of poster thumbnails as the card background (each poster 50% width/height, object-fit cover). If fewer than 4 items, use a gradient background (#1E1A3A→#141420).
   
   Overlay: linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.3) 100%)
   
   Content (bottom of card):
   - Collection name: Bebas Neue 24px, color white
   - Item count: Inter 13px, color #9CA3AF, "{n} movies"
   - If isDefault (Watchlist): show a small pill badge "Default" in brand purple

4. Hover animation: scale 1.03, box-shadow glow 0 0 30px rgba(124,58,237,0.3). Framer Motion whileHover.

Keep all existing Zustand store reads unchanged.
```
**Files to attach:** `src/pages/Saved.tsx`, `src/store/collections.ts`

---

### TASK 7.2 — Add Create Collection Button
**Prompt:**
```
Add a "Create Collection" floating action button to src/pages/Saved.tsx.

1. Button: fixed position, bottom 100px (above mobile nav), right 24px.
   Background: linear-gradient(135deg, #7C3AED, #EC4899)
   Width/height: 56px, border-radius 999px, display flex, align/justify center.
   Icon: Plus (lucide-react), color white, size 24px.
   box-shadow: 0 4px 20px rgba(124,58,237,0.5)

2. Hover: scale 1.1 with Framer Motion whileHover. Tap: scale 0.9 with whileTap.

3. On click: show an inline modal (or expand to an input field) to enter collection name.
   Modal: GlassCard centered, backdrop overlay rgba(0,0,0,0.7).
   Input: same style as Search page input. 
   Buttons: "Create" (gradient) and "Cancel" (ghost).
   On confirm: call createCollection(title) from Zustand store and close modal.

4. Animate the modal in with Framer Motion: scale 0.9→1, opacity 0→1. AnimatePresence for mount/unmount.

Keep all existing createCollection store logic unchanged.
```
**Files to attach:** `src/pages/Saved.tsx`, `src/store/collections.ts`, `src/components/ui/GlassCard.tsx`

---

## PHASE 8 — Page Transitions & Polish

---

### TASK 8.1 — Add Page Transition Wrapper
**Prompt:**
```
Add animated page transitions to src/App.tsx (or the Layout component).

1. Wrap the <Outlet /> (or route children) in a Framer Motion <AnimatePresence mode="wait">.

2. Create a PageTransition wrapper component in src/components/ui/PageTransition.tsx:
   On mount (initial→animate): opacity 0→1, x: 20→0, duration 0.3s, ease "easeOut"
   On unmount (exit): opacity 1→0, x: 0→-20, duration 0.2s
   
3. Wrap each page component's root element with <PageTransition> using the current pathname as the key.

4. Use useLocation() from react-router-dom to get the current pathname.
   Pass pathname as key to AnimatePresence to trigger on route change.

Respect prefers-reduced-motion: if user prefers reduced motion, skip the x translation and only fade opacity.
```
**Files to attach:** `src/App.tsx`, `src/components/Layout.tsx`

---

### TASK 8.2 — Add Ambient Poster Glow on Detail Page
**Prompt:**
```
Add ambient poster glow to src/pages/MovieDetails.tsx using the fast-average-color library.

1. Import FastAverageColor from 'fast-average-color'.

2. After the poster image loads (onLoad event), use FastAverageColor to extract the dominant color from the poster img element.

3. Store the extracted color in state: const [ambientColor, setAmbientColor] = useState('rgba(124,58,237,0.3)')

4. Apply the ambient color as a radial gradient behind the poster:
   position: absolute, top 0, left 0, right 0, height 100%
   background: radial-gradient(ellipse at 30% 50%, {ambientColor} 0%, transparent 70%)
   opacity: 0.6, z-index 0 (behind content, above backdrop)

5. Animate the color change with a CSS transition on the background property: transition 1s ease.

Handle errors from FastAverageColor gracefully — fall back to the default purple if extraction fails.
Keep all existing data fetching unchanged.
```
**Files to attach:** `src/pages/MovieDetails.tsx`

---

### TASK 8.3 — Animate Ratings Counter
**Prompt:**
```
Add an animated counter to rating displays across the app.

1. Create src/components/ui/AnimatedRating.tsx

Props:
  value: number  (e.g. 7.8)
  size?: 'sm' | 'md' | 'lg'

Behavior:
  On mount (or when value enters the viewport using IntersectionObserver):
  - Animate a counter from 0.0 to the final value over 600ms using Framer Motion useMotionValue + useTransform
  - Use motionValue.set(0) then animate to value with spring
  - Display the animated value rounded to 1 decimal place

  - After the counter finishes, the Star icon does a single pulse: scale 1→1.3→1 over 300ms

Rating color logic:
  value >= 7.5: color #22C55E (green)
  value >= 6.0: color #F59E0B (gold)
  value < 6.0:  color #EF4444 (red)

2. Replace the static rating display in src/components/MediaCard.tsx with <AnimatedRating value={item.rating} size="sm" />.

Respect prefers-reduced-motion: skip animation, show final value immediately.
```
**Files to attach:** `src/components/MediaCard.tsx`

---

### TASK 8.4 — Accessibility & Reduced Motion Pass
**Prompt:**
```
Do a final accessibility pass on all components modified in this project.

For each of these files, make the following changes:
- src/components/MediaCard.tsx
- src/components/AppHeader.tsx
- src/pages/Home.tsx
- src/pages/MovieDetails.tsx
- src/pages/Search.tsx

Changes to apply:

1. Add a custom hook src/hooks/useReducedMotion.ts:
   import { useReducedMotion } from 'framer-motion'
   Export as a re-export. Use this in all animated components to conditionally disable motion.

2. In all Framer Motion components: if useReducedMotion() returns true, set all transition durations to 0.01s and remove translate/scale effects. Keep opacity transitions (they are still allowed).

3. Focus indicators: ensure all interactive elements (buttons, links, cards) have:
   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]
   Remove default browser outline and replace with brand outline.

4. Alt text: all movie poster <img> tags should have alt="{movie.title} poster". Fanart images: alt="{movie.title} backdrop".

5. Buttons without visible text (icon-only buttons): add aria-label attributes.

6. Horizontal scroll rows: add role="list" to container, role="listitem" to each card wrapper.
```
**Files to attach:** All files listed above.

---

## PHASE 9 — Final QA Checklist

> Run through each item manually after all tasks are complete.

```
VISUAL
[ ] Hero auto-cycles every 6s with smooth crossfade
[ ] Active nav item shows gradient pill, animates between routes
[ ] Movie cards have 3D tilt + slide-up info panel on hover
[ ] Skeleton loaders appear before images load
[ ] Ratings animate up from 0 on enter
[ ] Genre chips glow on hover, filled when active
[ ] Save button morphs icon + confetti on click
[ ] Ambient glow on detail page matches poster color
[ ] Page transitions slide in/out on route changes
[ ] Floating mobile nav pill slides to active icon

PERFORMANCE
[ ] No layout shift on load (open DevTools > Performance > CLS)
[ ] Images lazy-load (only load when in viewport)
[ ] No animation jank (60fps in DevTools > Rendering > FPS meter)
[ ] Framer Motion bundle not duplicated (check Network tab)

ACCESSIBILITY
[ ] Tab through entire app — every interactive element is reachable
[ ] Focus rings visible on all buttons, links, cards
[ ] All images have meaningful alt text
[ ] Enable "Emulate prefers-reduced-motion" in DevTools — all animations disabled
[ ] Screen reader announces route changes (add aria-live region if needed)

RESPONSIVE
[ ] Hero section stacks correctly on mobile (< 768px)
[ ] Card grids reflow to 2 columns on tablet, 1 on small mobile
[ ] Floating mobile nav appears below 768px, desktop nav above
[ ] Detail page 2-column layout stacks to 1 column on mobile
[ ] Text sizes scale correctly (Bebas Neue titles don't overflow on small screens)
```

---

*Total tasks: 20 build tasks + 1 QA pass. Complete in order. Each task = one AI prompt session.*