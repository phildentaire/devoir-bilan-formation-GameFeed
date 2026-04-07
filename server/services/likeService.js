/** service des likes */
/** contient la logique métier et les requêtes SQL liées aux likes */
const db = require('../config/db');

/** liker un post */
const likePost = async (userId, postId) => {
    /** vérification que le post existe bien en base */
    const [postRows] = await db.execute(
        'SELECT id FROM posts WHERE id = ?',
        [postId]
    );

    if (!postRows || postRows.length === 0) {
        throw new Error('Post introuvable');
    }

    /** vérification que l'utilisateur n'a pas déjà liké ce post */
    const [existingRows] = await db.execute(
        'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );

    if (existingRows && existingRows.length > 0) {
        throw new Error('Post déjà liké');
    }

    const [result] = await db.execute(
        'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
        [userId, postId]
    );

    if (!result || result.affectedRows === 0) {
        throw new Error('Échec du like');
    }

    return true;
};

/** unliker un post */
const unlikePost = async (userId, postId) => {
    /** vérification que le like existe bien */
    const [existingRows] = await db.execute(
        'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );

    if (!existingRows || existingRows.length === 0) {
        throw new Error('Like introuvable');
    }

    const [result] = await db.execute(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );

    if (!result || result.affectedRows === 0) {
        throw new Error('Échec du unlike');
    }

    return true;
};

/** vérifier si un utilisateur a liké un post */
const checkLike = async (userId, postId) => {
    const [rows] = await db.execute(
        'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );

    return rows && rows.length > 0;
};

module.exports = { likePost, unlikePost, checkLike };