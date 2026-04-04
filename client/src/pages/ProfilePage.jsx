/** importation des hooks React */
import { useState, useEffect } from 'react';

/** importation de la navigation */
import { useNavigate, useParams } from 'react-router-dom';

/** importation de l'instance axios configurée */
import api from '../api/axios';

/** importation du contexte d'authentification */
import { useAuth } from '../context/AuthContext';

/** importation du composant PostCard */
import PostCard from '../components/PostCard';

const ProfilePage = () => {
    /** récupération de l'id depuis l'URL */
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    /** États de la page */
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /** récupération du profil et des posts au chargement */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, postsRes] = await Promise.all([
                    api.get(`/users/${id}`),
                    api.get(`/posts/user/${id}`),
                ]);
                setProfile(profileRes.data);
                setPosts(postsRes.data);
            } catch (err) {
                setError('Erreur lors du chargement du profil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

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

            {/* carte profil */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                }}>
                    {/* avatar */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#EEEDFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: '500',
                        color: '#534AB7',
                        flexShrink: 0,
                    }}>
                        {profile.username.slice(0, 2).toUpperCase()}
                    </div>

                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '4px', color: '#1a1a2e' }}>
                            {profile.username}
                        </h2>
                        {profile.bio && (
                            <p style={{ fontSize: '13px', color: '#666' }}>{profile.bio}</p>
                        )}
                    </div>

                    {/* bouton modifier si c'est le profil de l'utilisateur connecté */}
                    {user && user.id === parseInt(id) && (
                        <button
                            className="btn-outline"
                            onClick={() => navigate(`/profile/${id}/edit`)}
                        >
                            Modifier
                        </button>
                    )}
                </div>

                {/* statistiques */}
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    borderTop: '0.5px solid #eee',
                    paddingTop: '12px',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '18px', fontWeight: '500', color: '#1a1a2e' }}>
                            {posts.length}
                        </p>
                        <p style={{ fontSize: '11px', color: '#888' }}>Posts</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '18px', fontWeight: '500', color: '#1a1a2e' }}>
                            {posts.reduce((acc, post) => acc + parseInt(post.likes_count), 0)}
                        </p>
                        <p style={{ fontSize: '11px', color: '#888' }}>Likes reçus</p>
                    </div>
                </div>
            </div>

            {/* posts de l'utilisateur */}
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>
                Ses posts
            </h3>

            {posts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: '#888' }}>
                    <p>Aucun post pour le moment.</p>
                </div>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUser={user}
                    />
                ))
            )}
        </div>
    );
};

export default ProfilePage;