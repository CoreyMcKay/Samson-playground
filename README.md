# Corey McKay — Player One

My personal website. Nintendo-modern: bold red, rounded cards, playful motion. No build step — vanilla HTML/CSS/JS + GSAP, deployed on GitHub Pages.

**Play it:** https://coreymckay.github.io/Samson-playground/

## Structure

- `index.html` — the whole game: title screen, player profile, cartridges, patch notes, bonus stage, continue screen
- `assets/css/style.css` — the theme (light "Player 1" + dark "Player 2" mode)
- `assets/js/main.js` — theme toggle, scroll reveals, cartridge tilt, fake terminal, Konami code
- `assets/img/avatar.png` — generated player avatar

## Widgets

- **Debug console** — fake terminal (`help`, `whoami`, `projects`, `skills`, `contact`, `konami`)
- **Konami code** — ↑ ↑ ↓ ↓ ← → ← → B A for +30 lives
- **Player 2 mode** — dark theme toggle, persisted in localStorage
- **Now status** — what I'm playing at the moment

## Local dev

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
