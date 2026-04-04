/** importation du module jsonwebtoken pour vérifier les tokens */
const jwt = require('jsonwebtoken');

/** middleware de vérification du token JWT */
/** il est exécuté avant chaque route protégée */
const authMiddleware = (req, res, next) => {

    /** récupération du token dans le header Authorization */
    const authHeader = req.headers['authorization'];

    /** si aucun token n'est fourni, on refuse l'accès */
    if (!authHeader) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    /** le token est envoyé sous la forme "Bearer <token>" */
    /** on extrait uniquement la partie token */
    const token = authHeader.split(' ')[1];

    /** cérification et décodage du token */
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        /** si le token est invalide ou expiré */
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }

        /** on attache les infos de l'utilisateur à la requête pour les utiliser dans les routes protégées */
        req.user = decoded;

        /** on passe à la route suivante */
        next();
    });
};

module.exports = authMiddleware;