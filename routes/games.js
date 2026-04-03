/** importation du module express et création du router */
const express = require('express');
const router = express.Router();

/** importation du controller des jeux */
const gameController = require('../controllers/gamecontroller');

/** récupération de tous les jeux */
/** GET/api/games */
router.get('/', gameController.getAllGames);

module.exports = router;