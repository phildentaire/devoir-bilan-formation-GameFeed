/** controller des utilisateurs */
/**gère les requêtes/réponses HTTP et la validation des entrées */
const userService = require('../services/userService');

/** récupération du profil d'un utilisateur */
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;

        /** validation de l'id */
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'ID utilisateur invalide' });
        }

        /** appel du service */
        const user = await userService.getUserById(id);

        res.status(200).json(user);

    } catch (error) {
        if (error.message === 'Utilisateur introuvable') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** modification du profil utilisateur */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        /** validation de l'id */
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'ID utilisateur invalide' });
        }

        /** vérification que l'utilisateur modifie bien son propre profil */
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ message: 'Action non autorisée' });
        }

        const { username, bio, avatar_url } = req.body;

        /** validation renforcée des entrées */
        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Le username est obligatoire' });
        }
        if (username.trim().length < 3) {
            return res.status(400).json({ message: 'Le username doit contenir au moins 3 caractères' });
        }
        if (username.trim().length > 50) {
            return res.status(400).json({ message: 'Le username ne peut pas dépasser 50 caractères' });
        }

        /** appel du service */
        await userService.updateUser(id, username, bio, avatar_url);

        res.status(200).json({ message: 'Profil mis à jour' });

    } catch (error) {
        if (error.message === 'Ce username est déjà utilisé') {
            return res.status(409).json({ message: error.message });
        }
        if (error.message === 'Utilisateur introuvable') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};