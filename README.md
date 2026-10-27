# TiTANiUM Technology — website

Vite + Three.js + GSAP. Bilingual (EN / AR with RTL). No backend needed.

## Run locally
    npm install
    npm run dev

## Deploy (Netlify)
Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).

## Contact form -> your inbox
The form uses Netlify Forms (`name="contact"`). After the first deploy:
Netlify dashboard -> Project configuration -> Notifications -> Form submission notifications
-> Add notification -> Email -> abdomgiza@gmail.com

## Things to replace later
- Logo: the mark in `index.html` (`.brand-mark`) and `public/favicon.svg` are placeholders.
- Add real photos (racks, cabling, CCTV installs) when available.
- Add `og:image` once a logo / share image exists.
