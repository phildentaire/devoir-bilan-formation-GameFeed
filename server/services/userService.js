/** service des utilisateurs */
/** contient la logique métier et les requêtes SQL liées aux profils */
const db = require('../config/db');

/** récupération du profil d'un utilisateur par son id */
const getUserById = async (userId) => {
   
    /** vérification que l'id est bien un entier */
    const id = parseInt(userId);
    if (isNaN(id)) throw new Error('ID utilisateur invalide');

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

    /** vérification que l'utilisateur existe */
    if (!rows || rows.length === 0) {
        throw new Error('Utilisateur introuvable');
    }

    return rows[0];
};

/** mise à jour du profil utilisateur */
const updateUser = async (userId, username, bio, avatarUrl) => {
    const id = parseInt(userId);
    if (isNaN(id)) throw new Error('ID utilisateur invalide');

    /** vérification que le username n'est pas vide */
    if (!username || username.trim() === '') {
        throw new Error('Le username ne peut pas être vide');
    }

    /** vérification que le username n'est pas déjà pris par un autre utilisateur */
    const [existing] = await db.execute(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username.trim(), id]
    );

    if (existing && existing.length > 0) {
        throw new Error('Ce username est déjà utilisé');
    }

    const [result] = await db.execute(
        'UPDATE users SET username = ?, bio = ?, avatar_url = ? WHERE id = ?',
        [username.trim(), bio || null, avatarUrl || null, id]
    );

    if (!result || result.affectedRows === 0) {
        throw new Error('Échec de la mise à jour du profil');
    }

    return true;
};

module.exports = { getUserById, updateUser };