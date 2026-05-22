# TiTANiUM Technology Website

Modern premium website for TiTANiUM Technology, built with Next.js, React, TailwindCSS, Framer Motion, and Lucide icons.

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Email Setup

Create `.env.local` and add:

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="TiTANiUM Website <website@your-verified-domain.com>"
```

`RESEND_FROM_EMAIL` is optional, but recommended for production after verifying a sending domain in Resend. Contact form submissions are sent to `abdomansourshalaby@gmail.com` through `app/api/contact/route.ts`.

## Notes

- The official uploaded logo is stored at `public/logo.png.jpg`; `public/logo-cropped.png` is a cropped display derivative used for sharper on-site branding.
- Contact details are set to WhatsApp `+971541938341` and `abdomansourshalaby@gmail.com`.
