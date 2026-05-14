# MAISON 360 — Architecture & Direction Produit

> Studio créatif premium · Villabé (91) · Ouverture Juillet 2026
> Podcast · Photo · Stylisme

---

## 1. Vision Produit

MAISON 360 n'est pas un site vitrine. C'est un **produit digital éditorial** dont la mission est triple :

1. **Séduire** en moins de 4 secondes par une direction artistique cinématographique.
2. **Convertir** un visiteur exigeant en réservation payée en moins de 90 secondes.
3. **Fidéliser** par un espace client qui ressemble à une conciergerie privée.

Le site doit dégager la même impression qu'une suite d'hôtel cinq étoiles : silence, matières, lumière chaude, exclusivité.

---

## 2. Direction Artistique

### 2.1 Palette
- **Noir Onyx** `#0A0908` — fond principal, immersion cinématographique
- **Anthracite** `#161513` — surfaces, cartes, élévations
- **Or Châtain** `#C9A961` — accent rare, lignes, micro‑interactions
- **Or Patiné** `#8A7340` — variations hover
- **Ivoire** `#F4EFE6` — texte principal sur fond sombre
- **Sable** `#D9CFBE` — texte secondaire éditorial
- **Cendre** `#3A372F` — séparateurs, hairlines

### 2.2 Typographie
- **Display Serif** : *Fraunces* (variable, axe `SOFT` & `WONK`) — titres éditoriaux, manchettes
- **Sans-Serif** : *Inter Tight* — corps, UI, micro‑copie
- **Mono** : *JetBrains Mono* — index, numéros de section, time codes

Échelle modulaire (ratio 1.333) :
`12 · 14 · 16 · 21 · 28 · 37 · 49 · 65 · 87 · 116 · 154 px`

### 2.3 Grille & Espacements
- Grille 12 colonnes desktop, gouttière 24 px
- Marges latérales : `clamp(20px, 5vw, 80px)`
- Sections : `clamp(80px, 12vw, 200px)` vertical padding
- Composition asymétrique éditoriale — pas de centrage systématique

### 2.4 Iconographie & Filets
- Filets `1px` ivoire 8 % d'opacité
- Pas d'icônes décoratives ; signes typographiques (`—`, `·`, `↗`, `⌖`) à la place
- Numérotation de sections en mono : `01 / 04 — STUDIO`

### 2.5 Imagerie
- Photographie cinématographique grain léger
- Étalonnage chaud, ombres profondes
- Ratios privilégiés : 4:5, 3:4, 16:9, 21:9
- Vidéos hero : 10–15 s loop, h.265, < 2 MB

---

## 3. Architecture Technique

### 3.1 Stack retenue

| Couche | Choix | Justification |
|---|---|---|
| Framework | **Next.js 15 App Router** | SSR/ISR, edge runtime, SEO impeccable, route handlers natifs |
| Langage | **TypeScript strict** | Sécurité d'API à grande échelle |
| UI | **Tailwind v4 + CSS variables** | Vélocité + design system custom |
| Animations | **GSAP 3 + Lenis + Framer Motion** | GSAP = chorégraphies complexes, Lenis = smooth scroll natif, Framer = UI déclaratif |
| 3D / Canvas | **React Three Fiber + Drei** | Hero, transitions, particules subtiles |
| State | **Zustand** | Léger, parfait pour le panier réservation |
| CMS | **Sanity Studio v3** | Studio embarqué, real-time, GROQ, parfait pour images |
| BDD | **PostgreSQL (Neon)** + **Prisma** | Serverless, branching, type-safe |
| Auth | **Clerk** | Magic link, OTP SMS, espace client clé en main |
| Paiement | **Stripe** (Payment Intents + SetupIntents) | Acompte + débit différé + abonnements |
| Email transactionnel | **Resend** + **React Email** | Templates en JSX, deliverability AAA |
| Fichiers (rush library) | **Cloudflare R2** + URLs signées | Pas de coûts de sortie, sécurité forte |
| Recherche | **Algolia** (blog + portfolio) | Optionnel phase 2 |
| Analytics | **Vercel Analytics** + **PostHog** | Web vitals + funnel produit |
| Monitoring | **Sentry** | Erreurs front + back |
| Hébergement | **Vercel Edge Network** | CDN global, ISR, image optimisation |
| Calendrier interne | **react-day-picker** + logique custom | Slots, blackout, abonnements |

### 3.2 Arborescence applicative

```
/app
  /(marketing)
    /page.tsx                    → Accueil
    /studio/page.tsx             → Le Studio
    /tarifs/page.tsx             → Tarifs & formules
    /galerie/page.tsx            → Portfolio
    /galerie/[slug]/page.tsx     → Projet détail
    /blog/page.tsx               → Blog index
    /blog/[slug]/page.tsx        → Article
    /contact/page.tsx
  /(booking)
    /reserver/page.tsx           → Funnel réservation (wizard)
    /reserver/confirmation/[id]/page.tsx
  /(account)
    /compte/page.tsx             → Dashboard client
    /compte/reservations/page.tsx
    /compte/factures/page.tsx
    /compte/abonnement/page.tsx
    /compte/rushs/page.tsx       → Rush Library
    /compte/profil/page.tsx
  /(admin)
    /admin/page.tsx              → Back-office
    /admin/planning/page.tsx
    /admin/clients/page.tsx
    /admin/reservations/page.tsx
    /admin/cms/[[...slug]]/page.tsx → Sanity Studio embarqué
  /api
    /booking/route.ts            → POST création + Stripe PI
    /webhooks/stripe/route.ts
    /rushs/upload/route.ts
    /cron/charge-balance/route.ts → Job quotidien -48h
    /cron/expire-rushs/route.ts
/components
  /ui                  → primitives (Button, Field, Dialog)
  /sections            → blocs page (Hero, Manifesto, …)
  /booking             → étapes wizard
  /motion              → SplitText, Marquee, Reveal, Magnetic
/lib
  /db.ts               → Prisma
  /stripe.ts
  /sanity.ts
  /resend.ts
  /pricing.ts          → moteur tarifaire
  /availability.ts     → disponibilités
/emails                → templates React Email
/prisma/schema.prisma
/sanity                → schémas CMS
```

### 3.3 Modèle de données (extrait Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  clerkId       String   @unique
  email         String   @unique
  firstName     String?
  lastName      String?
  phone         String?
  company       String?
  stripeId      String?  @unique
  subscription  Subscription?
  bookings      Booking[]
  rushs         RushAsset[]
  createdAt     DateTime @default(now())
}

model Space {
  id          String  @id @default(cuid())
  slug        String  @unique
  name        String           // "Studio Podcast", "Studio Photo", "Plateau Stylisme"
  hourlyRate  Int              // en centimes
  capacity    Int
  amenities   Json
  cover       String
  gallery     String[]
}

model Booking {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  spaceId         String
  space           Space         @relation(fields: [spaceId], references: [id])
  startAt         DateTime
  endAt           DateTime
  status          BookingStatus // HELD, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
  options         BookingOption[]
  subtotal        Int
  total           Int
  depositAmount   Int           // 30 %
  balanceAmount   Int
  stripePiId      String?       // acompte
  stripeSetupId   String?       // pour débit auto
  paidDeposit     DateTime?
  paidBalance     DateTime?
  cancelledAt     DateTime?
  refundCents     Int           @default(0)
  rushs           RushAsset[]
  notes           String?
  createdAt       DateTime      @default(now())
}

model BookingOption {
  id         String   @id @default(cuid())
  bookingId  String
  booking    Booking  @relation(fields: [bookingId], references: [id])
  key        String   // "rush_24h", "reels", "miniatures", "montage", "operator", "teleprompter"
  label      String
  unitPrice  Int
  quantity   Int
}

model Subscription {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
  tier         String   // SIGNATURE, MAISON
  stripeSubId  String   @unique
  currentEnd   DateTime
  hoursIncluded Int
  hoursUsed    Int      @default(0)
  status       String
}

model RushAsset {
  id          String   @id @default(cuid())
  bookingId   String
  booking     Booking  @relation(fields: [bookingId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  r2Key       String
  filename    String
  sizeBytes   BigInt
  mime        String
  expiresAt   DateTime
  downloads   Int      @default(0)
  createdAt   DateTime @default(now())
}

enum BookingStatus {
  HELD CONFIRMED COMPLETED CANCELLED NO_SHOW
}
```

---

## 4. Parcours de Réservation (le cœur)

Funnel en **wizard 5 étapes** sur une seule page persistante (`/reserver`), animée en transitions horizontales façon Stripe Checkout, avec récapitulatif latéral sticky toujours visible.

### Étape 1 — Discipline
Trois grandes cartes immersives plein écran (Podcast / Photo / Stylisme). Choix instantané, animation curtain.

### Étape 2 — Espace & Créneau
- Calendrier mensuel (Lenis-friendly, swipe mobile)
- Slots de 1 h, agrégation visuelle des plages disponibles
- Indicateurs : 🟢 disponible · ⚪ partiellement · ⚫ complet
- Live update via Supabase Realtime / pusher (channel `space:{id}`)
- Hold temporaire de **10 minutes** sur les slots sélectionnés (BookingStatus = HELD)

### Étape 3 — Options dynamiques
Options en cartes toggle avec prix temps réel :
- Rushs J+24 h · J+48 h · J+72 h
- Reels (×1, ×3, ×5)
- Miniatures (×1, ×3)
- Montage podcast / vidéo
- Opérateur dédié
- Téléprompteur
- HMC (hair · make-up · coiffure)
- Catering premium

Sidebar récap mise à jour fluide (numéros qui s'incrémentent).

### Étape 4 — Identité & Acompte
- Identité (auth Clerk magic link en 1 clic)
- Stripe Element pour le **Payment Intent acompte (30 %)**
- **SetupIntent** simultané pour autoriser le solde (futur off-session)
- Validation CGV avec timestamp
- Toggle "Réserver pour mon entreprise" → champs SIRET

### Étape 5 — Confirmation
- Animation gold-line, voiceover optionnel, ticket digital
- Ajout calendrier (.ics)
- Email de confirmation immédiat (Resend)
- SMS d'avant‑session J‑1 (Twilio)

### Politique d'annulation automatisée
Cron quotidien `charge-balance` :
- `T-72 h` : email rappel
- `T-48 h` : **off-session charge** du solde via SetupIntent stocké
- Annulation client `> 72 h` : remboursement total (refund Stripe)
- Annulation `48 h – 72 h` : acompte conservé
- Annulation `< 48 h` : solde prélevé, aucun remboursement
- No-show : caution `150 €` débitée (manuel admin ou auto J+1)

---

## 5. Espace Client

Dashboard sobre, type private banking app.

| Module | Contenu |
|---|---|
| Vue d'ensemble | Prochaine session, jauge abonnement (heures restantes), accès rapide rushs |
| Réservations | Historique, factures PDF, modifications |
| Rush Library | Téléchargement signé R2 (URLs expirantes 60 min), compteur de jours avant expiration |
| Abonnement | Tier en cours, prochaine facture, upgrade/downgrade |
| Profil | Coordonnées, mot de passe, préférences notifications |
| Notifications | Email, push web (PWA), SMS opt-in |

Rush Library : durée de conservation selon tier
- Découverte : **15 jours**
- Signature : **60 jours**
- Maison : **180 jours**

---

## 6. Back-Office Admin

Interface unique `/admin`, protégée par rôle (Clerk roles).

- **Dashboard** : revenu mois, taux d'occupation, taux de conversion funnel
- **Planning** : vue jour/semaine/mois, drag & drop, blocage de slots, créneaux récurrents
- **Réservations** : table filtrable, edit, refund partiel, marquer no-show
- **Clients** : fiche 360, LTV, notes internes
- **Abonnements** : Stripe sync, prorations
- **CMS** : Sanity Studio embarqué (galerie, blog, formules, page studio)
- **Tarifs** : éditeur grille tarifaire avec versioning
- **Options** : CRUD options dynamiques
- **Rushs** : upload multi-fichiers drag & drop → R2, attribution booking
- **Statistiques** : graphiques Recharts (revenu, occupation, NPS)
- **Exports** : CSV/XLSX (compta, RGPD)

---

## 7. SEO & Performance

### 7.1 SEO
- Rendu SSG + ISR (revalidation 60 s pour blog/galerie)
- Sitemap dynamique `sitemap.xml`
- `robots.txt`
- JSON-LD : `LocalBusiness`, `Service`, `BreadcrumbList`, `Article`, `FAQPage`, `Event` (ouverture juillet 2026)
- Open Graph + Twitter Cards générées par `next/og` (image dynamique sur fond noir avec logo or)
- Hreflang FR (extensible EN)
- Slugs propres, URLs canoniques
- Articles blog ciblés mots-clés : *studio podcast Paris*, *studio photo Essonne*, *location plateau stylisme Île-de-France*…

### 7.2 Performance — Core Web Vitals AAA
- LCP < 1.5 s : hero `priority` + `placeholder="blur"`, vidéo `preload="metadata"`
- INP < 100 ms : Lenis lazy, GSAP `force3D`, événements passifs
- CLS < 0.05 : aspect-ratio sur toute image, fonts `font-display: swap` + sublocaux
- Images : Next/Image AVIF/WebP, srcset, lazy
- Code splitting par route, dynamic imports pour wizard & 3D
- `next/font` Fraunces + Inter Tight (subset latin)
- Edge runtime sur API publiques
- Preload des routes critiques au hover (`router.prefetch`)
- Service Worker (Workbox) — cache statique + offline page

### 7.3 Accessibilité
- WCAG 2.2 AA
- Contraste Ivoire/Onyx : 14.5:1 (AAA)
- `prefers-reduced-motion` désactive les animations lourdes
- Focus rings or 2 px
- Navigation clavier complète (wizard, calendrier)
- Aria live regions sur récap réservation

### 7.4 RGPD
- Consentement granulaire (Didomi/custom)
- Pas de tracking avant consentement
- DPA Stripe, Resend, Sanity, Vercel, Cloudflare
- Registre des traitements documenté
- Endpoint `/api/me/export` et `/api/me/delete`

---

## 8. Automatisations Email (Resend + React Email)

| Trigger | Template | Délai |
|---|---|---|
| Réservation créée | `booking-confirmation` | Immédiat |
| J-3 | `booking-reminder-3d` | 09:00 |
| J-1 | `booking-reminder-1d` | 18:00 (+ SMS) |
| Solde prélevé (T-48 h) | `balance-charged` | Immédiat |
| Échec prélèvement | `payment-failed` | Immédiat + retry J+1 |
| Rushs disponibles | `rushs-ready` | Upload admin |
| Rushs expiration J-3 | `rushs-expire-soon` | Cron |
| Annulation | `booking-cancelled` | Immédiat |
| Anniversaire abonnement | `subscription-renewal` | J-7 |
| Onboarding nouveau client | `welcome-series` (3 mails) | J0, J+3, J+10 |
| Inactif 60 jours | `comeback-offer` | Cron |

Tous les templates : fond `#0A0908`, accent `#C9A961`, logo SVG inline, version texte fallback.

---

## 9. Composants Premium (sélection)

- **MagneticCTA** — bouton qui suit le curseur dans un rayon de 80 px avec spring
- **SplitTextReveal** — lettres masquées qui se révèlent ligne par ligne au scroll (GSAP SplitText)
- **CursorAura** — curseur custom avec halo or qui réagit aux éléments interactifs
- **EditorialMarquee** — bandeau défilant infini noir/or
- **ParallaxImage** — image avec ratio et parallax `y` sur scroll
- **CinematicGrain** — overlay SVG `feTurbulence` animé
- **HorizontalScrollSection** — sections scroll horizontal façon AWWWARDS
- **PageTransition** — rideau noir + or qui balaie verticalement entre routes
- **Counter** — chiffres animés CountUp au viewport
- **Lightbox** — galerie clic immersif fullscreen avec drag-snap
- **Wizard** — étapes avec progress mono, FLIP animations entre étapes
- **PricingCard** — carte 3 tiers avec hover hairline doré
- **AvailabilityCalendar** — calendrier custom avec heatmap disponibilité

---

## 10. Micro-Interactions Premium

- Hover sur lien : underline qui se trace de gauche à droite en 240 ms (`cubic-bezier(.7,0,.3,1)`)
- Hover sur image : zoom in 1.04 + filtre saturation 0.9 → 1
- Hover sur CTA : magnetic + ligne or qui balaie le fond
- Click : burst de particules or 6 éléments
- Scroll : indicateur de progression vertical hairline or fixe à droite
- Loader initial : nom "MAISON 360" qui s'écrit en typo display + ligne or qui se trace
- Page sortie : rideau noir top→bottom 500 ms
- Numéros de section qui s'incrémentent au sticky (Intersection Observer)
- Form fields : label flottant + ligne or qui se trace au focus
- Calendrier : sélection date avec halo doré qui pulse
- Toast notifications : slide depuis top, fond anthracite, bordure or 1 px

---

## 11. Mobile-First & Responsive

- Breakpoints : `sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1536`
- Hero : full vh, typo 12 vw → 7 rem cap
- Navigation mobile : menu fullscreen avec items grand format, transition curtain
- Wizard mobile : étapes en swipe horizontal avec snap, indicateur de progression sticky
- Calendrier : compactage en colonne, slots en sheet bottom (modal)
- Galerie : grille 1 col mobile, 2 tablette, 3-4 desktop avec masonry
- Boutons : 48 px min tap target
- Évite le hover-only, tout en click/tap

---

## 12. KPIs Produit à Suivre

- **Conversion funnel** étape par étape (PostHog)
- **Time-to-book** médian (objectif < 90 s)
- **CAC, LTV, churn** abonnements
- **Taux d'occupation** par espace
- **NPS** post-session (email J+3)
- **Web Vitals** par route (Vercel Analytics)
- **Taux de no-show** & taux d'application de la politique d'annulation
- **Référencement** : positions cibles (Search Console + Ahrefs)

---

## 13. Roadmap de Livraison

**Phase 0 — Foundations (semaines 1-2)**
Design system, composants base, identité, hosting, Stripe sandbox.

**Phase 1 — Marketing site (semaines 3-5)**
Accueil, Studio, Tarifs, Galerie, Blog, Contact. SEO baseline.

**Phase 2 — Booking engine (semaines 6-9)**
Funnel, Stripe deposit + balance, emails, calendrier, Sanity.

**Phase 3 — Espace client & Admin (semaines 10-12)**
Dashboard, Rush Library, back-office complet.

**Phase 4 — Polish & Performance (semaines 13-14)**
Animations finales, AAA web vitals, audit accessibilité, QA cross-device.

**Phase 5 — Soft launch (juin 2026)**
Pré-réservations early access, ouverture officielle juillet 2026.

---

*Document de référence — MAISON 360 · v1.0 · Mai 2026*
