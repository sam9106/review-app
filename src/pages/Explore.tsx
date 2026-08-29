import React, { useEffect, useState } from 'react';
import type { Review } from '../types';
import { getNowPlayingMovies, getImageUrl } from '../services/tmdb';
import type { TMDBMovie } from '../services/tmdb';
import { Compass, Calendar, Film, Star } from 'lucide-react';

interface ExploreProps {
  reviews: Review[];
  onSelectFilm: (filmId: number) => void;
  onSelectUser?: (userId: string) => void;
}

export const Explore: React.FC<ExploreProps> = ({ reviews, onSelectFilm, onSelectUser }) => {
  const [nowPlaying, setNowPlaying] = useState<TMDBMovie[]>([]);
  const [releasedThisWeek, setReleasedThisWeek] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour gérer l'effet de survol en React
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null);
  const [hoveredReviewId, setHoveredReviewId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchExploreData = async () => {
      setLoading(true);
      const playing = await getNowPlayingMovies();
      setNowPlaying(playing.slice(0, 8));
      setReleasedThisWeek(playing.slice(8, 12));
      setLoading(false);
    };
    fetchExploreData();
  }, []);

  const getAppRating = (filmId: number) => {
    const filmReviews = reviews.filter((r) => Number(r.filmId) === filmId && r.rating);
    if (filmReviews.length === 0) return null;
    const sum = filmReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / filmReviews.length).toFixed(1);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.pageTitle}>
          <Compass size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Explorer
        </h2>

        {/* Section : Actuellement au cinéma */}
        <section style={styles.section}>
          <h3 style={styles.sectionHeading}><Film size={18} /> Actuellement au cinéma</h3>
          {loading ? (
            <p style={styles.loadingText}>Chargement des films...</p>
          ) : (
            <div style={styles.moviesGrid}>
              {nowPlaying.map((movie) => {
                const appRating = getAppRating(movie.id);
                const isHovered = hoveredMovieId === movie.id;
                return (
                  <div 
                    key={movie.id} 
                    style={{
                      ...styles.movieCard,
                      transform: isHovered ? 'translateY(-6px)' : 'translateY(0)'
                    }} 
                    onMouseEnter={() => setHoveredMovieId(movie.id)}
                    onMouseLeave={() => setHoveredMovieId(null)}
                    onClick={() => onSelectFilm(movie.id)}
                  >
                    <div style={{
                      ...styles.posterWrapper,
                      borderColor: isHovered ? 'var(--accent-purple)' : 'var(--border-color)',
                      boxShadow: isHovered 
                        ? '0 0 25px rgba(168, 85, 247, 0.4), 0 10px 25px rgba(0,0,0,0.6)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.4)'
                    }}>
                      <img src={getImageUrl(movie.poster_path, 'w342')} alt={movie.title} style={styles.cardPoster} />
                    </div>
                    <span style={{
                      ...styles.cardTitle,
                      color: isHovered ? 'var(--accent-purple)' : 'var(--text-main)'
                    }}>
                      {movie.title}
                    </span>
                    <div style={styles.ratingsContainer}>
                      <div style={styles.ratingRow} title="Note TMDB">
                        <Star size={12} color="#ef4444" fill="#ef4444" />
                        <span style={styles.cardSub}>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                      {appRating && (
                        <div style={styles.ratingRow} title="Note ReviewHub">
                          <Star size={12} color="#ef4444" fill="#ef4444" />
                          <span style={styles.appRatingText}>{appRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section : Sortis cette semaine */}
        <section style={styles.section}>
          <h3 style={styles.sectionHeading}><Calendar size={18} /> Sortis cette semaine</h3>
          {loading ? (
            <p style={styles.loadingText}>Chargement des nouveautés...</p>
          ) : (
            <div style={styles.moviesGrid}>
              {releasedThisWeek.map((movie) => {
                const appRating = getAppRating(movie.id);
                const isHovered = hoveredMovieId === movie.id;
                return (
                  <div 
                    key={movie.id} 
                    style={{
                      ...styles.movieCard,
                      transform: isHovered ? 'translateY(-6px)' : 'translateY(0)'
                    }} 
                    onMouseEnter={() => setHoveredMovieId(movie.id)}
                    onMouseLeave={() => setHoveredMovieId(null)}
                    onClick={() => onSelectFilm(movie.id)}
                  >
                    <div style={{
                      ...styles.posterWrapper,
                      borderColor: isHovered ? 'var(--accent-purple)' : 'var(--border-color)',
                      boxShadow: isHovered 
                        ? '0 0 25px rgba(168, 85, 247, 0.4), 0 10px 25px rgba(0,0,0,0.6)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.4)'
                    }}>
                      <img src={getImageUrl(movie.poster_path, 'w342')} alt={movie.title} style={styles.cardPoster} />
                    </div>
                    <span style={{
                      ...styles.cardTitle,
                      color: isHovered ? 'var(--accent-purple)' : 'var(--text-main)'
                    }}>
                      {movie.title}
                    </span>
                    <div style={styles.ratingsContainer}>
                      <div style={styles.ratingRow} title="Note TMDB">
                        <Star size={12} color="#ef4444" fill="#ef4444" />
                        <span style={styles.cardSub}>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                      {appRating && (
                        <div style={styles.ratingRow} title="Note ReviewHub">
                          <Star size={12} color="#ef4444" fill="#ef4444" />
                          <span style={styles.appRatingText}>{appRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section : Dernières critiques */}
        <section style={styles.section}>
          <h3 style={styles.sectionHeading}>Dernières critiques de la communauté</h3>
          <div style={styles.reviewsList}>
            {reviews.slice(0, 5).map((rev) => {
              const isReviewHovered = hoveredReviewId === rev.id;
              return (
                <div 
                  key={rev.id} 
                  style={{
                    ...styles.reviewSnippet,
                    borderColor: isReviewHovered ? 'var(--accent-purple)' : 'var(--border-color)',
                    boxShadow: isReviewHovered ? '0 0 15px rgba(168, 85, 247, 0.2)' : 'none',
                    transform: isReviewHovered ? 'translateX(4px)' : 'translateX(0)'
                  }}
                  onMouseEnter={() => setHoveredReviewId(rev.id)}
                  onMouseLeave={() => setHoveredReviewId(null)}
                  onClick={() => onSelectFilm(Number(rev.filmId))}
                >
                  <div style={styles.snippetHeader}>
                    <span style={styles.snippetAuthor} onClick={(e) => { e.stopPropagation(); onSelectUser && onSelectUser(rev.user.id); }}>
                      {rev.user.name}
                    </span>
                    <span style={styles.snippetFilm}>sur <strong>{rev.filmTitle}</strong></span>
                  </div>
                  <p style={styles.snippetText}>{rev.content}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: { width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', alignItems: 'center' },
  container: { width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px 32px 60px 32px', boxSizing: 'border-box' },
  pageTitle: { fontSize: '1.5rem', fontWeight: 'bold' },
  section: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' },
  sectionHeading: { fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' },
  loadingText: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  
  moviesGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
    gap: '24px', 
    width: '100%',
    justifyContent: 'center',
    justifyItems: 'center'
  },
  
  movieCard: { 
    width: '160px', 
    cursor: 'pointer', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px',
    transition: 'transform 0.25s ease'
  },
  
  posterWrapper: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    transition: 'all 0.25s ease',
    backgroundColor: 'var(--bg-card)'
  },

  cardPoster: { width: '100%', height: '240px', objectFit: 'cover', display: 'block' },
  cardTitle: { fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.2s ease' },
  ratingsContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '4px' },
  cardSub: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  appRatingText: { fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' },
  
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' },
  reviewSnippet: { 
    backgroundColor: 'var(--bg-card)', 
    padding: '16px', 
    borderRadius: '14px', 
    border: '1px solid var(--border-color)', 
    cursor: 'pointer', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px', 
    width: '100%', 
    boxSizing: 'border-box',
    transition: 'all 0.25s ease'
  },
  snippetHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' },
  snippetAuthor: { fontWeight: 'bold', color: 'var(--accent-purple)', cursor: 'pointer' },
  snippetFilm: { fontSize: '0.8rem' },
  snippetText: { fontSize: '0.95rem', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
};