# Marianne Land — Project Summary

## What is this?

A personal Norwegian-language **progressive web app (PWA)** for planning romantic trips and revealing daily surprises to a partner. Think of it as a private "advent calendar for travel" — you set up a trip with a destination, dates, and hidden surprises that unlock day-by-day.

---

## Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Framework    | SvelteKit (Svelte 5, runes)                     |
| Styling      | Tailwind CSS v4 (`@tailwindcss/forms`, `typography`) |
| CMS          | Sanity.io (GROQ queries, image uploads)         |
| Deployment   | Vercel (`@sveltejs/adapter-vercel`)              |
| Language     | TypeScript                                      |
| Build        | Vite 7                                          |

---

## Routes

| Route            | Purpose                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `/`              | Homepage — featured trip countdown (active/upcoming) + past trips list  |
| `/trip/[slug]`   | Trip detail — countdown, day-by-day timeline, surprise cards, photo gallery + upload |

---

## Trip Lifecycle

A trip has **three states** based on today's date vs `departureDate` / `returnDate`:

1. **Upcoming** — countdown timer shown, all surprises locked
2. **Active** — "Dere er her!" banner, surprises unlock day-by-day as their `unlockDate` arrives
3. **Past** — all surprises revealed, "memories" view

---

## Key Features

### Surprise Cards
- Each surprise has an `unlockDate`, a `type` (activity / restaurant / surprise), and an `icon`
- Locked cards show a padlock; tapping shakes the card
- Unlocked cards do a **3D CSS flip reveal** with confetti particles and haptic feedback

### Dual Data Source
- `$lib/server/trips.ts` checks if Sanity is configured
- **With Sanity** → fetches via GROQ queries
- **Without Sanity** → falls back to static `$lib/data/trips.json`
- Makes local development possible without CMS credentials

### Photo Uploads
- Trip detail page has a SvelteKit form action (`?/upload`)
- Uploads images to Sanity assets, appends references to the trip document
- Only allowed for active or past trips

### PWA
- `manifest.json` with `display: standalone`
- Apple-touch-icon and theme-color meta tags
- Designed for "Add to Home Screen" on mobile

---

## Sanity Studio Schemas (`/studio`)

| Schema        | Type     | Key Fields                                                        |
| ------------- | -------- | ----------------------------------------------------------------- |
| **Trip**      | document | destination, slug, emoji, tagline, dates, flights[], surprises[], photos[] |
| **Surprise**  | object   | unlockDate, type, title, description, icon                        |
| **FlightInfo**| object   | direction, airline, flightNumber, times, airports, terminal, gate, booking ref, seats |

---

## Design Theme

Custom Tailwind palette — romantic pink/rose aesthetic:

- `plum` (#881337) — primary text
- `blush` (#fdf2f8) — page background
- `pink` (#ec4899) — accents, buttons, active states
- `rose` (#e11d48) — errors
- Display font: Georgia / serif for headings

---

## Custom Animations

| Animation       | Used for                              |
| --------------- | ------------------------------------- |
| `digit-flip`    | Countdown digit transitions           |
| `confetti-fall` | Surprise reveal particles             |
| `pulse-glow`    | "Today" indicator on the timeline     |
| `float`         | Gentle bob on hero/emoji elements     |
| `shake`         | Locked card tap feedback              |
| `flip-card`     | 3D card flip for surprise reveal      |

---

## Current Data

One trip configured: **London, Feb 27 – Mar 1, 2026** with 4 surprises (Hamilton show, Dishoom dinner, Borough Market, mystery gift).