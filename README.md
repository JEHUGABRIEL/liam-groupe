# LIAM Groupe — Site web React

Site web fidèle à la maquette fournie (organisation LIAM Groupe — Bangui,
République Centrafricaine), développé en **React + Vite + React Router +
Tailwind CSS**.

## Démarrer le projet

```bash
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:5173`.

Pour générer une version de production :

```bash
npm run build
npm run preview   # pour prévisualiser le build de production
```

## Structure du projet

```
src/
  data/
    siteData.js      # Tout le contenu du site (domaines, événements,
                      # actualités, équipe, partenaires, témoignages…)
    domainIcons.js    # Mapping icône <-> domaine
  components/         # Composants réutilisables (Navbar, Footer, cartes…)
  pages/              # Une page par route
  App.jsx             # Déclaration des routes
```

## Pages / routes

| Route                     | Page                                   |
|----------------------------|-----------------------------------------|
| `/`                        | Accueil                                 |
| `/a-propos`                 | À propos (mission, équipe)             |
| `/domaines`                 | Liste des domaines                      |
| `/domaines/:slug`           | Détail d'un domaine (g-fitness, ogab, entrepreneuriat, formation, communication, evenementiel) |
| `/evenements`               | Événements (filtres Tous / À venir / Passés) |
| `/actualites`               | Actualités                             |
| `/partenaires`              | Partenaires                            |
| `/contact`                  | Contact                                |

## Modifier le contenu

Tout le texte (titres, descriptions, dates, chiffres clés, équipe,
partenaires, témoignages…) se trouve **dans un seul fichier** :
`src/data/siteData.js`. Modifier ce fichier suffit à mettre à jour
l'ensemble du site sans toucher aux composants.

## Images

⚠️ Les visuels utilisés dans ce projet sont des **images de
substitution** générées via `picsum.photos` (placeholder libre, sans
copyright), car les captures d'écran fournies ne contenaient pas les
fichiers image sources. Elles sont toutes centralisées via la fonction
`img(seed, largeur, hauteur)` dans `src/data/siteData.js`.

Pour les remplacer par les vraies photos de LIAM Groupe :
1. Placez vos images dans `src/assets/` (ou `public/images/`).
2. Remplacez les appels `img("seed", w, h)` correspondants par le chemin
   de votre image (`import logo from "../assets/xxx.jpg"` puis
   `heroImage: logo`).

## Palette & typographie

- Violet principal : `#9C05FA`
- Corail / rouge CTA : `#F5323D`
- Fond sombre (bandeaux stats / footer) : `#130025`
- Titres : police **Baloo 2** (Google Fonts)
- Texte courant : police **Poppins** (Google Fonts)

## Notes de fidélité à la maquette

- La barre de navigation est transparente (texte blanc, bouton CTA
  corail) lorsqu'elle survole le hero plein écran, puis devient blanche
  (texte sombre, bouton CTA violet) au scroll — comportement observé sur
  la maquette d'origine.
- Le menu « Domaines » ouvre un sous-menu déroulant vers les 6 pages de
  domaine, chacune suivant le même gabarit (Objectifs → Programmes →
  Statistiques → Galerie → Appel à l'action).
- La page Événements reproduit le filtre à trois onglets (Tous / À
  venir / Passés) avec bouton « S'inscrire » uniquement sur les
  événements à venir.
