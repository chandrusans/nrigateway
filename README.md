# NRI Gateway — Website

A fast, dependency-free, single-page website for **NRI Gateway** — providing Immigration, Education and Parental Care services for Non-Resident Indians.

Built with plain HTML, CSS and JavaScript. No build step, no framework. Just static files.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure & content |
| `styles.css` | Futuristic dark-glass theme, animations, responsive layout |
| `script.js` | Nav, scroll reveals, count-up stats, particle canvas, contact form |
| `favicon.svg` | Gradient hexagon logo / favicon |
| `robots.txt`, `sitemap.xml` | SEO |
| `vercel.json` / `netlify.toml` | Host config (security headers + caching) |

## Before you go live — 2 steps

### 1. Wire up the contact form (Formspree — free, no backend)
1. Create a free account at **https://formspree.io** and add a new form.
2. Copy your form endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, replace `YOUR_FORM_ID` in the `<form ... action="https://formspree.io/f/YOUR_FORM_ID">` tag with your real ID.

Until this is done, the form gracefully falls back to opening the visitor's email app addressed to `info@nrigateway.in`. Change `FALLBACK_EMAIL` in `script.js` if you use a different address.

*Alternatives:* EmailJS, Web3Forms, or your own API endpoint — just point the form `action` at it.

### 2. Set your real email
Search-replace `info@nrigateway.in` in `index.html` and `script.js` with your actual inbox.

## Run locally

```bash
# any static server works, e.g.:
python3 -m http.server 4173
# then open http://localhost:4173
```

## Deploy

**Vercel**
```bash
npm i -g vercel && vercel --prod
```

**Netlify**
```bash
npm i -g netlify-cli && netlify deploy --prod
```
Or drag-and-drop this folder into the Netlify dashboard.

**Any static host / cPanel** — upload all files to your web root. That's it.

### Point the domain
In your host's dashboard add the custom domain `nrigateway.in` and update the DNS records (A / CNAME) at your registrar as instructed. Then update the `loc` in `sitemap.xml` and `Sitemap:` in `robots.txt` if your final URL differs.

## Business details baked in

- **Address:** 73/1, 13th Cross Road, Mahalakshmi Layout, Near Panchamukhi Ganapathi Temple, Bovipalya, Nagapura, Bengaluru, Karnataka 560086
- **Phone (India):** +91 73488 21565 · **Phone (USA):** +1 (410) 988 3075
- **Map:** pinned to 13.0082354, 77.5432523 (embedded in the Contact section)
- JSON-LD `ProfessionalService` schema is included in `index.html` for rich search results.
