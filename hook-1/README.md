# Aurcade Client Hook

This repo now contains a focused web concept meant to help hook Aurcade as a client.

## What is included

- `index.html`: single-page conversion-oriented concept
- `styles.css`: retro-modern visual system (pixel arcade + clean UX)
- `main.js`: lightweight motion and interaction (reveals, countups, CRT toggle)

## Run locally

Because this is static frontend code, you can open `index.html` directly, or serve it:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Direction for next iteration

- Convert this to a component-based app (React/Next) if needed.
- Add real IA for `/venues`, `/games`, `/events`, `/leaderboards`.
- Connect event and score modules to real backend APIs.
