/** importation du module express et création du router */
const express = require('express');
const router = express.Router();

/** importation du middleware d'authentification */
const authMiddleware = require('../middleware/auth');

/** importation du controller des likes */
const likeController = require('../controllers/likecontroller');

/** liker un post (connexion obligatoire) */
/** POST/api/likes/:postId */
router.post('/:postId', authMiddleware, likeController.likePost);

/** unliker un post (connexion obligatoire) */
/** DELETE/api/likes/:postId */
router.delete('/:postId', authMiddleware, likeController.unlikePost);

module.exports = router;