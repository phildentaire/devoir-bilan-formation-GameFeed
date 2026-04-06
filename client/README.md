# GameFeed — Front-end :

Interface utilisateur développée avec React et Vite.

## Technologies utilisées :

- React
- Vite
- React Router DOM (navigation)
- Axios (requêtes HTTP)
- ESLint (qualité du code)

## Installation :
```bash
npm install
```

## Lancement :
```bash
npm run dev
```

L'appli sera accessible sur `http://localhost:5173`

## Pages :

- `/login` — Connexion
- `/register` — Inscription
- `/` — Feed principal
- `/create` — Créer un post
- `/profile/:id` — Profil utilisateur
- `/profile/:id/edit` — Modifier son profil

## Structure du projet :
```
src/
├── api/          — Configuration Axios
├── context/      — Contexte d'authentification
├── pages/        — Pages de l'application
├── components/   — Composants réutilisables
├── App.jsx       — Routing principal
└── index.css     — Styles globaux
```