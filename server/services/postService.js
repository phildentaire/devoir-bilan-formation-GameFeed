/** service des posts */
/** contient la logique métier et les requêtes SQL liées aux posts */
const db = require('../config/db');

/** récupération de tous les posts avec les infos utilisateur, jeu et likes */
const getAllPosts = async () => {
    const [rows] = await db.execute(`
    SELECT
      posts.id,
      posts.title,
      posts.content,
      posts.image_url,
      posts.created_at,
      users.id AS user_id,
      users.username,
      users.avatar_url,
      games.id AS game_id,
      games.name AS game_name,
      COUNT(likes.id) AS likes_count
    FROM posts
    JOIN users ON posts.user_id = users.id
    JOIN games ON posts.game_id = games.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY posts.created_at DESC
  `);

    /** vérification que la requête retourne bien un tableau */
    if (!rows || rows.length === 0) return [];

    return rows;
};

/** récupération des posts d'un utilisateur spécifique */
const getPostsByUserId = async (userId) => {
    /** vérification que l'id est bien un entier */
    const id = parseInt(userId);
    if (isNaN(id)) throw new Error('ID utilisateur invalide');

    const [rows] = await db.execute(`
    SELECT
      posts.id,
      posts.title,
      posts.content,
      posts.image_url,
      posts.created_at,
      users.id AS user_id,
      users.username,
      users.avatar_url,
      games.id AS game_id,
      games.name AS game_name,
      COUNT(likes.id) AS likes_count
    FROM posts
    JOIN users ON posts.user_id = users.id
    JOIN games ON posts.game_id = games.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.user_id = ?
    GROUP BY posts.id
    ORDER BY posts.created_at DESC
  `, [id]);

    if (!rows || rows.length === 0) return [];

    return rows;
};

/** création d'un nouveau post */
const createPost = async (userId, gameId, title, content, imageUrl) => {
    
    /** vérification que le jeu existe bien en base */
    const [game] = await db.execute(
        'SELECT id FROM games WHERE id = ?',
        [gameId]
    );

    if (!game || game.length === 0) {
        throw new Error('Jeu introuvable');
    }

    const [result] = await db.execute(
        'INSERT INTO posts (user_id, game_id, title, content, image_url) VALUES (?, ?, ?, ?, ?)',
        [userId, gameId, title, content || null, imageUrl || null]
    );

    /** vérification que l'insertion a bien eu lieu */
    if (!result || result.affectedRows === 0) {
        throw new Error('Échec de la création du post');
    }

    return result.insertId;
};

/** suppression d'un post */
const deletePost = async (postId, userId) => {
    
    /** vérification que le post appartient bien à l'utilisateur connecté */
    const [rows] = await db.execute(
        'SELECT * FROM posts WHERE id = ? AND user_id = ?',
        [postId, userId]
    );

    if (!rows || rows.length === 0) {
        throw new Error('Post introuvable ou accès non autorisé');
    }

    const [result] = await db.execute(
        'DELETE FROM posts WHERE id = ?',
        [postId]
    );

    if (!result || result.affectedRows === 0) {
        throw new Error('Échec de la suppression du post');
    }

    return true;
};

module.exports = { getAllPosts, getPostsByUserId, createPost, deletePost };