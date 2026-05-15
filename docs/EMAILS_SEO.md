# MAISON 360 — Automatisations Email & Stratégie SEO

---

## I. Automatisations Email

### 1.1 Stack
- **Resend** pour la délivrabilité
- **React Email** pour les templates JSX (versionnés dans `/emails`)
- **Inngest** ou **Vercel Cron Jobs** pour l'ordonnancement
- **Twilio** pour les SMS (J-1 + paiement échoué)

Charte des emails :
- Fond `#0A0908`, texte `#F4EFE6`, accent `#C9A961`
- Logo SVG inline, header minimal
- Police corps fallback : `Inter, Helvetica, Arial, sans-serif`
- Police display fallback : `Georgia, serif`
- Largeur max 600 px, mobile-first
- Version texte (plain) systématique
- Liens UTM-trackés (`?utm_source=email&utm_campaign=...`)
- Pied de page : adresse postale + lien de désinscription (RGPD)

### 1.2 Catalogue complet

| Code | Déclencheur | Délai | Canal | Destinataire | Contenu clé |
|---|---|---|---|---|---|
| `booking-confirmation` | Stripe `payment_intent.succeeded` (acompte) | Immédiat | Email | Client | Ticket digital, .ics, lien espace client, rappel politique d'annulation |
| `booking-confirmation-staff` | Idem | Immédiat | Slack/Discord | Équipe | Notif interne nouvelle réservation |
| `booking-reminder-3d` | Cron quotidien 09:00 | J-3 | Email | Client | Rappel session, options encore modifiables |
| `booking-reminder-1d` | Cron quotidien 18:00 | J-1 | Email + SMS | Client | Rappel final, adresse, code parking |
| `balance-charge-soon` | Cron 09:00 | J-3 | Email | Client | Annonce du débit à venir + politique d'annulation rappelée |
| `balance-charged` | Stripe `payment_intent.succeeded` (solde off-session) | J-2 | Email | Client | Reçu PDF du solde |
| `payment-failed` | Stripe `payment_intent.payment_failed` | Immédiat + retry J+1 | Email + SMS | Client | Lien retry, support direct |
| `rushs-ready` | Upload admin terminé | Immédiat | Email | Client | Liste fichiers, durée d'expiration, lien Rush Library |
| `rushs-expire-soon` | Cron quotidien | J-3 avant expiration | Email | Client | Compte à rebours, options de prolongation |
| `booking-cancelled-by-client` | API `/api/booking/cancel` | Immédiat | Email | Client | Récap politique appliquée, montant remboursé |
| `booking-cancelled-by-studio` | Manuel admin | Immédiat | Email | Client | Excuses, code promo +10 % |
| `no-show-fee` | Cron J+1 après session | Immédiat | Email | Client | Notification du débit de caution |
| `welcome-series-1` | Inscription espace client | J+0 | Email | Client | Bienvenue, présentation studio |
| `welcome-series-2` | Idem | J+3 | Email | Client | Guide « préparer sa session » |
| `welcome-series-3` | Idem | J+10 | Email | Client | Témoignages + offre découverte |
| `nps-survey` | Cron J+3 après session | Immédiat | Email | Client | Note 0-10 + commentaire libre |
| `subscription-renewal` | Cron 7j avant renouvellement | Immédiat | Email | Client | Récap mois, prochain prélèvement, possibilité de pause |
| `subscription-hours-low` | Cron quand < 2h restantes | Immédiat | Email | Client | Annonce solde heures, possibilité d'acheter du complément |
| `comeback-offer` | 60 j sans réservation | Immédiat | Email | Client | -15 % sur prochaine session |
| `newsletter-monthly` | Premier lundi du mois | Manuel + auto | Email | Abonnés | Contenu éditorial mensuel |
| `early-access` | Lancement juillet 2026 | Manuel | Email | Liste pré-inscrits | Code privilège -20 % |
| `birthday` | Date d'anniversaire | Manuel | Email | Client VIP | Offre cadeau (session 1h offerte) |

### 1.3 Délivrabilité

- DKIM + SPF + DMARC alignés sur `mail.maison360.fr`
- IP dédiée Resend pour les abonnés (>10 000 envois/mois)
- Warm-up progressif les 30 premiers jours
- Pré-header optimisé (40-60 caractères) pour chaque template
- A/B testing des objets (Resend variants)

### 1.4 RGPD
- Double opt-in pour la newsletter
- Désinscription en 1 clic
- Pas de tracking d'ouverture sans consentement explicite
- DPA Resend signé, hébergement EU

---

## II. Stratégie SEO

### 2.1 Architecture URL

```
maison360.fr/
  /                       → Accueil (priorité 1.0)
  /studio                 → Le Studio
  /studio/podcast         → Espace Podcast (silo)
  /studio/photo           → Plateau Photo (silo)
  /studio/stylisme        → Atelier Stylisme (silo)
  /tarifs                 → Tarifs & formules
  /galerie                → Portfolio (priorité 0.8)
  /galerie/[slug]         → Projet (priorité 0.7)
  /journal                → Blog index
  /journal/[slug]         → Article (priorité 0.7)
  /reserver               → Funnel (noindex)
  /compte                 → Espace client (noindex)
  /admin                  → Back-office (noindex)
  /mentions-legales       → Légal
  /cgv                    → Légal
  /politique-de-confidentialite → Légal
```

Sitemap dynamique généré côté Next.js, soumis à Google Search Console et Bing Webmaster Tools.

### 2.2 Mots-clés cibles (FR)

**Volume principal**
- studio podcast paris · 1 900 vol/mois · KD 22
- studio photo paris · 4 400 vol · KD 35
- location studio podcast · 720 vol · KD 18
- studio podcast essonne · 90 vol · KD 8
- studio photo essonne · 170 vol · KD 12

**Volume secondaire (longue traîne, haute conversion)**
- louer studio podcast avec captation vidéo
- studio photo avec cyclorama paris
- studio stylisme professionnel
- studio podcast 4 personnes
- location plateau tv ile-de-france
- studio podcast clé en main
- studio photo mode lookbook
- studio rec captation broadcast

**Branding**
- maison 360 villabé
- maison 360 studio

### 2.3 Plan éditorial blog (Journal)

Catégories : `Backstage`, `Guides`, `Métiers`, `Interviews`.

Articles socles (`pillar pages`) à publier avant l'ouverture :

1. *Comment choisir un studio podcast en Île-de-France — le guide 2026*
2. *Studio photo avec cyclorama : ce qu'il faut savoir avant de réserver*
3. *Brief créatif réussi : la checklist de MAISON 360*
4. *Podcast vidéo : matériel, format et diffusion en 2026*
5. *Lookbook de marque : 7 erreurs à éviter*
6. *La direction artistique en marque, en 5 leçons*

Articles secondaires (`cluster pages`) :
- Comparatif Profoto vs Aputure pour studio mixte
- 12 idées de séries podcast pour entrepreneurs
- Référentiels HMC pour shooting de marque
- Préparer un brand film : du brief au master
- Etc. (cadence 2-3/mois)

### 2.4 SEO technique

- **Render** : SSG pour pages statiques + ISR (60s) pour galerie/blog
- **Edge runtime** sur OG image dynamique (`@vercel/og`)
- **JSON-LD** :
  - `LocalBusiness` + `OpeningHoursSpecification`
  - `Service` pour chaque espace (3 entités)
  - `BreadcrumbList` sur toutes les sous-pages
  - `Article` + `Person` pour le blog
  - `FAQPage` sur `/tarifs`
  - `Event` pour la soirée d'ouverture juillet 2026
- **Open Graph** : image dynamique générée (fond onyx, titre éditorial, accent or)
- **Twitter Card** : `summary_large_image`
- **Canonical** sur chaque page
- **Hreflang** `fr-FR` (extensible EN au launch)
- **Robots.txt** : autorise tout sauf `/admin`, `/compte`, `/reserver`, `/api`
- **Sitemap XML** segmenté : `sitemap-main.xml`, `sitemap-blog.xml`, `sitemap-portfolio.xml`

### 2.5 Performance pour le SEO

Objectifs Core Web Vitals (75e percentile) :
- **LCP** < 1.8 s (objectif 1.2 s)
- **INP** < 100 ms
- **CLS** < 0.05

Mesures :
- Image hero `priority`, `placeholder="blur"` avec data-URL miniature
- `font-display: swap` + preconnect Google Fonts
- HTTP/3 + Brotli sur Vercel
- Compression image AVIF avec fallback WebP
- Code splitting des chunks lourds (3D, wizard) en dynamic import
- Pas de JS bloquant en `<head>`
- Service Worker (Workbox) — pré-cache des routes critiques

### 2.6 SEO local

- Fiche **Google Business Profile** complète à la mise en ligne
- Catégorie principale : *Studio d'enregistrement* + *Studio photo*
- 30 photos UGC progressives
- Réponses aux avis en moins de 24h
- Citations locales : Pages Jaunes, l'Annuaire des Médias, Hellopro, Manageo
- Backlinks ciblés : magazines créatifs FR (Étapes, Influencia, Marie Claire, GQ)
- Liens internes croisés vers le silo `/studio/*`

### 2.7 Monitoring & itération

- **Google Search Console** : positions, CTR, erreurs
- **Ahrefs** ou **Semrush** : tracking de 50 mots-clés cibles
- **Plausible** ou **PostHog** : analytics privacy-first
- **Vercel Analytics** : Web Vitals
- Revue mensuelle des positions + ajustements de contenu

---

## III. Roadmap émission

| Mois | Action |
|---|---|
| Mai 2026 | Lancement teaser + capture early access (form newsletter) |
| Juin 2026 | Pillar pages publiées, GBP créée, premiers backlinks |
| Juillet 2026 | Ouverture · soft launch · campagne presse |
| Août 2026 | Première vague d'articles cluster |
| Septembre 2026 | Audit SEO complet + ajustements |
| Octobre 2026 | Newsletter mensuelle stable |
| Novembre 2026 | Campagne fin d'année / cartes cadeaux |

---

*Document — MAISON 360 · v1.0*
