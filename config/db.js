/** importation du module mysql2 pour interagir avec la base de données */
const mysql = require('mysql2');

/** chargement des variables d'environnement depuis le fichier .env */
require('dotenv').config();

/** pool de connection pour gérer plusieurs requêtes en même temps */
const pool = mysql.createPool({
    host: process.env.DB_HOST,              /**adresse du serveur MySQL (localhost) */
    user: process.env.DB_USER,              /**nom utilisateur MySQL (root) */
    password: process.env.DB_PASSWORD,      /**mot de passe */
    database: process.env.DB_NAME,          /**nom de la base de données (GameFeed) */
    waitForConnections: true,               /**file d'attente dis toputes les connections sont occuppées*/
    connectionLimit: 10,                    /**nombre max de connexions simultanées */
});

/** conversion du pool en version "promise" pour utiliser async/await */
const promisePool = pool.promise();

/** export du pool pour une utilisation dans d'autres fichiers */
module.exports = promisePool;