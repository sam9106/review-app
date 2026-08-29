import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Bookmark, Eye, Play, MessageSquarePlus, ExternalLink, Calendar, Heart } from 'lucide-react';
import { TrailerModal } from '../components/TrailerModal';
import { ReviewCard } from '../components/ReviewCard';
import type { Review } from '../types';

interface FilmDetailProps {
  filmId: string;
  filmData?: any;
  reviews: Review[];
  onBack: () => void;
  onSelectFilm?: (filmId: string | number) => void;
  onSelectUser?: (userId: string) => void;
  onOpenCreateModalForFilm?: (filmObj: { id: string | number; title: string; poster_path: string; release_date: string }) => void;
  onDeleteReview?: (reviewId: string | number) => void;
}

export const FilmDetail: React.FC<FilmDetailProps> = ({ 
  filmId, 
  filmData, 
  reviews = [], 
  onBack, 
  onSelectFilm,
  onSelectUser,
  onOpenCreateModalForFilm,
  onDeleteReview 
}) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  // États pour gérer dynamiquement les survols (effets "hover" en React inline)
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredPlatform, setHoveredPlatform] = useState<number | null>(null);

  const title = filmData?.title || 'Film';
  const posterUrl = filmData?.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster';
  const backdropUrl = filmData?.backdropUrl || posterUrl;
  const releaseDate = filmData?.releaseDate || 'N/A';
  const runtime = filmData?.runtime || 'N/A';
  const director = filmData?.director || 'Inconnu';
  const cast = filmData?.cast || 'Acteurs principaux';
  const certification = filmData?.certification || 'Tous publics';
  
  const ratingValue = filmData?.voteAverage || 'N/A';
  
  const overview = filmData?.overview || 'Aucun synopsis disponible.';
  const genres = filmData?.genres || [];
  const youtubeId = filmData?.youtubeId;

  const releaseYear = releaseDate !== 'N/A' ? releaseDate.split('-')[0] : 'N/A';
  const primaryGenre = genres.length > 0 ? genres[0] : 'Film';

  const isReleased = releaseDate !== 'N/A' && new Date(releaseDate) <= new Date();

  const filmReviews = reviews.filter((r) => {
    const matchesId = r.tmdbId && String(r.tmdbId) === String(filmId);
    const matchesTitle = r.filmTitle && title && r.filmTitle.toLowerCase() === title.toLowerCase();
    return matchesId || matchesTitle;
  });

  // Vérification robuste basée sur l'auteur
  const currentUsername = 'Alex Dupuis';
  const hasAlreadyReviewed = filmReviews.some((r) => {
    const authorName = r.user_name || r.user?.name;
    return authorName && authorName.toLowerCase() === currentUsername.toLowerCase();
  });

  const validReviewsWithRating = filmReviews.filter(r => typeof r.rating === 'number' && !isNaN(r.rating));
  const communityRating = validReviewsWithRating.length > 0 
    ? (validReviewsWithRating.reduce((acc, r) => acc + r.rating, 0) / validReviewsWithRating.length).toFixed(1) 
    : null;

  const communityPercent = communityRating ? Math.round(Number(communityRating) * 10) : 0;

  const streamingPlatforms = [
    { name: 'Netflix', type: 'Streaming', url: '#', price: 'Abonnement' },
    { name: 'Prime Video', type: 'SVOD / Achat', url: '#', price: 'Inclus ou dès 2,99 €' },
    { name: 'Apple TV+', type: 'Location', url: '#', price: 'Dès 4,99 €' }
  ];

  useEffect(() => {
    const watchedList = JSON.parse(localStorage.getItem('user_watched_films') || '[]');
    setIsWatched(watchedList.some((f: any) => String(f.id) === String(filmId)));

    const favoriteList = JSON.parse(localStorage.getItem('user_favorite_films') || '[]');
    setIsFavorite(favoriteList.some((f: any) => String(f.id) === String(filmId)));
  }, [filmId]);

  const toggleWatched = () => {
    if (!isReleased) return;
    const watchedList = JSON.parse(localStorage.getItem('user_watched_films') || '[]');
    let updated;
    if (isWatched) {
      updated = watchedList.filter((f: any) => String(f.id) !== String(filmId));
    } else {
      updated = [...watchedList, { id: filmId, title, posterUrl, releaseDate }];
    }
    localStorage.setItem('user_watched_films', JSON.stringify(updated));
    setIsWatched(!isWatched);
  };

  const toggleFavorite = () => {
    const favoriteList = JSON.parse(localStorage.getItem('user_favorite_films') || '[]');
    let updated;
    if (isFavorite) {
      updated = favoriteList.filter((f: any) => String(f.id) !== String(filmId));
    } else {
      updated = [...favoriteList, { id: filmId, title, posterUrl, releaseDate }];
    }
    localStorage.setItem('user_favorite_films', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <button 
          onClick={onBack} 
          style={{
            ...styles.backBtn,
            color: hoveredBtn === 'back' ? 'var(--accent-purple)' : 'var(--text-muted)'
          }}
          onMouseEnter={() => setHoveredBtn('back')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <ArrowLeft size={18} /> Retour
        </button>

        <div 
          style={{ 
            ...styles.heroBanner, 
            backgroundImage: `linear-gradient(to bottom, rgba(15, 13, 23, 0.4), rgba(15, 13, 23, 0.95)), url(${backdropUrl})` 
          }}
        >
          <div style={styles.heroContent}>
            <img src={posterUrl} alt={title} style={styles.poster} />
            
            <div style={styles.heroInfo}>
              <h1 style={styles.title}>{title}</h1>

              <div style={styles.ratingsWrapper}>
                {isReleased ? (
                  <>
                    <div style={styles.ratingBadge} title="Note globale">
                      <Star size={16} color="#ef4444" fill="#ef4444" />
                      <span>{ratingValue}</span>
                    </div>
                    
                    {communityRating && (
                      <div style={styles.reviewHubBadge} title="Score de la communauté ReviewHub">
                        <div style={styles.reviewHubTop}>
                          <span style={styles.reviewHubLabel}>ReviewHub</span>
                          <span style={styles.reviewHubScore}>{communityPercent}%</span>
                        </div>
                        <div style={styles.progressBarBg}>
                          <div style={{ ...styles.progressBarFill, width: `${communityPercent}%` }} />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={styles.upcomingBadge}>
                    <Calendar size={16} color="#a855f7" />
                    <span>Sortie prévue le {new Date(releaseDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
              
              <div style={styles.vodMetaRow}>
                <span>{primaryGenre}</span>
                <span style={styles.dot}>•</span>
                <span>{runtime}</span>
                <span style={styles.dot}>•</span>
                <span>{releaseYear}</span>
                <span style={styles.dot}>•</span>
                <span style={{
                  ...styles.certBadge,
                  backgroundColor: certification !== 'Tous publics' ? '#b91c1c' : 'rgba(255,255,255,0.1)'
                }}>
                  {certification}
                </span>
              </div>

              <div style={styles.subMetaText}>
                <strong>Réalisateur :</strong> {director}
              </div>

              <div style={styles.subMetaText}>
                <strong>Casting :</strong> {cast}
              </div>

              <div style={styles.actionsRow}>
                {/* Bouton Bande-annonce (Semi-transparent / Glassmorphism) */}
                {youtubeId && (
                  <button 
                    onClick={() => setShowTrailer(true)} 
                    style={{
                      ...styles.trailerBtn,
                      backgroundColor: hoveredBtn === 'trailer' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.25)',
                      borderColor: hoveredBtn === 'trailer' ? '#a855f7' : 'rgba(168, 85, 247, 0.5)',
                      transform: hoveredBtn === 'trailer' ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: hoveredBtn === 'trailer' ? '0 0 20px rgba(168, 85, 247, 0.5)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredBtn('trailer')}
                    onMouseLeave={() => setHoveredBtn(null)}
                  >
                    <Play size={16} fill="#fff" /> Bande-annonce
                  </button>
                )}

                {/* Bouton Écrire une critique / Badge (Semi-transparent / Glassmorphism) */}
                {isReleased && onOpenCreateModalForFilm && (
                  hasAlreadyReviewed ? (
                    <div style={styles.alreadyReviewedBadge}>
                      ✓ Critique déjà rédigée
                    </div>
                  ) : (
                    <button 
                      onClick={() => onOpenCreateModalForFilm({
                        id: filmId,
                        title: title,
                        poster_path: posterUrl,
                        release_date: releaseDate
                      })} 
                      style={{
                        ...styles.reviewBtn,
                        backgroundColor: hoveredBtn === 'review' ? 'rgba(37, 99, 235, 0.4)' : 'rgba(37, 99, 235, 0.25)',
                        borderColor: hoveredBtn === 'review' ? '#3b82f6' : 'rgba(37, 99, 235, 0.5)',
                        transform: hoveredBtn === 'review' ? 'translateY(-2px)' : 'translateY(0)',
                        boxShadow: hoveredBtn === 'review' ? '0 0 20px rgba(37, 99, 235, 0.5)' : 'none'
                      }}
                      onMouseEnter={() => setHoveredBtn('review')}
                      onMouseLeave={() => setHoveredBtn(null)}
                    >
                      <MessageSquarePlus size={16} /> Écrire une critique
                    </button>
                  )
                )}

                {/* Bouton Favoris */}
                <button 
                  onClick={toggleFavorite} 
                  style={{ 
                    ...styles.actionIconBtn, 
                    backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-card)',
                    borderColor: isFavorite || hoveredBtn === 'favorite' ? '#ef4444' : 'var(--border-color)',
                    transform: hoveredBtn === 'favorite' ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hoveredBtn === 'favorite' ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredBtn('favorite')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart size={18} color={isFavorite ? '#ef4444' : 'var(--text-main)'} fill={isFavorite ? '#ef4444' : 'none'} />
                </button>

                {/* Bouton Déjà vu */}
                {isReleased && (
                  <button 
                    onClick={toggleWatched} 
                    style={{ 
                      ...styles.actionIconBtn, 
                      backgroundColor: isWatched ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-card)',
                      borderColor: isWatched || hoveredBtn === 'watched' ? '#10b981' : 'var(--border-color)',
                      transform: hoveredBtn === 'watched' ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: hoveredBtn === 'watched' ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredBtn('watched')}
                    onMouseLeave={() => setHoveredBtn(null)}
                    title={isWatched ? "Marquer comme non vu" : "Marquer comme vu"}
                  >
                    <Eye size={18} color={isWatched ? '#10b981' : 'var(--text-main)'} />
                  </button>
                )}

                {/* Bouton Watchlist */}
                <button 
                  onClick={() => setInWatchlist(!inWatchlist)} 
                  style={{ 
                    ...styles.actionIconBtn, 
                    backgroundColor: inWatchlist ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-card)',
                    borderColor: inWatchlist || hoveredBtn === 'watchlist' ? 'var(--accent-purple)' : 'var(--border-color)',
                    transform: hoveredBtn === 'watchlist' ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hoveredBtn === 'watchlist' ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredBtn('watchlist')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  title={inWatchlist ? "Retirer de la watchlist" : "Ajouter à la watchlist"}
                >
                  <Bookmark size={18} color={inWatchlist ? 'var(--accent-purple)' : 'var(--text-main)'} fill={inWatchlist ? 'var(--accent-purple)' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Synopsis</h3>
              <p style={styles.overview}>{overview}</p>
            </div>

            <div style={styles.affiliateContainer}>
              <h3 style={styles.affiliateTitle}>Où regarder ce film ?</h3>
              <p style={styles.affiliateSubtext}>Profite des offres de nos partenaires pour regarder {title} :</p>
              
              <div style={styles.platformsGrid}>
                {streamingPlatforms.map((platform, idx) => {
                  const isPlatformHovered = hoveredPlatform === idx;
                  return (
                    <a 
                      key={idx} 
                      href={platform.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        ...styles.platformCard,
                        borderColor: isPlatformHovered ? 'var(--accent-purple)' : 'var(--border-color)',
                        boxShadow: isPlatformHovered ? '0 0 15px rgba(168, 85, 247, 0.3)' : 'none',
                        transform: isPlatformHovered ? 'translateY(-2px)' : 'translateY(0)'
                      }}
                      onMouseEnter={() => setHoveredPlatform(idx)}
                      onMouseLeave={() => setHoveredPlatform(null)}
                    >
                      <div style={styles.platformInfo}>
                        <span style={{
                          ...styles.platformName,
                          color: isPlatformHovered ? 'var(--accent-purple)' : 'var(--text-main)'
                        }}>
                          {platform.name}
                        </span>
                        <span style={styles.platformDetails}>{platform.type} • {platform.price}</span>
                      </div>
                      <div style={styles.platformAction}>
                        <span>Visionner</span>
                        <ExternalLink size={14} />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                {isReleased ? `Critiques de la communauté (${filmReviews.length})` : 'Critiques (Indisponible)'}
              </h3>
              {!isReleased ? (
                <p style={{ color: 'var(--text-muted)' }}>Les critiques et notes sont désactivées tant que le film n'est pas sorti en salle.</p>
              ) : filmReviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Soyez le premier à donner votre avis sur ce film !</p>
              ) : (
                filmReviews.map((review) => (
                  <ReviewCard 
                    key={review.id} 
                    review={review} 
                    onSelectFilm={onSelectFilm} 
                    onSelectUser={onSelectUser} 
                    onDeleteReview={onDeleteReview}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {showTrailer && youtubeId && (
          <TrailerModal youtubeId={youtubeId} onClose={() => setShowTrailer(false)} />
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: { width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', alignItems: 'center' },
  container: { width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '28px', padding: '20px 32px 60px 32px', boxSizing: 'border-box' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content', transition: 'color 0.2s ease' },
  
  heroBanner: { width: '100%', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px', padding: '40px', display: 'flex', boxSizing: 'border-box' },
  heroContent: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', width: '100%', flexWrap: 'nowrap' },
  poster: { width: '240px', height: '360px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 10px 25px rgba(0,0,0,0.8)', flexShrink: 0 },
  heroInfo: { display: 'flex', flexDirection: 'column', gap: '14px', color: '#fff', flex: 1, minWidth: 0 },
  
  title: { fontSize: '3rem', fontWeight: 900, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)', width: '100%', lineHeight: '1.2' },
  
  ratingsWrapper: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  
  ratingBadge: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: '6px', 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    height: '42px', 
    padding: '0 14px', 
    borderRadius: '14px', 
    backdropFilter: 'blur(6px)', 
    border: '1px solid rgba(255, 255, 255, 0.1)', 
    fontWeight: 'bold', 
    fontSize: '0.95rem',
    boxSizing: 'border-box' 
  },
  
  upcomingBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(168, 85, 247, 0.15)', padding: '8px 16px', borderRadius: '20px', backdropFilter: 'blur(6px)', border: '1px solid rgba(168, 85, 247, 0.3)', fontWeight: 'bold', fontSize: '0.95rem', color: '#d8b4fe' },
  
  reviewHubBadge: { 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    gap: '4px', 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    height: '42px', 
    padding: '0 14px', 
    borderRadius: '14px', 
    backdropFilter: 'blur(6px)', 
    border: '1px solid rgba(255, 255, 255, 0.1)', 
    minWidth: '130px',
    boxSizing: 'border-box'
  },
  reviewHubTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' },
  reviewHubLabel: { fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' },
  reviewHubScore: { fontSize: '0.9rem', fontWeight: 'bold', color: '#4ade80' },
  progressBarBg: { width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '2px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: '2px', transition: 'width 0.4s ease' },

  vodMetaRow: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '1rem', color: '#cbd5e1', fontWeight: 500 },
  certBadge: { padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' },
  subMetaText: { fontSize: '0.95rem', color: '#94a3b8' },
  dot: { color: '#64748b', fontSize: '1rem' },
  actionsRow: { display: 'flex', gap: '12px', marginTop: '10px', alignItems: 'center', flexWrap: 'wrap' },
  
  trailerBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    color: '#fff', 
    backgroundColor: 'rgba(168, 85, 247, 0.25)', 
    border: '1px solid rgba(168, 85, 247, 0.5)', 
    padding: '12px 24px', 
    borderRadius: '20px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    fontSize: '0.95rem',
    backdropFilter: 'blur(6px)',
    transition: 'all 0.25s ease'
  },
  
  reviewBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    color: '#fff', 
    backgroundColor: 'rgba(37, 99, 235, 0.25)', 
    border: '1px solid rgba(37, 99, 235, 0.5)', 
    padding: '12px 24px', 
    borderRadius: '20px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    fontSize: '0.95rem',
    backdropFilter: 'blur(6px)',
    transition: 'all 0.25s ease'
  },

  alreadyReviewedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    padding: '12px 20px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  
  actionIconBtn: { 
    width: '44px', 
    height: '44px', 
    borderRadius: '50%', 
    border: '1px solid var(--border-color)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    cursor: 'pointer', 
    color: 'var(--text-main)', 
    transition: 'all 0.25s ease' 
  },
  
  contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start', width: '100%' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' },
  rightColumn: { display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' },

  affiliateContainer: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' },
  affiliateTitle: { margin: 0, fontSize: '1.25rem', fontWeight: 'bold' },
  affiliateSubtext: { fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 },
  platformsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '6px' },
  
  platformCard: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
    border: '1px solid var(--border-color)', 
    padding: '14px 16px', 
    borderRadius: '12px', 
    textDecoration: 'none', 
    color: 'var(--text-main)',
    transition: 'all 0.25s ease'
  },
  
  platformInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  platformName: { fontWeight: 'bold', fontSize: '0.95rem', transition: 'color 0.2s ease' },
  platformDetails: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  platformAction: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-purple)' },

  section: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' },
  sectionTitle: { margin: 0, fontSize: '1.35rem', fontWeight: 'bold' },
  overview: { lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }
};