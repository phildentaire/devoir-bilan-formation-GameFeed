/** importation des hooks React */
import { useState, useEffect } from 'react';

/** importation de l'instance axios configurée */
import api from '../api/axios';

/** importation du contexte d'authentification */
import { useAuth } from '../context/AuthContext';

/** importation du composant PostCard */
import PostCard from '../components/PostCard';

const FeedPage = () => {
    /** États de la page */
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();

    /* récupération des posts au chargement de la page */
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    /** mise à jour du compteur de likes dans le state du feed */
    const updateLikes = (postId, delta) => {
        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId
                    ? { ...post, likes_count: parseInt(post.likes_count) + delta }
                    : post
            )
        );
    };

    /** suppression d'un post du feed en temps réel */
    const deletePost = (postId) => {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            Chargement...
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <p className="error">{error}</p>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '24px', paddingBottom: '40px' }}>

            {/* titre du feed */}
            <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#1a1a2e' }}>
                Feed
            </h2>

            {/* liste des posts */}
            {posts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: '#888' }}>
                    <p>Aucun post pour le moment.</p>
                    <p style={{ fontSize: '13px', marginTop: '8px' }}>
                        Sois le premier à partager ton expérience !
                    </p>
                </div>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUser={user}
                        onLikeUpdate={updateLikes}
                        onDelete={deletePost}
                    />
                ))
            )}
        </div>
    );
};

export default FeedPage;