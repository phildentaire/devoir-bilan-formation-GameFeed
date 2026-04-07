/** service des jeux */
/** contient la logique métier et les requêtes SQL liées aux jeux */
const db = require('../config/db');

/** récupération de tous les jeux disponibles */
const getAllGames = async () => {
    const [rows] = await db.execute(
        'SELECT * FROM games ORDER BY name ASC'
    );

    /** vérification que la requête retourne bien un tableau */
    if (!rows || rows.length === 0) return [];

    return rows;
};

module.exports = { getAllGames };