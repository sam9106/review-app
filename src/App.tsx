import { useState, useEffect } from 'react';
import { ReviewCard } from './components/ReviewCard';
import { MOCK_REVIEWS, CURRENT_USER } from './data/mockData';
import { Navbar } from './components/Navbar';
import { FeedCard } from './components/FeedCard';
import { CreateReviewModal } from './components/CreateReviewModal';
import { FilmDetail } from './pages/FilmDetail';
import { UserProfile } from './pages/UserProfile';
import { Explore } from './pages/Explore';
import { getTMDBMovieDetails, searchMovies, searchTMDBMovies, type TMDBMovie } from './services/tmdb';
import type { Review, FeedItem } from './types';
import { ArrowLeft, Star } from 'lucide-react';

// Composant interne pour afficher la page de résultats complète
interface SearchResultsViewProps {
  query: string;
  onSelectFilm: (movieId: number) => void;
  onBack: () => void;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({ query, onSelectFilm, onBack }) => {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const results = await searchTMDBMovies(query);
      setMovies(results);
      setLoading(false);
    };
    fetchResults();
  }, [query]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content' }}>
        <ArrowLeft size={18} /> Retour
      </button>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Résultats de recherche pour : "{query}"
      </h2>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Chargement des résultats...</p>
      ) : movies.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Aucun film trouvé pour cette recherche.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              onClick={() => onSelectFilm(movie.id)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster'} 
                alt={movie.title}
                style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-color)' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {movie.title}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Star size={12} color="#ef4444" fill="#ef4444" />
                <span>{movie.vote_average?.toFixed(1) || '0.0'}</span>
                <span>•</span>
                <span>{movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function App() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string | null>(null); // État pour la page de résultats de recherche
  const [selectedFilmId, setSelectedFilmId] = useState<string | null>(null);
  const [selectedFilmData, setSelectedFilmData] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filmToReview, setFilmToReview] = useState<any>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: 'act_1',
      type: 'watchlist',
      user: { 
        id: 'u2', 
        username: 'thomas_m', 
        name: 'Thomas', 
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
        bio: 'Passionné de SF',
        isVerified: true,
        isVerifiedReviewer: false,
        followersCount: 142,
        followingCount: 85
      },
      createdAt: 'Il y a 30 min',
      film: { 
        id: '335984', 
        slug: 'blade-runner-2049',
        title: 'Blade Runner 2049', 
        year: 2017,
        director: 'Denis Villeneuve',
        posterUrl: '',
        bannerUrl: '',
        synopsis: '',
        ratingAverage: 9.1,
        reviewsCount: 34,
        recommendPercentage: 95,
        whereToWatch: []
      },
      listName: 'Chefs-d’œuvre sci-fi'
    },
    {
      id: 'act_2',
      type: 'rating',
      user: { 
        id: 'u3', 
        username: 'sarah_c', 
        name: 'Sarah M.', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        bio: 'Cinéphile nocturne',
        isVerified: false,
        isVerifiedReviewer: true,
        followersCount: 320,
        followingCount: 210
      },
      createdAt: 'Il y a 1 heure',
      film: { 
        id: '157336', 
        slug: 'interstellar',
        title: 'Interstellar', 
        year: 2014,
        director: 'Christopher Nolan',
        posterUrl: '',
        bannerUrl: '',
        synopsis: '',
        ratingAverage: 9.3,
        reviewsCount: 128,
        recommendPercentage: 98,
        whereToWatch: []
      },
      rating: 9
    },
    ...MOCK_REVIEWS.map((rev): FeedItem => ({
      id: String(rev.id),
      type: 'review',
      user: rev.user,
      createdAt: rev.createdAt,
      review: rev,
    })),
    {
      id: 'act_4',
      type: 'follow',
      user: { 
        id: 'u2', 
        username: 'thomas_m', 
        name: 'Thomas', 
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
        bio: 'Passionné de SF',
        isVerified: true,
        isVerifiedReviewer: false,
        followersCount: 142,
        followingCount: 85
      },
      createdAt: 'Il y a 2 jours'
    }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectTMDBMovie = async (movieId: number) => {
    setSearchQuery(null); // Quitte la page de recherche si on sélectionne un film
    const details = await getTMDBMovieDetails(movieId);
    if (details) {
      setSelectedFilmData(details);
      setSelectedFilmId(String(details.id));
      setSelectedUserId(null);
    }
  };

  const handleSelectMovieIdentifier = async (identifier: string | number | any) => {
    setSearchQuery(null);
    if (identifier && typeof identifier === 'object') {
      if (identifier.id) {
        await handleSelectTMDBMovie(Number(identifier.id));
      }
      return;
    }

    if (!isNaN(Number(identifier))) {
      await handleSelectTMDBMovie(Number(identifier));
      return;
    }

    const mockFilmMap: Record<string, number> = {
      'Interstellar': 157336,
      'Blade Runner 2049': 335984,
    };

    const cleanId = String(identifier).trim();
    const tmdbId = mockFilmMap[cleanId];
    
    if (tmdbId) {
      await handleSelectTMDBMovie(tmdbId);
    } else {
      const searchResults = await searchMovies(cleanId);
      if (searchResults && searchResults.length > 0) {
        await handleSelectTMDBMovie(searchResults[0].id);
      } else {
        setSelectedFilmData({
          title: cleanId,
          releaseDate: '2023',
          runtime: '120 min',
          director: 'Inconnu',
          voteAverage: 'N/A',
          overview: 'Film issu d’une critique de la communauté.',
          genres: ['Cinéma'],
          posterUrl: 'https://via.placeholder.com/300x450?text=No+Poster',
          backdropUrl: 'https://via.placeholder.com/1200x600?text=No+Poster'
        });
        setSelectedFilmId(cleanId);
        setSelectedUserId(null);
      }
    }
  };

  const handleDeleteReview = (reviewId: string | number) => {
    const updatedReviews = reviews.filter((r: any) => String(r.id || r._id) !== String(reviewId));
    setReviews(updatedReviews);
    setFeedItems((prev) => prev.filter((item) => item.id !== String(reviewId)));
  };

  return (
    <div style={styles.appContainer}>
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setSearchQuery(null);
          setSelectedFilmId(null);
          setSelectedFilmData(null);
          setSelectedUserId(null);
          setCurrentTab(tab);
        }} 
        onSelectMovie={(movieId) => handleSelectTMDBMovie(movieId)}
        onOpenCreateModal={() => {
          setFilmToReview(null);
          setIsModalOpen(true);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        onSearchSubmit={(query) => {
          setSelectedFilmId(null);
          setSelectedUserId(null);
          setSearchQuery(query); // Déclenche l'affichage de la page complète de recherche
        }}
      />

      <main style={styles.mainContent}>
        {searchQuery ? (
          <div style={styles.centeredWrapper}>
            <SearchResultsView 
              query={searchQuery} 
              onSelectFilm={(movieId) => handleSelectTMDBMovie(movieId)} 
              onBack={() => setSearchQuery(null)} 
            />
          </div>
        ) : selectedFilmId ? (
          <FilmDetail 
            filmId={String(selectedFilmId)} 
            filmData={selectedFilmData}
            reviews={reviews} 
            onBack={() => {
              setSelectedFilmId(null);
              setSelectedFilmData(null);
            }} 
            onSelectFilm={(filmId) => handleSelectMovieIdentifier(filmId)}
            onSelectUser={(userId) => setSelectedUserId(userId)} 
            onOpenCreateModalForFilm={(filmObj) => {
              setFilmToReview(filmObj);
              setIsModalOpen(true);
            }}
            onDeleteReview={handleDeleteReview}
          />
        ) : currentTab === 'profile' ? (
          <div style={styles.centeredWrapper}>
            <UserProfile 
              user={CURRENT_USER} 
              reviews={reviews} 
              onSelectFilm={(filmId) => handleSelectMovieIdentifier(filmId)} 
            />
          </div>
        ) : selectedUserId ? (
          <div style={styles.centeredWrapper}>
            <UserProfile 
              user={reviews.find((r) => r.user?.id === selectedUserId)?.user || CURRENT_USER} 
              reviews={reviews} 
              onSelectFilm={(filmId) => handleSelectMovieIdentifier(filmId)} 
            />
          </div>
        ) : currentTab === 'home' ? (
          <div style={styles.centeredWrapper}>
            <div style={styles.feed}>
              <h2 style={styles.pageTitle}>Flux d'activités</h2>
              {feedItems.map((item) => (
                <FeedCard 
                  key={item.id} 
                  item={item} 
                  onSelectFilm={(filmId) => handleSelectMovieIdentifier(filmId || 'Film')} 
                  onSelectUser={(userId) => setSelectedUserId(userId)} 
                  onDeleteReview={handleDeleteReview}
                />
              ))}
            </div>
          </div>
        ) : (
          <Explore 
            reviews={reviews}
            onSelectFilm={(filmId) => handleSelectMovieIdentifier(filmId)}
            onSelectUser={(userId) => setSelectedUserId(userId)}
          />
        )}
      </main>

      {isModalOpen && (
        <CreateReviewModal 
          initialFilm={filmToReview}
          onClose={() => {
            setIsModalOpen(false);
            setFilmToReview(null);
          }} 
          onSubmit={(data: any) => {
            const newReview: Review = {
              ...data,
              id: `r_${Date.now()}`,
              userId: CURRENT_USER.id,
              user: CURRENT_USER,
              likesCount: 0,
              commentsCount: 0,
              createdAt: "À l'instant",
            };
            setReviews([newReview, ...reviews]);
            setFeedItems((prev) => [
              {
                id: String(newReview.id),
                type: 'review',
                user: CURRENT_USER,
                createdAt: "À l'instant",
                review: newReview,
              },
              ...prev,
            ]);
            setIsModalOpen(false);
            setFilmToReview(null);
          }} 
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appContainer: { 
    backgroundColor: 'var(--bg-main)', 
    minHeight: '100vh', 
    color: 'var(--text-main)', 
    fontFamily: 'sans-serif', 
    boxSizing: 'border-box',
    width: '100%',
    overflowX: 'hidden'
  },
  mainContent: { 
    width: '100%', 
    minHeight: 'calc(100vh - 70px)', 
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center' // Centre le contenu globalement comme sur X
  },
  // La largeur fixe centrée standardisée pour toutes les vues du site
  centeredWrapper: { 
    width: '100%', 
    maxWidth: '1200px', // Largeur idéale pour aérer sans étirer à l'extrême
    margin: '0 auto', 
    padding: '24px 32px', 
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  feed: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' },
  pageTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }
};

export default App;