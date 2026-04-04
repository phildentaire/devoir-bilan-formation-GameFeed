/** importation de la connexion à la base de données */
const db = require('../config/db');

/** liker un post */
exports.likePost = async (req, res) => {
    try {
        /** récupération de l'id du post depuis l'URL */
        const { postId } = req.params;

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** insertion du like en base de données */
        /* la CONTRAINTE UNIQUE empêche de liker deux fois le même post */
        await db.execute(
            'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
            [user_id, postId]
        );

        res.status(201).json({ message: 'Post liké' });

    } catch (error) {
        /** si le like existe déjà (CONTRAINTE UNIQUE) */
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Post déjà liké' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** unliker un post */
exports.unlikePost = async (req, res) => {
    try {
        /** récupération de l'id du post depuis l'URL */
        const { postId } = req.params;

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** suppression du like en base de données */
        await db.execute(
            'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
            [user_id, postId]
        );

        res.status(200).json({ message: 'Like retiré' });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** vérifier si un utilisateur a liké un post */
exports.checkLike = async (req, res) => {
    try {
        /** récupération de l'id du post depuis l'URL */
        const { postId } = req.params;

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** recherche du like en base de données */
        const [rows] = await db.execute(
            'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
            [user_id, postId]
        );

        /** retourne true si le like existe, false sinon */
        res.status(200).json({ liked: rows.length > 0 });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};