/**
 * importation du module express et création du router
 */
const express = require('express');
const router = express.Router();

/**
 * importation du controller d'authentification
 */
const authController = require('../controllers/authcontroller');

/** route d'inscription */
/** POST/api/auth/login*/

router.post('/register', authController.register);