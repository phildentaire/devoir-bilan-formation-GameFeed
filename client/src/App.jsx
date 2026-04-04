/** importation du composant de routing */
import { Routes, Route, Navigate } from 'react-router-dom';

/** importation du contexte d'authentification */
import { useAuth } from './context/AuthContext';

/** importation des pages */
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import CreatePostPage from './pages/CreatePostPage';

/** importation de la navbar */
import Navbar from './components/Navbar';

/** composant pour protéger les routes qui nécessitent une connexion */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useAuth();

  return (
    <>
      {/* la navbar s'affiche uniquement si l'utilisateur est connecté */}
      {user && <Navbar />}

      <Routes>
        {/* routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* routes protégées */}
        <Route path="/profile/:id/edit" element={
          <PrivateRoute><EditProfilePage /></PrivateRoute>
        } />
        <Route path="/" element={
          <PrivateRoute><FeedPage /></PrivateRoute>
        } />
        <Route path="/create" element={
          <PrivateRoute><CreatePostPage /></PrivateRoute>
        } />
        <Route path="/profile/:id" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />
      </Routes>
    </>
  );
};

export default App;