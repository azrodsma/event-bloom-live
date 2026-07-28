# Plan — 4 chantiers restants

Objectif : brancher les derniers piliers organisateur/invités sur la base de données.

## 1. Cagnotte externe UI

- Nouveau composant `src/components/CagnotteCard.tsx` : affiche `cagnotte_url`, `cagnotte_goal`, `cagnotte_current` + barre de progression + CTA "Contribuer" (ouvre l'URL Leetchi/Lydia en `_blank`).
- Server fn `updateCagnotte` dans `src/lib/events.functions.ts` (auth + organisateur only, valide URL + montants Zod).
- Nouvelle route `src/routes/events.$slug.cagnotte.tsx` : formulaire d'édition organisateur (URL, objectif, montant courant) + preview de la carte publique.
- Intégration lecture : monter `CagnotteCard` sur `events.$slug.index.tsx` sous le hero et sur `events.$slug.live.tsx` (déjà partiellement présent, on unifie).

## 2. Création d'événement (`/app/create`)

- Câbler le tunnel existant : à la dernière étape, appel d'une server fn `createEvent` (auth requise).
- Server fn : insert `events` (owner_id = auth.uid, slug auto-généré unique, status='draft'/'upcoming', visibility choisie) puis insert `event_members` (role='owner').
- Slug : slugify du titre + suffixe court si collision.
- Redirect vers `/events/$slug` après succès + toast.
- Validation Zod (titre, type, date, visibility).

## 3. RSVP invités

- Nouvelle route publique `src/routes/rsvp.$slug.tsx` : page mobile-first avec cover event, formulaire (nom, email, statut confirmed/declined/maybe, +N, régime alimentaire, notes).
- Server fn `submitRsvp` (publique, non authentifiée) : upsert dans `guests` par (event_id, email). Rate-limit léger via validation Zod stricte.
- Policy RLS additionnelle : autoriser INSERT anon sur `guests` uniquement si event est `public` ou `unlisted` — migration nécessaire.
- Écran organisateur : `events.$slug.guests.tsx` existant → brancher listing réel + compteurs (confirmés/en attente/déclinés).

## 4. Invitations QR & partage

- Route `events.$slug.invite.tsx` existante : générer le QR à partir de l'URL RSVP réelle (`{origin}/rsvp/{slug}`).
- Remplacer la grille QR décorative par une vraie génération via `qrcode` (npm) rendu en SVG.
- Bouton "Copier le lien" fonctionnel, boutons WhatsApp/Email/SMS avec `mailto:`, `sms:`, `https://wa.me/?text=`.
- Stats live : compteur RSVP (server fn `getRsvpStats(slug)`).

## Détails techniques

- Migrations : 1 seule migration ajoutant policy INSERT anon sur `guests` (scoped par visibility) + éventuel index sur `guests(event_id, email)`.
- Dépendance npm : `qrcode` (+ `@types/qrcode`).
- Toutes les mutations passent par `useServerFn` + `useMutation` + `queryClient.invalidateQueries`.
- Lecture publique (event by slug, RSVP page) : server publishable client, pas d'auth requise.
- Lecture organisateur (stats, guests) : `requireSupabaseAuth`.

## Ordre d'implémentation

1. Migration RLS `guests` + install `qrcode`.
2. Server fns (`updateCagnotte`, `createEvent`, `submitRsvp`, `getRsvpStats`, guests listing).
3. Composants (`CagnotteCard`, QR SVG).
4. Routes (`cagnotte`, `rsvp.$slug`, refonte `create`, refonte `invite`, refonte `guests`).
5. Typecheck + smoke test navigation.
