/** service d'authentification */
/** contient la logique métier et les requêtes SQL liées aux utilisateurs */
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/** création d'un nouvel utilisateur en base de données */
const createUser = async (username, email, password) => {
    
    /** hashage du mot de passe avant stockage —> jamais en clair */
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password_hash]
    );

    return result;
};

/** recherche d'un utilisateur par email */
const findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0] || null;
};

/** vérification du mot de passe et génération du token JWT */
const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);

    /** uilisateur introuvable */
    if (!user) return null;

    /** comparaison du mot de passe avec le hash stocké */
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return null;

    /** génération du token JWT valable 24h */
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar_url,
            bio: user.bio,
        }
    };
};

module.exports = { createUser, findUserByEmail, loginUser };