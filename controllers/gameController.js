/** importation de la connexion à la base de données */
const db = require('../config/db');

/** récupération de tous les jeux disponibles */
exports.getAllGames = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM games ORDER BY name ASC'
        );

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};