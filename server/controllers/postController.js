/** importation de la connexion à la base de données */
const db = require('../config/db');

/** récupération de tous les posts avec les infos utilisateur et jeu associés */
exports.getAllPosts = async (req, res) => {
    try {
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

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** récupération des posts d'un utilisateur spécifique */
exports.getUserPosts = async (req, res) => {
    try {
        /** récupération de l'id utilisateur depuis l'URL */
        const { userId } = req.params;

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
    `, [userId]);

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** création d'un nouveau post */
exports.createPost = async (req, res) => {
    try {
        /* récupération des données envoyées par le client */
        const { title, content, image_url, game_id } = req.body;

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** vérification que les champs obligatoires sont remplis */
        if (!title || !game_id) {
            return res.status(400).json({ message: 'Titre et jeu obligatoires' });
        }

        /** insertion du post en base de données */
        const [result] = await db.execute(
            'INSERT INTO posts (user_id, game_id, title, content, image_url) VALUES (?, ?, ?, ?, ?)',
            [user_id, game_id, title, content, image_url]
        );

        res.status(201).json({ message: 'Post créé avec succès', id: result.insertId });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/** suppression d'un post */
exports.deletePost = async (req, res) => {
    try {
        /** récupération de l'id du post depuis l'URL */
        const { id } = req.params;

        /** récupération de l'id utilisateur depuis le token JWT */
        const user_id = req.user.id;

        /** vérification que le post appartient bien à l'utilisateur connecté */
        const [rows] = await db.execute(
            'SELECT * FROM posts WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: 'Action non autorisée' });
        }

        /** suppression du post */
        await db.execute('DELETE FROM posts WHERE id = ?', [id]);

        res.status(200).json({ message: 'Post supprimé avec succès' });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};