# LIAM Groupe — site web

Site public et espace client de LIAM Groupe (Bangui), en **Next.js 16** (App Router, JavaScript,
Tailwind CSS 3). Tout le contenu vient de l'API Spring Boot
[`liam-groupe-api`](https://github.com/JEHUGABRIEL/liam-groupe-api) : plus de Supabase ni de
données en dur.

## Démarrer

```bash
cp .env.example .env.local     # API_URL=http://localhost:8000
npm install
npm run dev                    # http://localhost:3000
```

L'API doit tourner (`docker compose up -d && mvn spring-boot:run` dans `liam-groupe-api`).

## Pages

| Route | Contenu |
|---|---|
| `/` | Accueil : domaines, actualités, agenda, boutique, témoignages, partenaires |
| `/a-propos` | Histoire, vision, équipe |
| `/ogab` | Restaurant O'GAB : infos pratiques, carte, commande en ligne |
| `/g-fitness` | Salle G-Fitness : activités, planning, coachs, formules et abonnement |
| `/boutique`, `/boutique/[slug]` | Produits, ajout au panier |
| `/actualites`, `/actualites/[slug]` | Articles + agenda des événements |
| `/evenements/[slug]` | Détail d'un événement, inscription |
| `/miss-centrafrique` | Concours, candidature avec photos |
| `/domaines/[slug]` | Autres domaines (entrepreneuriat, formation, communication, événementiel) |
| `?auth=connexion` / `?auth=inscription` | Ouvre la modale de connexion / d'inscription sur n'importe quelle page (`/connexion` et `/inscription` y redirigent) |
| `/commande` | Validation du panier (compte requis) |
| `/mon-compte` | Profil, photo, mot de passe, commandes, abonnements, inscriptions, candidatures |
| `/admin/invitation` | Création du compte d'un administrateur invité |
| `/admin` | Back-office (rôle ADMIN) : tableau de bord, commandes, abonnements et formules, événements et inscrits, Miss Centrafrique, actualités, boutique, domaines et carte O'GAB, contenu du site, invitations |

## Architecture

- **Rendu serveur** du contenu public (`src/lib/api.js` → `getPublic`, cache `revalidate`) :
  si l'API ne répond pas, la page s'affiche sans le bloc concerné.
- **Le navigateur ne parle jamais à l'API directement.** Les jetons JWT sont gardés en cookies
  `httpOnly` par les routes Next :
  - `/api/session/{login,register,logout,invitation/*}` ouvrent ou ferment la session ;
  - `/api/proxy/<chemin>` relaie vers `/api/<chemin>` avec le jeton, et renouvelle la session
    automatiquement quand le jeton d'accès (15 min) a expiré.
- `/media/*` (photos envoyées) est relayé vers l'API par une réécriture (`next.config.js`).
- Connexion, inscription et « Nous contacter » s'ouvrent en modales (`ModalProvider`, `useModals()`).
  `src/proxy.js` renvoie les pages réservées (`/mon-compte`, `/commande`) vers `/?auth=connexion&redirect=…`.
- Panier (`CartProvider`) dans le `localStorage` ; les prix sont recalculés par l'API.
- Images du contenu affichées avec `SafeImg` : un fichier introuvable laisse un fond neutre.
- **Back-office** (`src/app/admin/(bo)`, `src/components/admin`) : sans l'en-tête du site (`SiteChrome`),
  réservé aux administrateurs (`AdminShell`). Les écrans de contenu sont décrits par un schéma de champs
  (`CrudPage` + `fields.jsx`) ; les images sont envoyées à l'API (`/api/admin/media`). Les filtres et
  onglets sont gardés dans l'adresse (`?statut=`, `?vue=`, `?q=`). Recherche globale : Ctrl+K
  (`AdminSearch`). Actions sensibles confirmées dans une fenêtre (`ConfirmDialog`) ; les suppressions
  sont logiques côté API (contenu masqué, conservé en base) et réversibles depuis la corbeille
  (`/admin/corbeille`). Les pages publiques reprennent les
  modifications sous 5 minutes (cache `revalidate`).

## Design

Mise en page inspirée de [kode-rca.vercel.app](https://kode-rca.vercel.app/) (en-tête à filets,
titres Roboto Mono en capitales, accroches DM Serif Display, blocs à bordures fines, cartes photo
qui se retournent) et sa palette chaude (bruns, beiges), avec le rouge du logo LIAM comme accent. Classes du système dans
`src/app/globals.css`, couleurs dans `tailwind.config.js`.
