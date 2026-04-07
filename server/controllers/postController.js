/** controller des posts */
/** gère les requêtes/réponses HTTP et la validation des entrées */
const postService = require('../services/postService');

/** récupération de tous les posts */
exports.getAllPosts = async (req, res) => {
    try {
        /** appel du service —> retourne un tableau vide si aucun post */
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** récupération des posts d'un utilisateur spécifique */
exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        /** validation de l'id */
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ message: 'ID utilisateur invalide' });
        }

        /* appel du service */
        const posts = await postService.getPostsByUserId(userId);
        res.status(200).json(posts);

    } catch (error) {
        if (error.message === 'ID utilisateur invalide') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** création d'un nouveau post */
exports.createPost = async (req, res) => {
    try {
        const { title, content, image_url, game_id } = req.body;

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** validation renforcée des entrées */
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Le titre est obligatoire' });
        }
        if (title.trim().length > 150) {
            return res.status(400).json({ message: 'Le titre ne peut pas dépasser 150 caractères' });
        }
        if (!game_id || isNaN(parseInt(game_id))) {
            return res.status(400).json({ message: 'Le jeu est obligatoire' });
        }

        /** appel du service */
        const postId = await postService.createPost(
            user_id,
            parseInt(game_id),
            title.trim(),
            content ? content.trim() : null,
            image_url ? image_url.trim() : null
        );

        res.status(201).json({ message: 'Post créé avec succès', id: postId });

    } catch (error) {
        if (error.message === 'Jeu introuvable') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Échec de la création du post') {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** suppression d'un post */
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        /** validation de l'id */
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'ID post invalide' });
        }

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** appel du service */
        await postService.deletePost(parseInt(id), user_id);

        res.status(200).json({ message: 'Post supprimé avec succès' });

    } catch (error) {
        if (error.message === 'Post introuvable ou accès non autorisé') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};