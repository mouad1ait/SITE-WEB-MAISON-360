# MAISON 360 — Site & Produit Digital

> Studio créatif premium · Podcast · Photo · Stylisme
> Villabé (91) · Ouverture juillet 2026

---

## Contenu de ce dépôt

### Pages HTML (prototype haute-fidélité, exécutable dans un navigateur)
- `index.html` — Accueil flagship
- `studio.html` — Présentation des 3 espaces
- `tarifs.html` — Tarifs, configurateur dynamique, FAQ
- `reservation.html` — Funnel de réservation en 5 étapes (wizard)
- `galerie.html` — Portfolio avec filtres et lightbox

### Design system
- `assets/css/styles.css` — Tokens, typographie, composants, animations
- `assets/js/main.js` — Loader, smooth scroll, cursor custom, reveals, magnetic CTAs, wizard, calendrier, particules hero

### Documentation produit & technique
- `ARCHITECTURE.md` — Direction artistique, stack, modèle de données, parcours réservation, performance
- `docs/BACKOFFICE.md` — Spécification complète du back-office admin
- `docs/EMAILS_SEO.md` — Catalogue des emails transactionnels + stratégie SEO et plan éditorial

### Cahier des charges initial
- `maison360_cdc_.docx`

---

## Direction artistique en bref

- Palette : Noir Onyx · Or Châtain · Ivoire · Sable
- Typographie : *Fraunces* (display), *Inter Tight* (sans), *JetBrains Mono* (accent)
- Codes : éditorial cinématographique, asymétrique, grain léger, animations chorégraphiées
- Inspirations : magazines de mode haut de gamme, studios milanais, sites primés Awwwards

---

## Stack technique (recommandée pour la phase production)

| Couche | Solution |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| UI | Tailwind v4 + design tokens custom |
| Animations | GSAP 3 · Lenis · Framer Motion |
| 3D ponctuelle | React Three Fiber + Drei |
| CMS | Sanity v3 (studio embarqué) |
| BDD | PostgreSQL (Neon) + Prisma |
| Auth | Clerk |
| Paiement | Stripe (PaymentIntent acompte + SetupIntent solde + Subscriptions) |
| Email | Resend + React Email |
| Stockage rushs | Cloudflare R2 (URLs signées) |
| Email automation | Inngest / Vercel Cron |
| Analytics | Vercel Analytics + PostHog |
| Hébergement | Vercel Edge |

Voir `ARCHITECTURE.md` pour le détail.

---

## Parcours de réservation

5 étapes en wizard, transitions horizontales, récap sticky :

1. **Discipline** — Podcast / Photo / Stylisme
2. **Espace & créneau** — calendrier temps réel, slots horaires, hold 10 min
3. **Options** — rushs J+24/48/72h, reels, miniatures, montage, opérateur, téléprompteur, HMC, catering
4. **Identité & acompte** — Clerk magic link, Stripe acompte 30 % + SetupIntent solde
5. **Confirmation** — ticket digital, email, .ics

Politique d'annulation automatisée :
- +72h : remboursement total
- 48-72h : acompte conservé
- -48h : totalité prélevée
- No-show : caution 150 €

---

## Performance — Objectifs cibles

- LCP < 1.5 s
- INP < 100 ms
- CLS < 0.05
- Lighthouse Performance > 95
- WCAG 2.2 AA
- 100 % RGPD compliant (hébergement EU, DPA signés)

---

## Comment visualiser le prototype

Ouvrir directement `index.html` dans un navigateur moderne (Chrome, Safari, Firefox).
Aucune dépendance build, tout est CDN (Lenis, GSAP, Google Fonts).

Pour passer en production :
1. Initialiser un projet Next.js 15 avec TypeScript
2. Migrer les pages HTML vers des composants React (App Router)
3. Brancher Sanity pour le contenu éditorial
4. Brancher Prisma + Postgres pour les réservations
5. Brancher Stripe (clés sandbox puis prod)
6. Brancher Clerk pour l'auth client + admin
7. Déployer sur Vercel avec ISR

---

## Organisation projet recommandée

| Phase | Durée | Livrables |
|---|---|---|
| 0 · Foundations | 2 sem | Design system, identité, hosting, Stripe sandbox |
| 1 · Marketing site | 3 sem | Accueil, Studio, Tarifs, Galerie, Blog, Contact, SEO |
| 2 · Booking engine | 4 sem | Funnel, Stripe deposit+balance, emails, Sanity |
| 3 · Espace client & Admin | 3 sem | Dashboard, Rush Library, back-office complet |
| 4 · Polish & Performance | 2 sem | AAA web vitals, audit a11y, QA |
| 5 · Soft launch | Juin 2026 | Early access + pré-réservations |
| 6 · Ouverture | Juillet 2026 | Lancement officiel |

---

*Conçu pour MAISON 360 · Mai 2026*
