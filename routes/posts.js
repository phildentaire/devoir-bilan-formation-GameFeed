/** mportation du module express et création du router */
const express = require('express');
const router = express.Router();

/** importation du middleware d'authentification */
const authMiddleware = require('../middleware/auth');

/** importation du controller des posts */
const postController = require('../controllers/postcontroller');

/** récupération de tous les posts (accessible sans connexion) */
/** GET/api/posts */
router.get('/', postController.getAllPosts);

/** récupération des posts d'un utilisateur spécifique */
/** GET/api/posts/user/:userId */
router.get('/user/:userId', postController.getUserPosts);

/** création d'un post (connexion obligatoire) */
/** POS /api/posts */
router.post('/', authMiddleware, postController.createPost);

/** suppression d'un post (connexion obligatoire) */
/** DELETE/api/posts/:id */
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;