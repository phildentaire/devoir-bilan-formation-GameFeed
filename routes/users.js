/** importation du module express et création du router */
const express = require('express');
const router = express.Router();

/** importation du middleware d'authentification */
const authMiddleware = require('../middleware/auth');

/** importation du controller des utilisateurs */
const userController = require('../controllers/usercontroller');

/** récupération du profil d'un utilisateur */
/** GET/api/users/:id */
router.get('/:id', userController.getUser);

/** modification du profil (connexion obligatoire) */
/** PUT/api/users/:id */
router.put('/:id', authMiddleware, userController.updateUser);

module.exports = router;