/** importation des hooks React */
import { useState, useEffect } from 'react';

/** importation de la navigation */
import { useNavigate, useParams } from 'react-router-dom';

/** importation de l'instance axios configurée */
import api from '../api/axios';

/** importation du contexte d'authentification */
import { useAuth } from '../context/AuthContext';

const EditProfilePage = () => {
    const { id } = useParams();
    const { user, login } = useAuth();
    const navigate = useNavigate();

    /** États du formulaire */
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    /** récupération des infos actuelles au chargement */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/users/${id}`);
                setUsername(response.data.username);
                setBio(response.data.bio || '');
                setAvatarUrl(response.data.avatar_url || '');
            } catch (err) {
                setError('Erreur lors du chargement du profil');
            }
        };
        fetchProfile();
    }, [id]);

    /** soumission du formulaire de modification */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.put(`/users/${id}`, { username, bio, avatar_url: avatarUrl });

            /** mise à jour du contexte avec les nouvelles infos */
            login(localStorage.getItem('token'), { ...user, username });

            setSuccess('Profil mis à jour !');

            /** redirection vers le profil après 1.5 secondes */
            setTimeout(() => navigate(`/profile/${id}`), 1500);

        } catch (err) {
            setError('Erreur lors de la mise à jour du profil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '24px', paddingBottom: '40px' }}>
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>

                {/* titre de la page */}
                <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#1a1a2e' }}>
                    Modifier mon profil
                </h2>

                {/* messages */}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                {/* formulaire de modification */}
                <form onSubmit={handleSubmit}>

                    <label htmlFor="username" style={{ fontSize: '13px', color: '#555' }}>Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="bio" style={{ fontSize: '13px', color: '#555' }}>Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        className="form-input"
                        placeholder="Parle de toi..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        style={{ resize: 'vertical' }}
                    />

                    <label htmlFor="avatarUrl" style={{ fontSize: '13px', color: '#555' }}>Avatar (URL)</label>
                    <input
                        id="avatarUrl"
                        name="avatarUrl"
                        type="url"
                        className="form-input"
                        placeholder="https://..."
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                    />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={() => navigate(`/profile/${id}`)}
                            style={{ width: '100%' }}
                        >
                            Annuler
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;