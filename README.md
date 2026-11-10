# TiTANiUM Technology — website

Bilingual (Arabic RTL + English LTR) static site for Abdulrahman Mansour, IT technician in Dubai, under the TiTANiUM Technology brand.
Plain HTML, CSS and JavaScript. No build step. Hosted on Cloudflare Workers (static assets).

```
public/
  index.html     main page (ships in Arabic; English is switched in by app.js)
  ticket.html    support ticket form
  styles.css     all styles (colours are CSS variables at the top)
  app.js         language switch, scroll animations, ticket form
  logo.svg       the TiTANiUM logo (vector, light version for the dark background)
  404.html  favicon.svg  og.png  robots.txt  sitemap.xml
wrangler.jsonc   Cloudflare Workers config (serves ./public)
```

## 1. Ticket form (Web3Forms)

The form posts to Web3Forms with the access key at the top of `public/app.js` (`WEB3FORMS_ACCESS_KEY`), the same key the previous site used.
To send tickets to a different inbox, create a new key at https://web3forms.com and replace that value.
The access key is meant to be public. The destination email lives only in the Web3Forms account and never appears in this site.

## 2. Deploy: GitHub → Cloudflare Workers

1. Push this folder to your GitHub repository (the files must sit at the repository root, with `wrangler.jsonc` next to `public/`).
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → choose the repository.
3. Build command: leave empty, or keep `npm run build` (it does nothing; the site has no build step). Deploy command: `npx wrangler deploy`.
4. Every push to the main branch now redeploys the site automatically.

To deploy by hand instead: `npx wrangler deploy` from this folder.

## 3. Custom domain

1. Add the domain to Cloudflare (or buy it there) so its DNS is managed by Cloudflare.
2. Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → enter the domain. Cloudflare creates the DNS record and the certificate.
3. Then replace the old address `https://titanium.technolgy.workers.dev` with the new one in:
   `public/index.html`, `public/ticket.html` (canonical, hreflang, Open Graph and JSON-LD lines), `public/sitemap.xml`, `public/robots.txt`.

## Editing text

- Arabic text is in the HTML files. English text is in the `EN` object at the top of `public/app.js`, matched by the `data-i18n` key on each element.
- Phone numbers and social links: search for `wa.me`, `instagram.com` and `facebook.com` in the two HTML files (and `WHATSAPP_URL` in `app.js`).

## Notes

- Animations use GSAP 3.12.5 + ScrollTrigger from cdnjs. If the script fails to load, JavaScript is off, or the visitor prefers reduced motion, every drawing simply shows fully assembled.
- A language can be forced with `?lang=ar` or `?lang=en`; the choice is remembered in `localStorage` (`titanium_lang`).
