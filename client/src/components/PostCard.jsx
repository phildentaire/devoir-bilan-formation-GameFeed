/** importation des hooks React */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import api from '../api/axios';

const PostCard = ({ post, currentUser, onLikeUpdate, onDelete }) => {
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    /** suppression d'un post */
    const handleDelete = async () => {
        if (!window.confirm('Supprimer ce post ?')) return;
        setDeleting(true);
        try {
            await api.delete(`/posts/${post.id}`);
            /** notifie le parent pour retirer le post du feed */
            if (onDelete) onDelete(post.id);
        } catch (err) {
            console.error('Erreur suppression:', err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <article className="card">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
            }}>
                {/* avatar cliquable vers le profil */}
                <div
                    onClick={() => navigate(`/profile/${post.user_id}`)}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#EEEDFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#534AB7',
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                >
                    {post.username.slice(0, 2).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                    <p
                        onClick={() => navigate(`/profile/${post.user_id}`)}
                        style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            color: '#1a1a2e',
                        }}
                    >
                        {post.username}
                    </p>
                    <p style={{ fontSize: '11px', color: '#888' }}>
                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </p>
                </div>

                <span className="game-tag">{post.game_name}</span>

                {/* bouton supprimer visible uniquement pour l'auteur */}
                {currentUser && currentUser.id === post.user_id && (
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#E24B4A',
                            fontSize: '12px',
                            padding: '0 4px',
                        }}
                    >
                        {deleting ? '...' : 'Supprimer'}
                    </button>
                )}
            </div>

            <h3 style={{ fontSize: '15px', marginBottom: '6px', color: '#1a1a2e' }}>
                {post.title}
            </h3>

            {post.content && (
                <p style={{ fontSize: '13px', color: '#444', marginBottom: '10px', lineHeight: '1.5' }}>
                    {post.content}
                </p>
            )}

            {post.image_url && (
                <img
                    src={post.image_url}
                    alt={post.title}
                    style={{
                        width: '100%',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        maxHeight: '300px',
                        objectFit: 'cover',
                    }}
                />
            )}

            <div style={{
                borderTop: '0.5px solid #eee',
                paddingTop: '10px',
                marginTop: '4px',
            }}>
                <LikeButton
                    postId={post.id}
                    initialLikes={post.likes_count}
                    currentUser={currentUser}
                    onLikeUpdate={onLikeUpdate}
                />
            </div>
        </article>
    );
};

export default PostCard;