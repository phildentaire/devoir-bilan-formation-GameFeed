/** importation des hooks React nécessaires */
import { createContext, useState, useContext } from 'react';

/** création du contexte d'authentification */
/** ce contexte permet de partager l'état de connexion dans toute l'appli */
const AuthContext = createContext();

/** fournisseur du contexte d'authentification */
export const AuthProvider = ({ children }) => {

    /** récupération de l'utilisateur stocké dans le localStorage */
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );

    /** fonction de connexion —> stocke le token et l'utilisateur */
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    /** fonction de déconnexion —> supprime le token et l'utilisateur */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/** hook personnalisé pour utiliser le contexte facilement */
export const useAuth = () => useContext(AuthContext);