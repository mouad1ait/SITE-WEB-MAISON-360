# MAISON 360 — Back-Office Admin

Interface unifiée `/admin`, accessible aux rôles `ADMIN` et `MANAGER` via Clerk. Pas de second outil : tout passe par cette console.

---

## 1. Sécurité d'accès

- Authentification Clerk obligatoire (magic link + 2FA TOTP)
- Rôles : `ADMIN` (tous droits), `MANAGER` (planning, clients, CMS), `STAFF` (planning lecture, upload rushs)
- IP allowlist optionnelle (admin uniquement) en environnement production
- Toutes les actions sensibles (refund, modification client, suppression rush) génèrent un évènement dans la table `AuditLog`
- Session courte (4h), refresh automatique tant que la fenêtre est active

---

## 2. Dashboard d'accueil — `/admin`

Vue synthèse temps réel :

- **Revenu mois en cours** vs mois précédent (graphique Recharts area)
- **Réservations 7 prochains jours** (timeline horizontale)
- **Taux d'occupation par espace** (gauges)
- **Funnel de conversion** (Discipline → Créneau → Options → Identité → Paiement)
- **Top 5 clients du mois** (LTV cumulé)
- **Notifications opérationnelles** : prélèvements solde à valider, échecs Stripe, rushs en retard, demandes de devis Maison

---

## 3. Planning — `/admin/planning`

Vue calendrier multi-espaces (Podcast, Photo, Stylisme) en colonnes.

- Modes : Jour / Semaine / Mois (raccourcis `D`, `W`, `M`)
- Drag & drop pour déplacer une réservation (avec confirmation client par email auto)
- Click vide → créer une réservation manuelle (offline / téléphone)
- Click sur une réservation → drawer latéral avec détails complets
- Filtres : Espace, Statut, Client, Type (à la séance / abonnement)
- Bloquer un créneau (maintenance, événement interne) avec motif
- Créneaux récurrents (ex : jeudi 9h–18h bloqué tous les jeudis)

Drawer d'une réservation :
- Statut (`HELD`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`)
- Total / acompte / solde / refund
- Boutons : marquer comme `NO_SHOW`, prélever le solde manuellement, ajouter une note, contacter le client (template email rapide)
- Historique des évènements

---

## 4. Réservations — `/admin/reservations`

Table virtualisée (TanStack Table) avec :

- Tri colonnes (date, montant, statut, client)
- Filtres : période, espace, statut, formule
- Recherche full-text (email, nom, ID Stripe)
- Export CSV / XLSX du résultat filtré
- Actions en lot : email groupé, marquer comme `COMPLETED` (après-session)

Vue détail :
- Toutes les infos client
- Timeline du paiement (acompte → solde → éventuel refund)
- Lien direct vers la page Stripe correspondante
- Rushs liés (téléchargement admin)
- Notes internes (visibles uniquement par le staff)

Action **refund** :
- Modal de confirmation avec motif
- Choix montant total / partiel
- L'email d'annulation est envoyé automatiquement après confirmation

---

## 5. Clients — `/admin/clients`

Liste filtrable + fiche 360°.

Fiche client :
- Coordonnées (email, téléphone, société, SIRET)
- LTV cumulé, nombre de sessions, panier moyen
- Préférences (formule, espace favori, options récurrentes)
- Notes internes (allergies, plus d'1 caméra requise, etc.)
- Historique réservations
- Historique factures (PDF)
- Tag de segmentation (`VIP`, `Athlete`, `Brand`, `Agency`, etc.)

Actions :
- Créer une réservation pour ce client
- Émettre un avoir
- Bloquer le client (en cas de comportement problématique)
- Envoyer une invitation early-access manuelle

---

## 6. Abonnements — `/admin/abonnements`

Liste des abonnements actifs Stripe (Signature, Maison).

- Statut Stripe synchronisé en temps réel via webhook
- Prochain renouvellement
- Heures consommées du mois
- Bouton « ajuster manuellement » les heures (cas exceptionnel)
- Bouton « offrir un mois » (coupon Stripe automatique)
- Bouton « résilier » (cancel_at_period_end)

---

## 7. CMS (Sanity Studio embarqué) — `/admin/cms`

Sanity Studio v3 monté en route Next.js pour rester dans la même UI.

Schémas Sanity :
- **page** (hero, sections, SEO meta)
- **studioSpace** (podcast, photo, stylisme) — gallerie, specs, FAQ
- **formula** (Découverte, Signature, Maison) — prix, features, ordre
- **option** (rushs, reels, etc.) — clé technique, label, prix, catégorie
- **project** (galerie portfolio) — slug, catégorie, images, description, témoignage client lié
- **article** (blog) — slug, auteur, mots-clés SEO, lecture estimée, sections (texte, image, citation, vidéo)
- **testimonial** (témoignage indépendant)
- **teamMember** (page À propos)
- **legalPage** (CGV, mentions, politique de confidentialité)

Workflow : `Draft` → `Review` → `Published`. Webhook Sanity → Next.js ISR revalidation immédiate (`tag-based` revalidation).

---

## 8. Tarifs & Options — `/admin/tarifs`

Édition typée pour ne pas casser le moteur tarifaire :
- Taux horaire par espace (avec date d'effet)
- Versioning : toute modification crée une nouvelle révision `priceVersion`
- Options : CRUD complet, regroupements (Livraison, Production, Présence, Confort)
- Promotions ponctuelles (code promo Stripe sync)

---

## 9. Rush Library — `/admin/rushs`

Upload multi-fichiers drag & drop vers Cloudflare R2 (signature serveur).

- Sélection de la réservation cible
- Création de l'archive `.zip` côté serveur si > 10 fichiers (job en arrière-plan)
- Génération d'URL signée 60 min
- Email automatique au client (`rushs-ready`)
- Compteur de jours avant expiration affiché
- Bouton « prolonger la durée » (selon politique formule)

---

## 10. Statistiques — `/admin/stats`

- Revenu (mois, trimestre, année) par espace et par formule
- Taux d'occupation par jour de la semaine et par créneau horaire
- Conversion funnel détaillé (PostHog embed)
- Cohortes (analyse de rétention abonnements)
- NPS moyen et évolution (sondage post-session J+3)
- Top options par chiffre d'affaires
- Carte de chaleur des heures les plus réservées

Exports : PDF (A4, marque), XLSX brut.

---

## 11. Communication — `/admin/communication`

- Envoyer une campagne newsletter (templates React Email)
- Programmer un message SMS groupé (Twilio) à un segment (`abonnés actifs`, `prospects 90j`, etc.)
- Voir le journal des emails transactionnels (livré, ouvert, cliqué, bounce)
- Renvoyer manuellement un email (mots de passe, confirmation, etc.)

---

## 12. Paramètres — `/admin/parametres`

- Informations société (raison sociale, SIRET, TVA, RIB)
- Mentions légales sur factures
- Politique d'annulation (modification taux, durées)
- Branding (logo, OG image, couleur d'accent — variables CSS publiées globalement)
- Webhooks (Stripe, Sanity, Resend) avec test ping intégré
- Utilisateurs admin (invitation Clerk)
- Audit log (toutes les actions sensibles, exportable)

---

## 13. Notifications internes

Slack ou Discord webhook configurable :
- Nouvelle réservation > 1000 €
- Annulation tardive
- Échec de prélèvement solde
- Demande de devis Maison
- Nouveau client société (B2B)

---

## 14. Mode opérationnel jour J

Sur tablette/iPad, un mode **« Studio Day »** simplifié :
- Vue jour avec checklist par session
- Bouton « démarrer la session » (timestamp réel pour facturation au temps passé)
- Bouton « marquer comme terminée »
- Capture rapide de notes terrain (uploads photo terrain → R2)
- Sortie client : envoi automatique du lien de notation NPS J+3

---

*Document opérationnel — MAISON 360 · v1.0 · Mai 2026*
