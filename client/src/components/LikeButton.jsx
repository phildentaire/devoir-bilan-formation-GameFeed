/** importation des hooks React */
import { useState, useEffect } from 'react';

/** importation de l'instance axios configurée */
import api from '../api/axios';

const LikeButton = ({ postId, initialLikes, currentUser }) => {
  /** conversion en nombre pour éviter les erreurs d'affichage */
  const [likes, setLikes] = useState(Number(initialLikes) || 0);

  /** État pour savoir si l'utilisateur a liké le post */
  const [liked, setLiked] = useState(false);

  /** État pour éviter les doubles clics */
  const [loading, setLoading] = useState(false);

  /** vérification au chargement si l'utilisateur a déjà liké ce post */
  useEffect(() => {
    const checkLike = async () => {
      if (!currentUser) return;
      try {
        const response = await api.get(`/likes/${postId}/check`);
        setLiked(response.data.liked);
      } catch (err) {
        console.error('Erreur vérification like:', err);
      }
    };
    checkLike();
  }, [postId, currentUser]);

  /** fonction pour liker ou unliker un post */
  const handleLike = async () => {
    if (!currentUser || loading) return;
    setLoading(true);

    try {
      if (liked) {
        /** unliker le post */
        await api.delete(`/likes/${postId}`);
        setLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        /** liker le post */
        await api.post(`/likes/${postId}`);
        setLikes((prev) => prev + 1);
        setLiked(true);
        /** mise à jour du compteur dans le feed parent */
        if (onLikeUpdate) onLikeUpdate(postId, 1);
      }
    } catch (err) {
      console.error('Erreur like:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: currentUser ? 'pointer' : 'default',
        color: liked ? '#E24B4A' : '#888',
        fontSize: '13px',
        padding: '0',
      }}
    >
      {/* icône coeur — plein si liké, vide sinon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {/* affichage du nombre de likes */}
      <span>{likes} j'aime</span>
    </button>
  );
};

export default LikeButton;