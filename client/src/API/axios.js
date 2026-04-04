/** importation d'axios pour faire des requêtes HTTP */
import axios from 'axios';

/** création d'une instance axios configurée */
/** baseURL pointe vers le serveur Express */
const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
});

/** intercepteur qui ajoute automatiquement le token JWT dans le header de chaque requête */
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default instance;