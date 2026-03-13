# Aurcade Hook Source Of Truth

Last updated: 2026-03-13
Owner: Sul + Codex

## Mission

Build web concepts that are strong enough to hook Aurcade as a client.

## Primary Goal

Each hook should make it immediately obvious that we understand:

1. Aurcade's core product loop (score competition).
2. Aurcade's audience (players, venues, operators, event organizers).
3. How to convert that into a business-ready web experience.

## Audience Targets

1. Aurcade decision makers.
2. Venue operators (arcades, bars, family entertainment centers).
3. Competitive and social players.

## Brand Fidelity Rules

1. Retro arcade DNA is required.
2. Leaderboards and score competition should feel central, not decorative.
3. Visual language should include arcade-era cues (pixel type, cabinet framing, CRT texture, neon accents).
4. UX must still feel modern, fast, and clear.
5. Avoid generic startup/SaaS look and feel.
6. Hook 4 direction is "same site, different skin": keep Aurcade text, structure, and imagery mostly intact.
7. Do not explain the concept in UI copy; show it through layout and styling.
8. Use original Aurcade wording as the source copy for Hook 4 content blocks.
9. Keep the existing Aurcade banner (`/images/header.jpg`) and base space background (`/images/back-space.jpg`) as anchor visuals.
10. Keep classic forum presentation strongest in announcements and forum sections.
11. For content sections, support both list and grid viewing patterns.
12. Character intros should start hidden and only appear after scroll interaction.
13. In Hook 4 games flow, use one character at a time and alternate entry side by section.
14. Character intros should render as cutout-style portraits, not framed banners.

## UX And Product Rules

1. Mobile and desktop must both work well.
2. Include clear conversion paths (pilot, demo, contact, or equivalent CTA).
3. Message both fun and operator value (traffic, repeat visits, events, retention).
4. Keep interactions purposeful (no empty animation noise).
5. Image media should fill its visual frame cleanly (avoid obvious empty container space).
6. Character popouts should match on-screen section context (mention/cameo alignment).
7. Prefer a longer, scroll-forward page flow for Hook 4 presentation.

## Technical Rules

1. Each concept lives in its own folder: `hook-N`.
2. Default concept structure:
   - `index.html`
   - `styles.css`
   - `main.js`
   - `README.md`
3. Keep dependencies light unless explicitly needed.
4. Use ASCII-only content in repo files by default.

## Repo Structure

- `hook-1/`: first concept build (retro-modern leaderboard direction)
- `hook-2/`: second concept build (retro portal, less modern polish)
- `hook-3/`: serious sample site (multi-page, production-style IA)
- `hook-4/`: full production-site example with complete section coverage

## Hook Log

### Hook 1

- Path: `hook-1/`
- Status: complete first-pass concept
- Direction: retro-modern arcade, leaderboard-first hero, neon + CRT atmosphere
- Includes:
  - responsive single-page layout
  - conversion-focused messaging
  - interactions (reveal, ticker, count-up, CRT toggle)

### Hook 2

- Path: `hook-2/`
- Status: complete first-pass concept
- Direction: old-web arcade portal inspired by classic directory/game archive sites
- Includes:
  - three-column retro layout with side rails
  - link-dense navigation and framed panel UI
  - live leaderboard table, events panel, venue/operator messaging
  - light dynamic behavior (clock refresh, now-playing rotation, visitor counter)

### Hook 3

- Path: `hook-3/`
- Status: complete first-pass serious sample site
- Direction: hook-2 retro aesthetic matured into a practical multi-page product sample
- Includes:
  - shared IA with dedicated Home, Games, Venues, and Events pages
  - filterable game directory using real Aurcade-hosted game screenshots
  - venue onboarding and pilot conversion page structure
  - event schedule + results templates suitable for production planning

### Hook 4

- Path: `hook-4/`
- Status: active iteration
- Direction: full production-site example with Aurcade-first fidelity (same IA/content structure, reskinned presentation)
- Includes:
  - Home, Newest Scores, Browse Games, Browse Locations, Events, Public Forums, and About Us pages
  - in-product workflows (submit score, filters, searchable lists, public tables)
  - data-heavy layouts using Aurcade-style labels and information groupings
  - shared interaction layer for nav state, filters, search, timestamps, and voting
  - Aurcade header and background assets (`header.jpg`, `back-space.jpg`) as baseline visuals
  - Browse Games fake-data profile panel so in-page game links are functional for demos

## Workflow For Every New Hook

1. Read this document first.
2. Create new folder (`hook-2`, `hook-3`, etc.).
3. Define a one-line concept thesis before coding.
4. Build the full concept.
5. Add or update that hook's `README.md`.
6. Update this file:
   - add hook entry under `Hook Log`
   - update `Repo Structure`
   - update `Last updated` date

## Anti-Drift Rule

If context gets messy, reset by treating this file as canonical. Then read the newest hook `README.md` and continue from there.

## Current Next Step

Continue a page-by-page fidelity pass on `hook-4` so content blocks, labels, and assets stay as close as possible to current Aurcade while preserving the new skin.
