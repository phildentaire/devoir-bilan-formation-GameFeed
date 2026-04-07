/** importation des hooks React */
import { useState } from 'react';

/** importation de la navigation */
import { useNavigate, Link } from 'react-router-dom';

/** importation de l'instance axios configurée */
import api from '../api/axios';

/** importation du contexte d'authentification */
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    /** États du formulaire */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    /** soumission du formulaire de connexion */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });

            /** stockage du token et de l'utilisateur via le contexte */
            login(response.data.token, response.data.user);

            /** redirection vers le feed */
            navigate('/');

        } catch (err) {
            setError('Email ou mot de passe incorrect');
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
                        Le réseau social des gamers
                    </p>
                </div>

                {/* message d'erreur */}
                {error && <p className="error">{error}</p>}

                {/* formulaire de connexion */}
                <form onSubmit={handleSubmit}>
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
                        Se connecter
                    </button>
                </form>

                {/* lien vers l'inscription */}
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '16px' }}>
                    Pas encore de compte ?{' '}
                    <Link to="/register" style={{ color: '#534AB7' }}>
                        S'inscrire
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;