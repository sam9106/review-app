import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, Compass, User, PlusCircle, Sun, Moon, Loader2, Star } from 'lucide-react';
import { searchTMDBMovies, type TMDBMovie } from '../services/tmdb';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSelectMovie: (movieId: number) => void;
  onOpenCreateModal: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onSearchSubmit: (query: string) => void; // Nouvelle prop pour basculer vers la page de résultats
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onSelectMovie,
  onOpenCreateModal,
  theme,
  toggleTheme,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await searchTMDBMovies(query);
      setResults(data.slice(0, 6));
      setLoading(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestion de la touche Entrée pour afficher la page de résultats
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      setIsOpen(false);          // Ferme le dropdown de suggestions
      onSearchSubmit(query.trim()); // Appelle la fonction pour afficher la page complète
    }
  };

  return (
    <header style={styles.header}>
      <div 
        style={styles.logoGroup} 
        onClick={() => setCurrentTab('home')}
        title="Retour à l'accueil"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '0.5px' }}>
          <span style={{ color: '#ffffff' }}>REVIEW</span>
          <span style={{ color: '#22c55e' }}>HUB</span>
        </div>
        <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', backgroundColor: '#22c55e', borderRadius: '2px' }} />
        </div>
      </div>

      <div style={styles.searchContainer} ref={searchRef}>
        <Search size={18} color="var(--text-muted)" style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Rechercher un film sur TMDB..."
          value={query}
          onFocus={() => query.trim() && setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.searchInput}
        />
        {loading && <Loader2 size={16} style={styles.loaderIcon} />}

        {isOpen && results.length > 0 && (
          <div style={styles.dropdown}>
            {results.map((movie) => (
              <div
                key={movie.id}
                style={styles.dropdownItem}
                onClick={() => {
                  onSelectMovie(movie.id);
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : 'https://via.placeholder.com/40x60?text=No+Image'
                  }
                  alt={movie.title}
                  style={styles.thumbPoster}
                />
                <div style={styles.itemInfo}>
                  <span style={styles.movieTitle}>{movie.title}</span>
                  <span style={styles.movieSub}>
                    {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'} 
                    <span style={{ margin: '0 6px', color: 'var(--text-muted)' }}>•</span>
                    <span style={styles.ratingWrapper}>
                      <Star size={12} color="#ef4444" fill="#ef4444" />
                      <span>{movie.vote_average?.toFixed(1) || '0.0'}</span>
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.navActions}>
        <button
          style={{ ...styles.navBtn, color: currentTab === 'home' ? 'var(--accent-purple)' : 'var(--text-muted)' }}
          onClick={() => setCurrentTab('home')}
        >
          <Home size={18} />
          <span>Accueil</span>
        </button>

        <button
          style={{ ...styles.navBtn, color: currentTab === 'explore' ? 'var(--accent-purple)' : 'var(--text-muted)' }}
          onClick={() => setCurrentTab('explore')}
        >
          <Compass size={18} />
          <span>Explorer</span>
        </button>

        <button
          style={{ ...styles.navBtn, color: currentTab === 'profile' ? 'var(--accent-purple)' : 'var(--text-muted)' }}
          onClick={() => setCurrentTab('profile')}
        >
          <User size={18} />
          <span>Profil</span>
        </button>

        <button onClick={toggleTheme} style={styles.themeBtn} title="Changer de thème">
          {theme === 'dark' ? <Sun size={18} color="var(--text-muted)" /> : <Moon size={18} color="var(--text-muted)" />}
        </button>

        <button style={styles.publishBtn} onClick={onOpenCreateModal}>
          <PlusCircle size={18} />
          <span>Publier</span>
        </button>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 },
  logoGroup: { 
    cursor: 'pointer', 
    userSelect: 'none', 
    display: 'inline-flex', 
    flexDirection: 'column', 
    backgroundColor: '#000000',
    padding: '8px 16px',         
    borderRadius: '24px',        
    border: '1px solid var(--border-color)' 
  },
  searchContainer: { position: 'relative', flex: 1, maxWidth: '420px', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '14px', pointerEvents: 'none' },
  loaderIcon: { position: 'absolute', right: '14px' },
  searchInput: { width: '100%', padding: '10px 36px 10px 42px', borderRadius: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem', outline: 'none' },
  dropdown: { position: 'absolute', top: '48px', left: 0, right: 0, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 12px 24px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 200 },
  dropdownItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' },
  thumbPoster: { width: '38px', height: '56px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' },
  movieTitle: { fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  movieSub: { fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' },
  ratingWrapper: { display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)', fontWeight: 500 },
  navActions: { display: 'flex', alignItems: 'center', gap: '14px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.88rem' },
  themeBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' },
  publishBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--accent-purple)', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.88rem', cursor: 'pointer' },
};