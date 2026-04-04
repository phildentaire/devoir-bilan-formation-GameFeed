/** importation de la connexion à la base de données */
const db = require('../config/db');

/** récupération du profil d'un utilisateur */
exports.getUser = async (req, res) => {
    try {
        /** récupération de l'id depuis l'URL */
        const { id } = req.params;

        const [rows] = await db.execute(
            `SELECT 
        id,
        username,
        email,
        avatar_url,
        bio,
        created_at
      FROM users WHERE id = ?`,
            [id]
        );

        /** si aucun utilisateur trouvé */
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        res.status(200).json(rows[0]);

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** modification du profil utilisateur */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        /** vérification que l'utilisateur modifie bien son propre profil */
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ message: 'Action non autorisée' });
        }

        /** récupération des données envoyées par le client */
        const { username, bio, avatar_url } = req.body;

        /** mise à jour en base de données */
        await db.execute(
            'UPDATE users SET username = ?, bio = ?, avatar_url = ? WHERE id = ?',
            [username, bio, avatar_url, id]
        );

        res.status(200).json({ message: 'Profil mis à jour' });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};