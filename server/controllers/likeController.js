/** controller des likes */
/** gère les requêtes/réponses HTTP et la validation des entrées */
const likeService = require('../services/likeService');

/** liker un post */
exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;

        /** validation de l'id */
        if (!postId || isNaN(parseInt(postId))) {
            return res.status(400).json({ message: 'ID post invalide' });
        }

        /** récupération de l'id utilisateur depuis le token JWT const user_id = req.user.id; */

        /** appel du service */
        await likeService.likePost(user_id, parseInt(postId));

        res.status(201).json({ message: 'Post liké' });

    } catch (error) {
        if (error.message === 'Post introuvable') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Post déjà liké') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** unliker un post */
exports.unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;

        /** validation de l'id */
        if (!postId || isNaN(parseInt(postId))) {
            return res.status(400).json({ message: 'ID post invalide' });
        }

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** appel du service */
        await likeService.unlikePost(user_id, parseInt(postId));

        res.status(200).json({ message: 'Like retiré' });

    } catch (error) {
        if (error.message === 'Like introuvable') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** vérifier si un utilisateur a liké un post */
exports.checkLike = async (req, res) => {
    try {
        const { postId } = req.params;

        /** validation de l'id */
        if (!postId || isNaN(parseInt(postId))) {
            return res.status(400).json({ message: 'ID post invalide' });
        }

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** appel du service */
        const liked = await likeService.checkLike(user_id, parseInt(postId));

        res.status(200).json({ liked });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};