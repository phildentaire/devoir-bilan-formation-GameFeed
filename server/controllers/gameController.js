/** controller des jeux */
/** gère les requêtes/réponses HTTP */
const gameService = require('../services/gameService');

/** récupération de tous les jeux disponibles */
exports.getAllGames = async (req, res) => {
    try {
        /** appel du service */
        const games = await gameService.getAllGames();

        res.status(200).json(games);

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};