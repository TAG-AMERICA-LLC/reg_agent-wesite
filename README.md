# [NOME BRAND] — Sito v2 (Astro 4 + React)

Riscrittura editoriale del portale informativo e commerciale per il company setup in Florida.
**Non è uno studio legale.**

## Stack

| Layer | Tech |
|---|---|
| Framework | **Astro 4** (output statico, SEO-first, zero JS di default) |
| UI islands | **React 18** (solo per componenti interattivi) |
| Styling | **Tailwind CSS 3** + design system custom su CSS variables |
| Animazioni | **Framer Motion** (FAQ, cookie banner, form) + IntersectionObserver per scroll reveal |
| Tipografia | **Fraunces Variable** (display serif) + **Inter Variable** — via `@fontsource-variable` (self-hosted, no Google Fonts CDN) |
| Icone | **lucide-react** |
| Content | **Astro Content Collections** con frontmatter type-safe (Zod) |
| Dark mode | Class strategy + bootstrap inline pre-render (zero FOUC) |
| Transizioni pagina | View Transitions API native di Astro |
| Sitemap | `@astrojs/sitemap` (auto-gen) |

## Design system

Direzione: **editorial elegante**. Whitespace generoso, serif variable per i display (`Fraunces` con OpenType `SOFT`/`WONK`), tipografia di testo neutra (Inter), palette quasi monocromatica:

| Token | Light | Dark |
|---|---|---|
| Background | `#fffdfa` (off-white caldo) | `#0c0e14` (near-black) |
| Surface | `#faf7f1` (avorio) | `#121620` |
| Ink primary | `#0f172a` | `#f8fafc` |
| Accent | `#a85a2d` (terra/ruggine) | `#dc915a` (amber caldo) |
| Line | `#e2dcd1` | `#262c3a` |

Tutti i token sono in `src/styles/global.css` come variabili CSS `rgb()` integrate con Tailwind via `tailwind.config.mjs`.

Micro-pattern editoriali:
- `chapter-num` per i numerali in stile rivista (`— 01`)
- `display` con kerning ottico (`opsz` variable axis)
- `dropcap` capolettera serif sui post del blog
- `paper-noise` overlay SVG sottilissimo per dare consistenza al light mode
- `mesh-accent` gradient mesh delicato dietro gli hero
- `link-underline` underline animato che cresce in hover

## Struttura

```
site-v2/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── public/
│   ├── favicon.svg
│   ├── og-default.svg
│   └── robots.txt
└── src/
    ├── styles/global.css              # design system + Tailwind layers
    ├── content/
    │   ├── config.ts                  # Zod schema per il blog
    │   └── blog/                      # articoli .md (3 di esempio)
    ├── layouts/Layout.astro           # SEO, viewport, theme bootstrap, View Transitions
    ├── components/
    │   ├── Header.astro               # nav + dropdown + mobile menu
    │   ├── Footer.astro               # footer + disclaimer banner
    │   ├── Hero.astro                 # hero della home
    │   ├── ArticleCard.astro
    │   ├── Reveal.astro               # scroll-trigger wrapper (no JS pesante)
    │   ├── FAQ.tsx                    # accordion accessibile con Framer Motion
    │   ├── LeadForm.tsx               # form con stato locale + success state
    │   ├── ThemeToggle.tsx            # dark/light + system pref
    │   └── CookieBanner.tsx           # banner con persistenza localStorage
    └── pages/
        ├── index.astro
        ├── come-funziona.astro
        ├── registered-agent.astro
        ├── faq.astro
        ├── contatti.astro
        ├── grazie.astro                # noindex
        ├── 404.astro                   # noindex
        ├── disclaimer.astro
        ├── privacy-policy.astro
        ├── terms-of-use.astro
        ├── cookie-policy.astro
        ├── company-setup-florida/
        │   ├── index.astro
        │   ├── llc.astro
        │   ├── corporation.astro
        │   └── pacchetti.astro
        └── business-in-florida/
            ├── index.astro             # hub con filtri categoria
            └── [...slug].astro         # post template dinamico
```

## Installazione locale

Richiede **Node 18+** (consigliato 20 LTS).

```bash
cd site-v2
npm install
npm run dev          # http://localhost:4321
```

Build di produzione:

```bash
npm run build        # output statico in dist/
npm run preview      # serve dist/ in locale per verificarlo
```

## Placeholder da sostituire

Stessa lista della v1. Sostituire in `src/**` e nei file in `public/`:

| Placeholder | Note |
|---|---|
| `[NOME BRAND]` | Nome commerciale (anche in `Header.astro`, `Footer.astro`, og-default.svg) |
| `[DOMINIO]` | Aggiornare anche in `astro.config.mjs` → `site` |
| `[PARTNER FLORIDA]` | Nome partner USA |
| `[RAGIONE SOCIALE GESTORE]`, `[INDIRIZZO]`, `[SEDE]` | Dati societari |
| `[EMAIL]`, `[TELEFONO]`, `[INDIRIZZO IT]` | Recapiti |
| `[PREZZO BASE]`, `[PREZZO]`, `[VALUTA]` | Listino |
| `[N] giorni lavorativi`, `[DATA]` | Tempistiche e date policy |

Grep di controllo:

```bash
grep -r "\[NOME BRAND\]" src public --include="*.astro" --include="*.tsx" --include="*.ts" --include="*.md"
```

## Form contatti

`LeadForm.tsx` ora è in modalità demo (success state simulato dopo 700ms). Per la produzione collegare a:

- **Formspree / Basin / Web3Forms** — sostituire la `setTimeout` con `await fetch(endpoint, { method: 'POST', body: data })`.
- **HubSpot Forms** — embed code oppure `submitForm` via API.
- **Backend custom** — qualsiasi endpoint POST.

Il componente è già strutturato per gestire `idle | loading | success | error` con stati distinti.

## Dark mode

- Lo script `is:inline` in `Layout.astro` legge `localStorage.theme` (o `prefers-color-scheme`) **prima** del render per evitare flash.
- `ThemeToggle.tsx` aggiorna `localStorage` e la classe `dark` sul `<html>`.
- I cambi di sistema vengono captati via `matchMedia('change')` solo se l'utente non ha scelto manualmente.

## Deploy

### Netlify
1. Connetti il repo Git.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Aggiungi env `NODE_VERSION=20` se necessario.

### Vercel
1. `vercel --prod` dalla cartella `site-v2/`.
2. Vercel rileva Astro automaticamente.

### Cloudflare Pages
1. Framework preset: **Astro**
2. Build command: `npm run build`
3. Output directory: `dist`

### IIS / Apache / Nginx
Copia il contenuto di `dist/` nella document root. Niente runtime Node richiesto.

## Performance

L'output Astro è quasi tutto HTML statico. JS spedito al client solo per:
- `ThemeToggle` (load) — ~3 KB
- `CookieBanner` (idle) — ~5 KB con motion
- `FAQ` (visible) — caricato solo se l'utente scrolla fino a quel punto
- `LeadForm` (load, solo su `/contatti/`) — ~6 KB

Target Lighthouse: **Performance ≥ 95**, **Accessibility ≥ 95**, **SEO 100**.

## Checklist pre-go-live

- [ ] Sostituire tutti i placeholder.
- [ ] Aggiornare `site:` in `astro.config.mjs`.
- [ ] Aggiungere OG image custom (oltre a `og-default.svg`).
- [ ] Collegare il form a un endpoint reale.
- [ ] Sostituire il cookie banner placeholder con un **CMP certificato** (iubenda, Cookiebot, OneTrust) con Google Consent Mode v2.
- [ ] Inserire JSON-LD `Organization`, `Service`, `FAQPage`, `BreadcrumbList`, `Article`.
- [ ] Far rivedere i testi legali da un avvocato italiano.
- [ ] Verificare firma SCC con [PARTNER FLORIDA] per trasferimento dati extra-UE.
- [ ] Verificare separazione di brand rispetto al Codice Deontologico Forense (se il gestore è collegato a uno studio).

## Migrazione dalla v1

La v1 statica (`/site/`) può rimanere come fallback su un sottodominio o essere archiviata. Le URL della v2 differiscono leggermente:

| v1 | v2 |
|---|---|
| `/come-funziona.html` | `/come-funziona/` |
| `/business-in-florida/articolo-llc-caratteristiche.html` | `/business-in-florida/llc-caratteristiche/` |

Se hai indicizzato la v1 in produzione, configurare 301 redirect dalle URL `.html` ai trailing slash della v2 in `public/_redirects` (Netlify) o `vercel.json` (Vercel).

## Aggiungere un articolo al blog

1. Crea `src/content/blog/mio-articolo.md` con frontmatter:

```yaml
---
title: "Titolo dell'articolo"
description: "Meta description SEO."
category: "LLC"          # LLC | Corporation | Registered Agent | Documenti | Tips | News
publishedAt: 2026-06-01
readingTime: "5 min"
gradient: "linear-gradient(135deg, rgb(8 13 27), rgb(168 90 45))"
---

Corpo dell'articolo in markdown.
```

2. L'articolo apparirà automaticamente in `/business-in-florida/` e sarà accessibile a `/business-in-florida/mio-articolo/`. La sitemap si aggiorna in fase di build.
