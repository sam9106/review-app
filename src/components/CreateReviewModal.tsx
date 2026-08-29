import React, { useState, useEffect } from 'react';
import { searchMovies, getImageUrl, type TMDBMovie } from '../services/tmdb';
import { X, Search, ThumbsUp, ThumbsDown, Plus, Minus } from 'lucide-react';

interface CreateReviewModalProps {
  initialFilm?: any;
  onClose: () => void;
  onSubmit: (reviewData: any) => void;
}

export const CreateReviewModal: React.FC<CreateReviewModalProps> = ({ initialFilm, onClose, onSubmit }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  
  const [selectedMovie, setSelectedMovie] = useState<any>(initialFilm || null);

  const [rating, setRating] = useState(8);
  const [isRecommended, setIsRecommended] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [strengthsInput, setStrengthsInput] = useState('');
  const [weaknessesInput, setWeaknessesInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const results = await searchMovies(query);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie) return;

    const targetFilmId = String(selectedMovie.id);

    // 1. Récupérer les critiques existantes (depuis le localStorage)
    const existingReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');

    // 2. Vérifier si une critique existe déjà pour ce film
    const alreadyReviewed = existingReviews.some(
      (r: any) => String(r.tmdbId || r.filmId || r.film?.id) === targetFilmId
    );

    if (alreadyReviewed) {
      alert("Vous avez déjà publié une critique pour ce film. Vous ne pouvez en poster qu'une seule par œuvre.");
      return; // Bloque l'envoi
    }

    const strengths = strengthsInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const weaknesses = weaknessesInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    onSubmit({
      tmdbId: selectedMovie.id,
      filmTitle: selectedMovie.title,
      filmPoster: getImageUrl(selectedMovie.poster_path || selectedMovie.posterUrl, 'w500'),
      filmYear: (selectedMovie.release_date || selectedMovie.releaseDate || '').split('-')[0] || 'N/A',
      rating,
      isRecommended,
      title,
      content,
      strengths,
      weaknesses,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Publier une critique</h2>
          <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
        </div>

        {!selectedMovie ? (
          <div>
            <div style={styles.searchBox}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Chercher un film..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                style={styles.searchInput}
                autoFocus
              />
            </div>

            <div style={styles.resultsList}>
              {searchResults.map((movie) => (
                <div 
                  key={movie.id} 
                  onClick={() => setSelectedMovie(movie)}
                  style={styles.movieItem}
                >
                  <img src={getImageUrl(movie.poster_path, 'w185')} alt={movie.title} style={styles.thumb} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{movie.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {movie.release_date?.split('-')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.selectedBanner}>
              <img src={getImageUrl(selectedMovie.poster_path || selectedMovie.posterUrl, 'w185')} style={{ width: 45, borderRadius: 6 }} alt="" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{selectedMovie.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(selectedMovie.release_date || selectedMovie.releaseDate || '').split('-')[0]}</div>
              </div>
              {!initialFilm && (
                <button type="button" onClick={() => setSelectedMovie(null)} style={styles.changeBtn}>Changer</button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={styles.label}>
                Note (/10)
                <input type="number" min="0" max="10" step="0.5" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} style={styles.input} />
              </label>

              <label style={styles.label}>
                Recommandé ?
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setIsRecommended(true)} style={{ ...styles.toggleBtn, backgroundColor: isRecommended ? '#10b981' : 'var(--bg-main)' }}>
                    <ThumbsUp size={16} />
                  </button>
                  <button type="button" onClick={() => setIsRecommended(false)} style={{ ...styles.toggleBtn, backgroundColor: !isRecommended ? '#ef4444' : 'var(--bg-main)' }}>
                    <ThumbsDown size={16} />
                  </button>
                </div>
              </label>
            </div>

            <label style={styles.label}>
              Titre de l'avis
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} placeholder="Ex: Une claque visuelle !" />
            </label>

            <label style={styles.label}>
              Critique
              <textarea required rows={3} value={content} onChange={(e) => setContent(e.target.value)} style={styles.input} placeholder="Ton avis détaillé..." />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={styles.label}>
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={14} /> Points forts
                </span>
                <input 
                  type="text" 
                  value={strengthsInput} 
                  onChange={(e) => setStrengthsInput(e.target.value)} 
                  style={styles.input} 
                  placeholder="Musique, Jeu d'acteurs..." 
                />
                <span style={styles.hint}>Séparés par une virgule</span>
              </label>

              <label style={styles.label}>
                <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Minus size={14} /> Points faibles
                </span>
                <input 
                  type="text" 
                  value={weaknessesInput} 
                  onChange={(e) => setWeaknessesInput(e.target.value)} 
                  style={styles.input} 
                  placeholder="Rythme lent, Fin..." 
                />
                <span style={styles.hint}>Séparés par une virgule</span>
              </label>
            </div>

            <button type="submit" style={styles.submitBtn}>Publier</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '480px', border: '1px solid var(--border-color)', color: 'var(--text-main)', maxHeight: '90vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px' },
  searchInput: { background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '0.95rem' },
  resultsList: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', maxHeight: '300px', overflowY: 'auto' },
  movieItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--bg-main)' },
  thumb: { width: '40px', height: '56px', borderRadius: '4px', objectFit: 'cover' },
  selectedBanner: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-main)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' },
  changeBtn: { background: 'none', border: 'none', color: 'var(--accent-purple)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' },
  label: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 'bold' },
  input: { backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 10px', color: 'var(--text-main)', outline: 'none' },
  hint: { fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' },
  toggleBtn: { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  submitBtn: { backgroundColor: 'var(--accent-purple)', color: '#fff', border: 'none', padding: '12px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }
};