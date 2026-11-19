# Khaled — Full-Stack & Web Developer Portfolio

A cinematic single-page portfolio built around a live WebGL chrome sculpture, editorial typography, and acid-lime accents. No build step, no framework, no `node_modules` — just HTML, CSS, and JavaScript. The profile, projects, and services come from Khaled's portfolio content PDF.

## Live

- **Site:** [khaled-alaa-portfolio.netlify.app](https://khaled-alaa-portfolio.netlify.app)
- **Source:** [github.com/khaled24682/khaled-alaa-portfolio](https://github.com/khaled24682/khaled-alaa-portfolio)
- **Production inbox:** [Netlify Forms → contact](https://app.netlify.com/projects/khaled-alaa-portfolio/forms)

The free `khaled-alaa.is-a.dev` custom domain will replace the Netlify URL once its registration is approved.

---

## Run it

### Option 1 — just open it
Double-click `index.html`. The site is written to work from `file://`, so the 3D scene still loads (Three.js and its addons are imported from a CDN).

### Option 2 — local server (recommended)
A tiny zero-dependency static server is included for Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then visit **http://localhost:4173**.

The server disables caching, which makes editing copy and refreshing painless. Change the port with `.\serve.ps1 -Port 8080`.

### Deploying
Upload the folder as-is to any static host — Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3. There is nothing to build. For best results, serve over HTTPS and set the Open Graph image URL to the absolute address of `assets/og.jpg`.

The production copy is deployed on Netlify at **https://khaled-alaa-portfolio.netlify.app**. The form is handled by Netlify Forms, and submissions appear in the [production inbox](https://app.netlify.com/projects/khaled-alaa-portfolio/forms).

---

## Edit the content

**Everything you would normally want to change lives in [`js/content.js`](js/content.js).** It is a single `window.SITE` object:

| Key | What it controls |
| --- | --- |
| `person` | Name, role, email, WhatsApp number, location, availability, timezone for the live clock |
| `contact` | Form endpoint, local storage key, Netlify inbox URL, project types, budget ranges |
| `hero` | Eyebrow, intro paragraph, ticker words |
| `socials` | Footer/social links and handles |
| `about` | Statement, long bio, "Right now" list |
| `stats` | Three honest focus areas (or animated counters if you add real numbers) |
| `projects` | Work list **and** full case-study dialogs |
| `capabilities` | The four expertise cards |
| `services` | Service areas and supporting experience |
| `stack` | The two marquee rows |

### Projects / case studies
Each project powers a row in the work index and the full-screen case study that opens when it is clicked:

```js
{
  id: "body-trip",               // unique, lowercase
  index: "01",
  title: "Body Trip",
  subtitle: "Online course platform",
  type: "Full-stack",            // shown in the project row and dialog top bar
  role: "Developer",
  stack: ["Node.js", "Express.js", "EJS", "MongoDB"],
  summary: "...",                // short blurb
  challenge: "...",              // case study body
  approach: "...",
  scope: "...",                  // short scope line in the dialog meta
  context: "...",                // longer context block
  accent: "#c6ff3d",             // row hover + dialog accent
  art: 1,                        // 1–4, selects the generated artwork
  artTag: "NODE / EJS",          // small label inside the artwork
}
```

### Things to confirm before publishing
- `person.email`, `person.whatsapp`, and the social URLs are now the real profile details from the PDF.
- `person.location` is set to `Egypt — remote` and the clock uses `Africa/Cairo`. Change these if the public location or timezone should be different.
- `contact.endpoint` — only if you are not using Netlify Forms.
- The project names, domains, and scope wording. The PDF's own accuracy checklist asks you to confirm you have permission to publish client names, domains, and screenshots, and that each description matches the work you personally did.
- Project dates, screenshots, repository/demo links, and any verified outcomes. None of these were available in the source PDF, so they are intentionally absent rather than invented.
- A testimonial, if you want one. The old placeholder quote was removed.
- The OG meta tags in `index.html` (`og:image` especially) if you attach a custom domain.
- `capabilities` and `stack` were deliberately left unchanged at your request.

---

## Contact form and inbox

The contact section is a real form: name, email, project type, budget, brief, an optional WhatsApp number, a consent checkbox, and a honeypot. It validates in the browser, saves the brief to a local preview inbox, then delivers it to Netlify Forms or your own endpoint.

### Local preview

While developing on localhost or `file://`, submissions are stored in `localStorage` under `portfolio-inbox`. Open **[`dashboard.html`](dashboard.html)** to read them. A **Local inbox** link also appears in the site footer only on localhost/`file://`, and the form's success state gets an **Open inbox** button after a local save. The dashboard includes:

- total, last-7-days, and latest-arrival stats;
- full-text search and project-type filter;
- long briefs with a read-more toggle;
- reply by email or WhatsApp, copy email, two-step delete;
- CSV export and clear-all.

The dashboard is `noindex,nofollow` and only sees the inbox in **this browser**. It is a development preview, not a shared production inbox.

### Netlify Forms (recommended free option)

The form is pre-wired for [Netlify Forms](https://docs.netlify.com/manage/forms/setup/): it has `data-netlify="true"`, `name="contact"`, a hidden `form-name` field, and a honeypot. Form detection is already enabled on the production site. For a fresh deploy:

1. Create the site (Netlify Drop or a connected repo).
2. In Netlify, open **Forms** and select **Enable form detection**.
3. Deploy or redeploy the folder. Netlify scans the static HTML at deploy time.
4. Open [Forms → contact](https://app.netlify.com/projects/khaled-alaa-portfolio/forms) to read submissions.
5. Add an email alert under **Forms → Submission notifications**.

No API key or server is needed. Keep the form markup in `index.html` — if it only exists in JavaScript, Netlify cannot register it.

> On a deployed site, `dashboard.html` cannot read Netlify's submissions — Netlify is the source of truth. The page shows a notice and an **Open Netlify Forms inbox** button when it is opened from a real domain.

### Custom endpoint

Set `SITE.contact.endpoint` in `js/content.js` to receive a JSON `POST` instead:

```js
contact: {
  endpoint: "https://your-function.example.com/contact",
  storageKey: "portfolio-inbox",
  // ...
}
```

Payload:

```json
{
  "id": "6f1c…",
  "createdAt": "2026-11-16T12:00:00.000Z",
  "name": "Ada Mercure",
  "email": "ada@example.com",
  "phone": "+971 50 123 4567",
  "project": "Full-stack application",
  "budget": "$5k – $10k",
  "message": "…",
  "consent": true,
  "source": "/"
}
```

The endpoint must return a 2xx response. A failed POST still leaves the brief in the local inbox as a backup and shows an error with the email/WhatsApp fallback.

### WhatsApp

Set `SITE.person.whatsapp` to digits only, including the country code:

```js
whatsapp: "201147080934",
```

Reload, and two WhatsApp entry points appear: a direct chat button in the contact section, and a "WhatsApp instead" button in the form that pre-fills the fields typed so far. Both stay hidden while the value is empty.

---

## Look & feel

The design system is defined once at the top of [`styles.css`](styles.css) in `:root`:

```css
--ink: #050506;      /* near-black background */
--paper: #ecece7;    /* warm white */
--acid: #c6ff3d;     /* acid lime */
--serif: "Instrument Serif";
--sans: "Space Grotesk";
--mono: "JetBrains Mono";
```

Change those four colour variables and the whole site — including the 3D lighting — follows the same palette (the lime accent is also referenced in `js/app.js` for the scene rim light).

Typography is loaded from Google Fonts. The CSS includes a full fallback stack, so the site remains usable offline.

---

## The 3D layer

`js/app.js` builds a single, high-resolution sphere with:

- a custom vertex displacement shader (layered simplex noise) for the liquid silhouette;
- a `MeshPhysicalMaterial` with metalness `1` and a custom fresnel rim injection;
- a hand-painted 2K equirectangular studio map (tall window lights, acid horizon, violet wash) fed through `PMREMGenerator`;
- `UnrealBloomPass` (full-quality tier only) and ACES tone mapping;
- orbital rings, shader particles, and a soft floor glow.

The canvas is fixed behind the page and is only really visible in the hero and contact sections. On scroll it drifts across the layout; in contact it eases toward the centre and grows slightly.

### Performance
The scene is budgeted rather than always-on:

- It only submits frames while the hero or contact section is on screen (or about to be), and pauses entirely while a case-study dialog is open. The opaque middle sections would hide it anyway.
- Device pixel ratio is capped by a pixel budget (about 2.4 MP desktop, 1.6 MP mobile) before bloom, so high-DPI screens do not shade 2–3× more pixels than they need.
- A one-shot FPS sample runs after the loader and intro settle. If it is below ~48 fps, the page automatically drops to the low tier: lighter sphere mesh, no iridescence, ~900 particles, no bloom, and a 1.2 MP budget.
- Force the low tier with `?quality=low`, or pin full quality (and disable auto-degrade) with `?quality=high`. Both survive alongside `?motion=off/on`.
- Software WebGL (SwiftShader, llvmpipe, remote desktop) is detected and replaced with the CSS art fallback. Add `?webgl=off` to force that fallback manually.

### Motion control
Animation runs by default, regardless of the operating system's reduced-motion setting. To pause it, use the **Motion on/off** control in the footer or add `?motion=off` to the URL. The choice is saved in `localStorage` under `portfolio-motion`. In paused mode the 3D scene renders a single frame, the loader is skipped, all reveals appear immediately, and the counters show their final values. `?motion=on` forces motion back on for a single visit.

### Fallbacks
- No WebGL? `document.documentElement` gets `.no-webgl` and an animated CSS orbital fallback is shown: a bobbing chrome orb, three tilted orbit rings with travelling dots, and a star field. It uses transform/opacity only, so it stays alive even when Chrome is compositing without GPU acceleration.
- Slow network or a throttled background tab? The loader is bounded by a 7-second timer and will never trap the page; a `noscript` message is also included.

Three.js r169, GSAP + ScrollTrigger, and Lenis are all loaded from public CDNs. The site needs a network connection for the 3D scene; without one it degrades gracefully.

---

## Files

```
index.html          Page structure, import map, CDN scripts
dashboard.html      Local preview inbox for the contact form
styles.css          Design tokens, layout, responsive rules, art fallbacks
dashboard.css       Inbox-only styles
js/content.js       All editable copy, contact config, and project data
js/app.js           UI behaviour + contact form + Three.js scene
js/dashboard.js     Inbox rendering, search/filter, CSV export, deletes
serve.ps1           Optional local static server
assets/og.jpg       1200×630 social preview (optimized)
assets/og.png       1200×630 PNG source for the social preview
```

---

## Notes

- The page is designed at 1440–1920px and tested down to 320px.
- The project rows, mobile menu, case-study dialog, contact form, and copy-email control are all keyboard accessible.
- Contact submissions are handled by Netlify Forms on a Netlify deploy, or by `SITE.contact.endpoint` anywhere else. `dashboard.html` is a local preview only.
- For a quicker edit loop, keep the local server running and refresh after saving `js/content.js` or `styles.css`.
