/** importation de React et ReactDOM pour le rendu de l'application */
import React from 'react';
import ReactDOM from 'react-dom/client';

/** importation du router pour la navigation entre les pages */
import { BrowserRouter } from 'react-router-dom';

/** importation du contexte d'authentification */
import { AuthProvider } from './context/AuthContext';

/** importation du composant principal */
import App from './App';

/** importation des styles globaux */
import './index.css';

/* rendu de l'application dans le div #root de index.html */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);