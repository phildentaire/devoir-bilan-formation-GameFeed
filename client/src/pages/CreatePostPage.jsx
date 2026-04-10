/** importation des hooks React */
import { useState, useEffect } from 'react';

/** importation de la navigation */
import { useNavigate } from 'react-router-dom';

/** importation de l'instance axios configurée */
import api from '../api/axios';

const CreatePostPage = () => {
    /** États du formulaire */
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [gameId, setGameId] = useState('');
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    /** récupération de la liste des jeux au chargement */
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await api.get('/games');
                setGames(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des jeux');
            }
        };

        fetchGames();
    }, []);

    /** soumission du formulaire de création de post */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/posts', {
                title,
                content,
                image_url: imageUrl,
                game_id: gameId,
            });

            /** redirection vers le feed après création */
            navigate('/');

        } catch (err) {
            setError('Erreur lors de la création du post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{ paddingTop: '24px', paddingBottom: '40px' }}>
            <section className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>

                {/* titre de la page */}
                <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#1a1a2e' }}>
                    Nouveau post
                </h2>

                {/* message d'erreur */}
                {error && <p className="error">{error}</p>}

                {/* formulaire de création */}
                <form onSubmit={handleSubmit}>

                    <label htmlFor="title" style={{ fontSize: '13px', color: '#555' }}>Titre *</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="form-input"
                        placeholder="Donne un titre à ton post..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label htmlFor="gameId" style={{ fontSize: '13px', color: '#555' }}>Jeu *</label>
                    <select
                        id="gameId"
                        name="gameId"
                        className="form-input"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        required
                    >
                        <option value="">Sélectionner un jeu...</option>
                        {games.map((game) => (
                            <option key={game.id} value={game.id}>
                                {game.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="content" style={{ fontSize: '13px', color: '#555' }}>Contenu</label>
                    <textarea
                        id="content"
                        name="content"
                        className="form-input"
                        placeholder="Partage ton expérience..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        style={{ resize: 'vertical' }}
                    />

                    <label htmlFor="imageUrl" style={{ fontSize: '13px', color: '#555' }}>Image (URL)</label>
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        className="form-input"
                        placeholder="https://..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Publication...' : 'Publier'}
                    </button>

                </form>
            </section>
        </main>
    );
};

export default CreatePostPage;