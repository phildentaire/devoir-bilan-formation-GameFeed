/** importation des hooks de navigation */
import { Link, useNavigate } from 'react-router-dom';

/** importation du contexte d'authentification */
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    /** fonction de déconnexion */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            backgroundColor: '#534AB7',
            padding: '12px 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* logo */}
                <Link to="/" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '18px',
                    fontWeight: '500',
                }}>
                    GameFeed
                </Link>

                {/* navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to="/create" style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                    }}>
                        + Post
                    </Link>

                    {/* lien vers le profil de l'utilisateur connecté */}
                    <Link to={`/profile/${user.id}`} style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '500',
                    }}>
                        {user.username.slice(0, 2).toUpperCase()}
                    </Link>

                    {/* bouton de déconnexion */}
                    <button onClick={handleLogout} style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.4)',
                        borderRadius: '8px',
                        padding: '5px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                    }}>
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;