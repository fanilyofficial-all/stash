# Stash — Claude Code Build Brief

> Read this fully before writing a single line of code. Every decision here is intentional.

---

## What we're building

**Stash** is a shared photo drop app. A host creates an event and gets a unique URL. They share it with guests. Guests open the link, see a gallery of photos already uploaded, and drop their own in. No accounts, no feed, no social layer. Just the photos from that moment, in one place, for the people who were there.

Two screens. Real persistence. Built to be shipped.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database + Storage | Supabase (Postgres + Storage Buckets) |
| Styling | Tailwind CSS v3 |
| Components | shadcn/ui |
| Icons | Lucide React |
| Fonts | Google Fonts — Fraunces (display) + DM Sans (UI) |
| Deployment | Vercel |

---

## Project Setup Instructions

### 1. Create Next.js app
```bash
npx create-next-app@latest stash --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd stash
```

### 2. Install dependencies
```bash
npx shadcn@latest init
npx shadcn@latest add button input label textarea dialog sheet progress toast
npm install @supabase/supabase-js @supabase/ssr lucide-react
```

### 3. Environment variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase client setup
Create `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` using the `@supabase/ssr` package (standard Next.js App Router setup).

---

## Tailwind Config

Replace the default `tailwind.config.ts` content with this — brand tokens are non-negotiable:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F5F2",
        surface: "#FFFFFF",
        "text-primary": "#141414",
        "text-secondary": "#7A7570",
        "text-tertiary": "#B0ABA6",
        accent: "#4A2D6F",
        "accent-light": "#EDE8F5",
        border: "#E8E4DF",
        destructive: "#C0392B",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        pill: "100px",
        card: "16px",
        input: "12px",
      },
      spacing: {
        "screen-x": "24px",
        "screen-x-desktop": "40px",
      },
    },
  },
  plugins: [],
};

export default config;
```

### Google Fonts
In `src/app/layout.tsx`, import both fonts:
```tsx
import { Fraunces, DM_Sans } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
```

Apply both variables to the `<html>` tag's className.

### Global CSS
In `src/app/globals.css`, set the default background:
```css
body {
  background-color: #F7F5F2;
  color: #141414;
}
```

---

## Folder Structure

Scaffold exactly this:

```
src/
├── app/
│   ├── layout.tsx                  # Root layout with fonts
│   ├── page.tsx                    # Screen 1: Create Event (home)
│   ├── [eventId]/
│   │   └── page.tsx                # Screen 2: Event Gallery
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn components (auto-generated)
│   ├── create-event-form.tsx       # Full create event form
│   ├── event-gallery.tsx           # Gallery grid + header
│   ├── photo-grid.tsx              # The 3/4-col photo grid
│   ├── photo-lightbox.tsx          # Full screen photo viewer
│   ├── upload-fab.tsx              # Floating upload button
│   ├── upload-modal.tsx            # Upload flow sheet
│   ├── code-gate.tsx               # PIN entry screen for protected events
│   └── event-header.tsx            # Host message + event metadata
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── utils.ts                    # cn() and helpers
│   └── types.ts                    # All TypeScript types
└── actions/
    ├── create-event.ts             # Server action: create event
    ├── get-event.ts                # Server action: fetch event + photos
    └── upload-photo.ts             # Server action: handle upload
```

---

## Database Schema

Run this SQL in Supabase SQL editor to create the full schema:

```sql
-- Events table
create table events (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,            -- short human-readable ID for URLs (nanoid, 8 chars)
  name text not null,
  message text,                          -- host message shown to guests
  auth_type text not null default 'open' check (auth_type in ('open', 'code')),
  access_code text,                      -- hashed PIN, null if auth_type is 'open'
  allow_download boolean not null default true,
  expires_at timestamptz,               -- null means never expires
  created_at timestamptz default now() not null
);

-- Photos table
create table photos (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  storage_path text not null,           -- path in Supabase storage bucket
  uploader_session_id text,             -- anonymous session ID to enforce upload limits
  uploaded_at timestamptz default now() not null
);

-- Indexes
create index photos_event_id_idx on photos(event_id);
create index events_slug_idx on events(slug);
```

### Supabase Storage
- Create a storage bucket named `stash-photos`
- Set it to **private** (not public)
- Photos are served via signed URLs (1 hour expiry) generated server-side

### Row Level Security
Enable RLS on both tables. For MVP, use these permissive policies:
```sql
-- Allow anyone to read events (auth check is done in app logic)
alter table events enable row level security;
create policy "Public read events" on events for select using (true);
create policy "Public insert events" on events for insert with check (true);

-- Allow anyone to read/insert photos (event access check in app logic)
alter table photos enable row level security;
create policy "Public read photos" on photos for select using (true);
create policy "Public insert photos" on photos for insert with check (true);
```

---

## TypeScript Types

In `src/lib/types.ts`:

```ts
export type AuthType = "open" | "code";

export type Event = {
  id: string;
  slug: string;
  name: string;
  message: string | null;
  auth_type: AuthType;
  access_code: string | null;
  allow_download: boolean;
  expires_at: string | null;
  created_at: string;
};

export type Photo = {
  id: string;
  event_id: string;
  storage_path: string;
  uploader_session_id: string | null;
  uploaded_at: string;
  signed_url?: string; // populated after fetching
};

export type ExpiryOption = "1d" | "3d" | "7d" | "30d" | "never";
```

---

## Screen 1 — Create Event (`/`)

### Purpose
The host fills out event details and gets a shareable link.

### Layout
- Vertically centered single column, max-width 480px, centered on desktop
- Top: "stash" wordmark in DM Sans Medium, top-left, 24px from edges
- Large display heading: **"Create your stash"** in Fraunces, 36px, font-weight 300
- Subtext: **"Set it up. Share the link. Get everyone's shots."** in DM Sans, text-secondary
- Form below with generous spacing between fields (24px gap)
- Submit button at the bottom, full width, pill shape, accent background

### Form Fields (in order)

**1. Event name** (required)
- Input, placeholder: "What's the occasion?"
- Max 60 characters

**2. Message to guests** (optional)
- Textarea, 3 rows, placeholder: "Say something to the people joining..."
- This message is shown at the top of the gallery screen
- Max 200 characters

**3. Who can upload?** (required)
- Two pill toggle buttons side by side: "Anyone with the link" / "Link + access code"
- Default: "Anyone with the link"
- When "Link + access code" is selected, animate in a PIN input field below

**4. Access code** (conditional — shown only if code auth selected)
- 6-digit numeric PIN
- Rendered as 6 individual input boxes, each 1 character
- Auto-advance focus to next box on input
- Label above: "Set a 6-digit code"

**5. Can guests download photos?** (required)
- Two pill toggle buttons: "Yes" / "No"
- Default: "Yes"

**6. Stash closes in** (required)
- Segmented control with 5 options: "1 day" / "3 days" / "7 days" / "30 days" / "Never"
- Default: "7 days"

### Submit Button
- Label: "Create stash"
- Full width, pill, accent background (`#4A2D6F`), white text
- Loading state: spinner + "Creating..." label
- Disabled until event name is filled

### On Success
- Generate a `slug` using nanoid (8 chars, URL-safe)
- Hash the access code with bcrypt before storing (if provided)
- Store event in Supabase
- Redirect to `/{slug}` — the gallery page
- Show a one-time "Share this link" toast/banner at the top of the gallery with a copy button

### Empty/Initial State
No illustration. Just the form. The page itself is the empty state.

---

## Screen 2 — Event Gallery (`/[eventId]`)

### Purpose
Guests land here, optionally enter a PIN, see the gallery, and upload photos.

### Flow on load
1. Fetch event by slug from Supabase
2. If event not found → show "This stash doesn't exist" message, link back to home
3. If event expired → show "This stash has closed" with the event name and close date
4. If `auth_type === 'code'` and no valid session cookie → show `<CodeGate />` component
5. If auth passed (or open) → show full gallery

### Layout — Top Section (Event Header)
- "stash" wordmark top-left, same as Screen 1
- Event name in Fraunces display, large (36–48px depending on length), font-weight 300
- Host message below in DM Sans, text-secondary, 15px
- Metadata row: expiry date in text-tertiary ("Closes May 30" or "Never closes") + photo count ("12 photos")
- Subtle horizontal rule below this section

### Layout — Photo Grid
- 3 columns on mobile, 4 columns on desktop
- Gap: 2px between photos
- No rounded corners — full bleed square thumbnails
- Aspect ratio: 1:1 (use `aspect-square` and `object-cover`)
- Photos load with a fade-in animation, staggered 40ms per item
- Empty state (no photos yet): centered text in Fraunces italic — *"Nothing here yet."* with subtext in DM Sans — "Be the first to drop something."
- Tap any photo → opens `<PhotoLightbox />`

### Photo Lightbox
- Full screen overlay, background `#141414`
- Photo centered, `object-fit: contain`
- Swipe left/right to navigate between photos (use touch events)
- Top-right: close button (X icon, white)
- Bottom-right: download button (download icon, white) — only rendered if `allow_download === true`
- Transition: background fades in (300ms), photo scales from 0.95 to 1 (350ms ease-out)

### Floating Upload Button (FAB)
- Fixed position, bottom-right, 24px from both edges
- Pill shape, accent background, white text + camera icon
- Label: "Drop photos"
- On scroll down: shrinks to icon-only (no label), transition 200ms
- On scroll up or stop: expands back to full pill with label
- On tap: opens `<UploadModal />`

### Upload Modal
- Renders as a bottom sheet (use shadcn Sheet component, side="bottom")
- Handle bar at top center
- Title: "Drop your photos" in Fraunces
- Subtext: "Up to 10 photos. They'll appear in the stash right away."
- Large dashed upload zone: "Tap to choose photos" with upload-cloud icon
- `accept="image/*"`, `multiple`, `capture` attribute for mobile camera
- After selection: show thumbnail preview grid of selected photos
- Each thumbnail has an X to remove it before uploading
- Bottom: "Upload [n] photos" pill button (accent) — disabled until photos selected
- Upload limit enforcement: check how many photos this session has already uploaded (store count in localStorage keyed by event slug). If at 10, show "You've reached the 10 photo limit" and disable the upload zone.
- During upload: show a thin progress bar at the bottom of each thumbnail tile
- On complete: close sheet, photos appear in grid (refetch or optimistic update)

### Code Gate (PIN screen)
- Shown full-screen before gallery if event is code-protected
- "stash" wordmark top-left
- Heading in Fraunces: "This stash is private"
- Subtext: "Enter the code to see the photos"
- 6 individual PIN input boxes (same style as create flow)
- "Enter" button below, pill, accent
- On wrong code: shake animation on input boxes, subtext turns destructive red: "Wrong code. Try again."
- On correct code: set a session cookie `stash-auth-{slug}=true` (7 day expiry), reload page

---

## Component Specs

### `<CreateEventForm />`
- Client component (`"use client"`)
- Manages all form state with `useState`
- Calls `createEvent` server action on submit
- Handles redirect on success

### `<EventGallery />`
- Server component — fetches event and initial photos on the server
- Passes data down to client components
- Handles the auth gate logic server-side

### `<PhotoGrid />`
- Client component
- Accepts `photos: Photo[]` and `allowDownload: boolean`
- Renders grid, handles lightbox state
- Photos fade in on mount with staggered delay

### `<UploadFab />`
- Client component
- Tracks scroll direction with `useEffect` + `window.addEventListener('scroll')`
- Controls sheet open state

### `<UploadModal />`
- Client component
- Handles file selection, preview, limit checking, and upload
- Uploads to Supabase storage via server action
- Generates storage path: `{eventId}/{timestamp}-{filename}`

### `<CodeGate />`
- Client component
- Handles PIN input, verification against hashed code via server action
- Sets cookie on success

---

## Server Actions

### `createEvent` (`src/actions/create-event.ts`)
```ts
// Input: FormData or object with all event fields
// - Generate 8-char nanoid slug
// - Hash access_code with bcrypt if provided
// - Calculate expires_at from ExpiryOption
// - Insert into events table
// - Return { slug } for redirect
```

### `getEvent` (`src/actions/get-event.ts`)
```ts
// Input: slug string
// - Fetch event by slug
// - Fetch all photos for event
// - Generate signed URLs for each photo (1hr expiry)
// - Return { event, photos } or null
```

### `uploadPhoto` (`src/actions/upload-photo.ts`)
```ts
// Input: File, eventId, sessionId
// - Upload file to Supabase storage at path: {eventId}/{Date.now()}-{filename}
// - Insert record into photos table
// - Return { photo } with signed URL
```

### `verifyCode` (`src/actions/verify-code.ts`)
```ts
// Input: slug, enteredCode
// - Fetch event by slug, get access_code hash
// - Compare with bcrypt
// - Return { valid: boolean }
```

---

## Key UX Details (do not skip these)

- **Session ID for upload limits:** On first visit to any gallery, generate a UUID and store in localStorage as `stash-session-id`. Pass this as `uploader_session_id` on every upload. Count uploads per session per event client-side in localStorage as `stash-uploads-{slug}`. Cap at 10.

- **Share banner on event creation:** After redirect to the gallery, detect a `?created=true` query param and show a dismissable banner at the top: "Your stash is live — [copy link button]". Remove the query param from URL after showing.

- **Expired event handling:** On the gallery page server component, check if `expires_at` is in the past. If so, render the expired state — do not show photos or upload button.

- **Photo count in header:** Show live count. Update optimistically when new photos are uploaded.

- **No skeleton loaders** — photos fade in naturally. Don't add loading skeletons, they feel wrong for this product.

- **Error states** — keep them minimal. One line of text in text-secondary. No icons, no illustrations, no big error boxes.

---

## What NOT to build in this session

Keep scope tight. Do not build:

- User accounts or authentication (beyond the PIN gate)
- Admin panel or event management
- Comments or reactions on photos
- Email notifications
- Freemium gating UI (the 10-photo limit is enforced client-side for now)
- Multiple events per host dashboard
- Dark mode

These are post-MVP. Build the two screens and get them right.

---

## First prompt to run in Claude Code

Once you've read and understood this brief, start with:

1. Scaffold the full project structure as defined above
2. Set up Tailwind config with brand tokens
3. Set up Google Fonts (Fraunces + DM Sans) in layout.tsx
4. Set up Supabase client (client.ts + server.ts)
5. Create the types.ts file
6. Build Screen 1 (Create Event) fully — form, all fields, server action, redirect
7. Then move to Screen 2

Do not skip ahead. Do not add features not listed. Ask before making any product decisions not covered in this brief.
