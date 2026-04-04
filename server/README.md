# GameFeed — Back-end :

API REST développée avec Node.js et Express.

## Technologies utilisées :

- Node.js
- Express
- MySQL2
- bcrypt (hashage des mots de passe)
- JSON Web Token (authentification)
- CORS

## Installation :
```bash
npm install
```

## Lancement :
```bash
node --env-file=.env index.js
```

## Variables d'environnement :

Créer un fichier `.env` à la racine du dossier `server/` :
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=gamefeed
JWT_SECRET=ta_chaine_secrete
```

## Routes de l'API :

### Authentification :
- `POST/api/auth/register` — Inscription
- `POST/api/auth/login` — Connexion

### Posts :
- `GET/api/posts` — Récupérer tous les posts
- `GET/api/posts/user/:id` — Récupérer les posts d'un utilisateur
- `POST/api/posts` — Créer un post (authentifié)
- `DELETE/api/posts/:id` — Supprimer un post (authentifié)

### Likes :
- `POST/api/likes/:postId` — Liker un post (authentifié)
- `DELETE/api/likes/:postId` — Unliker un post (authentifié)
- `GET/api/likes/:postId/check` — Vérifier si liké (authentifié)

### Utilisateurs :
- `GET/api/users/:id` — Récupérer un profil
- `PUT/api/users/:id` — Modifier un profil (authentifié)

### Jeux :
- `GET/api/games` — Récupérer tous les jeux