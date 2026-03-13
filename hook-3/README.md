# Aurcade Hook 3 - Serious Sample Site

Hook 3 is a full sample site direction, not just a billboard.

## Concept Thesis

Use hook-2's retro portal DNA as an off-ramp into a production-style, multi-page
Aurcade web experience with clear information architecture and conversion flows.

## Included Pages

- `index.html`: home (value proposition, highlights, featured games, outcomes)
- `games.html`: filterable catalog with real game screenshots
- `venues.html`: partner venue directory + pilot conversion form
- `events.html`: schedule, results, and event rules framework

## Shared Files

- `styles.css`: shared visual system and responsive layout
- `main.js`: active nav, timestamp rendering, and game filter behavior

## Asset Notes

- Game screenshots and logo links use publicly accessible Aurcade-hosted assets.
- Aurcade game pages are linked as references on each card.

## Run

Open any page directly, or serve locally:

```powershell
python -m http.server 8080
```

Then open:

- `http://localhost:8080/hook-3/`
- `http://localhost:8080/hook-3/games.html`
