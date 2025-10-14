# Gestionnaire de Diagnostics Immobiliers

Outil d'aide à la décision pour déterminer les diagnostics immobiliers requis selon le type de bien, son année de construction et le contexte (vente/location). L'application calcule la validité des diagnostics existants et signale ceux à refaire.

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Le serveur Vite démarre sur `http://localhost:5173`.

## Production

```bash
npm run build
npm run preview
```

Le build statique est généré dans `dist/`. Utilisez `npm run preview` pour une vérification locale.

## Qualité du code

- `npm run lint` – Vérifie les règles ESLint.
- `npm run format` – Formate le projet avec Prettier.

## Structure du projet

```
├── index.html
├── src
│   ├── App.jsx
│   ├── components
│   │   ├── DiagnosticForm.jsx
│   │   ├── DiagnosticResults.jsx
│   │   ├── Footer.jsx
│   │   └── Header.jsx
│   ├── hooks
│   │   └── useDiagnostics.js
│   ├── utils
│   │   └── diagnosticRules.js
│   ├── assets
│   ├── index.css
│   └── main.jsx
└── ...
```

## Déploiement sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com/) si besoin.
2. Initialisez un dépôt Git local et poussez-le sur GitHub (voir ci-dessous).
3. Importez le dépôt dans Vercel.
4. Configurez les paramètres :
   - Build Command : `npm run build`
   - Output Directory : `dist`
5. Lancez le déploiement. Une fois terminé, vérifiez le formulaire sur l'URL fournie.

## Déploiement sur GitHub Pages

Le workflow GitHub Actions `Deploy to GitHub Pages` construit l'application et publie le contenu de `dist/` sur l'environnement Pages.

1. Activez GitHub Pages dans les paramètres du dépôt (`Settings > Pages`) et choisissez le mode *GitHub Actions*.
2. Poussez sur `main` pour déclencher le workflow ; le déploiement se lance automatiquement.
3. L'application est accessible sur `https://<votre-utilisateur>.github.io/diag_validite/`.

## Déploiement sur Netlify (alternative)

1. Créez un site via l'interface Netlify.
2. Build command : `npm run build`
3. Publish directory : `dist`

## Git & Publication

```bash
git init
git add .
git commit -m "Initialise Vite React diagnostic app"
# Liez ensuite votre dépôt GitHub
git remote add origin <repo-url>
git push -u origin main
```

## Notes

- Tailwind CSS est utilisé pour le design.
- Les règles métiers sont isolées dans `src/utils/diagnosticRules.js`.
- La logique métier principale est gérée via le hook `useDiagnostics`.
