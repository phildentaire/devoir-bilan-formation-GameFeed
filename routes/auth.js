/** importation du module express et création du router */
const express = require('express');
const router = express.Router();

/** importation du controller d'authentification */
const authController = require('../controllers/authController');

/** route d'inscription */
/** POST/api/auth/register */
router.post('/register', authController.register);

/** route de connexion */
/** POST/api/auth/login */
router.post('/login', authController.login);

module.exports = router;