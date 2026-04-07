/** importation des hooks React */
import { useState } from 'react';

/** importation de la navigation */
import { useNavigate, Link } from 'react-router-dom';

/** importation de l'instance axios configurée */
import api from '../api/axios';

const RegisterPage = () => {
    /** États du formulaire */
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    /** soumission du formulaire d'inscription */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.post('/auth/register', { username, email, password });

            setSuccess('Compte créé avec succès ! Redirection...');

            /** redirection vers la page de connexion après 1.5 secondes */
            setTimeout(() => navigate('/login'), 1500);

        } catch (err) {
            if (err.response?.status === 409) {
                setError('Email ou username déjà utilisé');
            } else {
                setError('Une erreur est survenue');
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>

                {/* logo et titre */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 style={{ color: '#534AB7', fontSize: '24px', marginBottom: '6px' }}>
                        GameFeed
                    </h1>
                    <p style={{ color: '#888', fontSize: '13px' }}>
                        Crée ton compte gamer
                    </p>
                </div>

                {/* messages */}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                {/* formulaire d'inscription */}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username" style={{ fontSize: '13px', color: '#555' }}>Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        className="form-input"
                        placeholder="ton_pseudo_gamer"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="email" style={{ fontSize: '13px', color: '#555' }}>Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                        placeholder="exemple@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password" style={{ fontSize: '13px', color: '#555' }}>Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn-primary">
                        Créer mon compte
                    </button>
                </form>

                {/* lien vers la connexion */}
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '16px' }}>
                    Déjà un compte ?{' '}
                    <Link to="/login" style={{ color: '#534AB7' }}>
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;