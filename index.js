/** importation du module express pour créer le serveur */
const express = require('express');

/** importation du cors pour autoriser les requêtes depuis le Front-End React */
const cors = require('cors');

/** chargement des variables d'environnement depuis le fichier .env */
require('dotenv').config();

/** importation des routes de l'application*/
const authRoutes = require('./routes/auth');   /** routes d'autentification */
const postRoutes = require('./routes/posts');  /** routes des posts */
const likeRoutes = require('./routes/likes');  /** routes des likes */
const userRoutes = require('./routes/users');  /** routes des utilisateurs */
const gameRoutes = require('./routes/games');  /** routes des jeux */


/** initialisation de l'application Express */
const app = express();

/** middleware permettant les requêtes cross origin (Front-End to Back-End) */
app.use(cors());

/** middleware permettant de lire les requêtes en JSON */
app.use(express.json());

/** déclaration des routes dde l'API */
/** chaque route est préfixée par /api pour identifier clairement l'API */
app.use('/api/auth', authRoutes);    /** POST/api/auth/login */
app.use('/api/posts', postRoutes);   /** GET/api/posts */
app.use('/api/likes', likeRoutes);   /** POST/api/likes/postsId */
app.use('/api/users', userRoutes);   /** GET/api/users/Id */
app.use('/api/games', gameRoutes);   /** GET/ap/games */


/** démarrage du serveur sur le port défini dans .env ou par défaut 3000 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});