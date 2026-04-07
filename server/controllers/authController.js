/** controller d'authentification */
/** gère les requêtes/réponses HTTP et la validation des entrées */
const authService = require('../services/authService');

/** inscription d'un nouvel utilisateur */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        /** validation renforcée des entrées */
        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Le username est obligatoire' });
        }
        if (!email || email.trim() === '') {
            return res.status(400).json({ message: "L'email est obligatoire" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        /** vérification du format email */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Format d'email invalide" });
        }

        /** appel du service — la logique métier est déléguée */
        await authService.createUser(username.trim(), email.trim(), password);

        res.status(201).json({ message: 'Compte créé avec succès' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email ou username déjà utilisé' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** connexion d'un utilisateur existant */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        /** validation des entrées */
        if (!email || email.trim() === '') {
            return res.status(400).json({ message: "L'email est obligatoire" });
        }
        if (!password || password.trim() === '') {
            return res.status(400).json({ message: 'Le mot de passe est obligatoire' });
        }

        /** appel du service — retourne les données ou null si échec */
        const result = await authService.loginUser(email.trim(), password);

        if (!result) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};