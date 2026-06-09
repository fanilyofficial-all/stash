# Stash — Brand Guidelines

> A temporary, beautiful, private place for a moment that happened.

---

## 1. What is Stash

Stash is a shared photo drop app for real moments. A host creates an event, gets a link, shares it. Guests open the link, see the gallery, and drop their photos in. No accounts. No feed. No algorithm. Just the photos from that night, in one place, for the people who were there.

When the event expires, it's gone. Or you keep it. Your call.

---

## 2. Who it's for

Urban adults between 18–40. Friend groups, couples, small gatherings, weddings, birthday nights. People who already know how to have a good time — they just want a better place to put the photos from it.

They're not looking for another social network. They want something simple, beautiful, and private.

---

## 3. Personality

**In three words:** Quiet. Warm. Considered.

Stash doesn't shout. It doesn't celebrate itself. It's the app that's already open when the moment happens — unobtrusive, reliable, well-designed. Like a good disposable camera left on the table.

**Character traits:**
- Confident without being loud
- Warm without being soft
- Minimal without being cold
- Slightly editorial, never corporate

---

## 4. Voice & Tone

Talk like a person, not a product. Short sentences. Active voice. Occasionally dry. Never explain what someone can already see.

**Principles:**
- Say less, mean more
- Don't celebrate the obvious
- Avoid startup speak entirely
- Empty states should invite, not apologize

**Examples:**

| ❌ Don't | ✓ Do |
|---|---|
| "Upload your photos to create a shared memory album" | "Drop your shots. Everyone gets the good ones." |
| "Your event has been successfully created!" | "Your stash is live." |
| "No photos have been uploaded yet." | "Nothing here yet. Be the first to drop something." |
| "Please enter a valid access code." | "That code didn't work. Try again." |
| "Photos will be permanently deleted after expiry." | "This stash closes in 3 days." |

---

## 5. Name

**Stash**

Set in lowercase always. Never "STASH". Never stylized with punctuation or symbols.

A stash is something private, collected, yours. It implies a specific place for specific things — not a general archive, not a public gallery. Just the photos from that thing you did.

---

## 6. Logo

Wordmark only. No icon. The word does the work.

- Typeface: Geometric sans, lowercase, slightly tight tracking (letter-spacing: -0.02em)
- Weight: Medium (500) or Semibold (600)
- Color: `#141414` on light backgrounds, `#F7F5F2` on dark
- Accent option: The dot on the "i" can be set in `#4A2D6F` as the only moment of color in the mark

Do not add a tagline to the logo lockup. It stands alone.

---

## 7. Typography

Two typefaces. High contrast between them is intentional.

### Display — Fraunces
Used for event names, hero headings, and editorial moments. Variable font with optical sizing — set at `opsz` 9 for body display, `opsz` 144 for large headlines. Italic cuts add warmth.

- Use for: Event name on gallery screen, empty state headlines, onboarding hero text
- Weight range: Light (300) to Bold (700)
- Always: Optical sizing on, tight line height (1.1–1.2)

### UI — DM Sans
Used for all interface text — labels, buttons, form fields, body copy, captions.

- Use for: Everything that isn't a headline
- Weight range: Regular (400) to Medium (500)
- Line height: 1.5 for body, 1.2 for labels

### Type Scale

| Token | Size | Font | Weight | Use |
|---|---|---|---|---|
| `display-xl` | 48px | Fraunces | 300 | Event name hero |
| `display-lg` | 36px | Fraunces | 400 | Section titles |
| `display-md` | 28px | Fraunces | 400 | Card headings |
| `label-lg` | 16px | DM Sans | 500 | Buttons, nav |
| `body-md` | 15px | DM Sans | 400 | Body copy |
| `body-sm` | 13px | DM Sans | 400 | Captions, metadata |
| `label-xs` | 11px | DM Sans | 500 | Tags, badges |

---

## 8. Color

### Core Palette

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--bg` | Warm off-white | `#F7F5F2` | App background |
| `--surface` | White | `#FFFFFF` | Cards, sheets, modals |
| `--text-primary` | Near black | `#141414` | Headings, primary copy |
| `--text-secondary` | Warm grey | `#7A7570` | Metadata, labels, captions |
| `--text-tertiary` | Light grey | `#B0ABA6` | Placeholder, disabled |
| `--accent` | Aubergine | `#4A2D6F` | CTAs, active states, links |
| `--accent-light` | Pale lavender | `#EDE8F5` | Accent backgrounds, tags |
| `--border` | Subtle grey | `#E8E4DF` | Dividers, input borders |
| `--destructive` | Muted red | `#C0392B` | Delete, error states |

### Usage Rules
- Background is always `#F7F5F2` — never pure white for full-screen backgrounds
- Accent (`#4A2D6F`) is used sparingly — one CTA per screen maximum
- Never use accent for decorative purposes — only for interactive elements
- Photo grid has no border or shadow — photos sit directly on the background
- Text on photos (captions, overlays) uses white with a subtle dark gradient, never a solid box

---

## 9. Spacing

Base unit: **8px**

All spacing is a multiple of 8: 4, 8, 16, 24, 32, 48, 64, 96.

| Token | Value | Common use |
|---|---|---|
| `space-xs` | 4px | Icon gaps, tight inline |
| `space-sm` | 8px | Within components |
| `space-md` | 16px | Between elements |
| `space-lg` | 24px | Section padding |
| `space-xl` | 32px | Screen-level padding |
| `space-2xl` | 48px | Hero top padding |
| `space-3xl` | 64px | Large section gaps |

Screens have **24px horizontal padding** on mobile, **40px on desktop**.

---

## 10. Components

### Floating Upload Button (FAB)
- Fixed bottom-right, 24px from edges
- Pill shape: `border-radius: 100px`
- Background: `#4A2D6F` (accent)
- Label: "Drop photos" in DM Sans Medium, white
- Has a subtle upward-drop shadow: `0 4px 24px rgba(74, 45, 111, 0.25)`
- On scroll: shrinks to icon-only (camera icon), expands on scroll-stop

### Photo Grid
- 3-column on mobile, 4-column on desktop
- Gap: 2px — tight, editorial
- No rounded corners on photos — full bleed squares
- Aspect ratio: 1:1 (square crop)
- Tap opens lightbox with smooth scale + fade transition

### Lightbox
- Full screen, black background
- Photo centered with object-fit: contain
- Swipe to navigate on mobile
- Download button bottom-right (only if host enabled it)
- Close: tap outside or top-left X

### Input Fields
- No label above — placeholder that floats up on focus
- Border: 1px solid `#E8E4DF`, focus: `#4A2D6F`
- Border-radius: 12px
- Height: 52px

### Buttons
- Primary: Filled, `#4A2D6F` bg, white text, border-radius 100px (pill)
- Secondary: 1px border `#141414`, transparent bg, black text, pill
- Destructive: `#C0392B` bg, white text, pill
- Never use square or sharp-cornered buttons

### Code Entry (PIN)
- 6 large individual digit boxes
- Each box: 56x64px, border-radius 12px, border `#E8E4DF`
- Active box border turns `#4A2D6F`
- Auto-advance on input

---

## 11. Motion

Stash moves quietly. No bouncing, no spring physics, nothing that draws attention to itself.

**Principles:**
- Ease: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances (ease-out-expo feel)
- Duration: 200ms for micro, 350ms for transitions, 500ms for page-level
- Nothing loops unless the user triggers it

**Key moments:**
- Gallery load: photos fade + scale in staggered, 40ms delay per item, from `scale(0.97) opacity(0)` to `scale(1) opacity(1)`
- Photo upload: progress shown as a thin `#4A2D6F` line at the bottom of the uploading photo tile
- Lightbox open: background darkens (300ms), photo scales from thumbnail position to full (350ms)
- FAB: shrinks to icon on scroll down (200ms), expands on scroll up or stop (300ms)
- Success states: single 200ms opacity flash, no animation beyond that

---

## 12. Iconography

Use [Lucide Icons](https://lucide.dev) — stroke-based, 1.5px stroke weight, consistent with the clean aesthetic.

Key icons in use:
- Upload / drop: `upload-cloud`
- Camera: `camera`
- Download: `download`
- Lock / code protected: `lock`
- Time / expiry: `clock`
- Close: `x`
- Share: `share-2`
- Delete: `trash-2`

Always 20x20px in UI, 24x24px in FAB and prominent CTAs. Never filled variants.

---

## 13. Photography Style (marketing & empty states)

When using real photos (for marketing, onboarding, empty states):
- Candid over posed
- Low-light, golden hour, motion blur — real moments
- Never stock photography
- Slight film grain overlay acceptable (opacity 0.04–0.06)
- Colors should be slightly desaturated — not filtered, just honest

---

## 14. What Stash is not

- Not Google Photos — no AI, no organization, no search
- Not a social network — no likes, comments, followers
- Not BeReal — not performative, not gamified
- Not feature-heavy — if a feature needs explaining, it doesn't belong
- Not loud — the best UI moment in Stash is one the user doesn't notice

---

## 15. The one rule

**Get out of the way of the photos.**

Every design decision runs through this filter. If something pulls attention away from the photos or from the moment being shared, remove it.
