/** importation de bcrypt pour hasher les mots de passe */
const bcrypt = require('bcrypt');

/** importation de jsonwebtoken pour générer les tokens */
const jwt = require('jsonwebtoken');

/** importation de la connexion à la base de données */
const db = require('../config/db');

/** inscription d'un nouvel utilisateur */
exports.register = async (req, res) => {
    try {
        /** récupération des données envoyées par le client */
        const { username, email, password } = req.body;

        /** vérification que tous les champs sont remplis */
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }

        /** hashage du mot de passe avant stockage en base de données */
        /** 10 = nombre de tours de hashage */
        const password_hash = await bcrypt.hash(password, 10);

        /** insertion de l'utilisateur en base de données */
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash]
        );

        res.status(201).json({ message: 'Compte créé avec succès' });

    } catch (error) {
        /** si l'email ou le username existe déjà */
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email ou username déjà utilisé' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** connexion d'un utilisateur existant */
exports.login = async (req, res) => {
    try {
        /** récupération des données envoyées par le client */
        const { email, password } = req.body;

        /** vérification que tous les champs sont remplis */
        if (!email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }

        /** recherche de l'utilisateur en base de données */
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        /** si aucun utilisateur trouvé */
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const user = rows[0];

        /** comparaison du mot de passe avec le hash stocké */
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        /** génération du token JWT valable 24h */
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        /** envoi du token et des infos utilisateur au client */
        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar_url: user.avatar_url,
                bio: user.bio
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};