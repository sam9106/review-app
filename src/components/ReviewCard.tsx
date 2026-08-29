import React from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Heart, Plus, Minus, CheckCircle2, Trash2 } from 'lucide-react';

interface ReviewCardProps {
  review: any;
  onSelectFilm?: (filmId: string) => void;
  onSelectUser?: (userId: string) => void;
  onDeleteReview?: (reviewId: string | number) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onSelectFilm, onSelectUser, onDeleteReview }) => {
  const username = review.user_name || review.user?.name || 'Alex Dupuis';
  const handle = review.user_handle || review.user?.handle || 'cinema_critic';
  const avatar = review.user_avatar || review.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  const isVerified = review.user?.isVerified ?? true;

  const poster = review.filmPoster || review.film_poster || review.film?.posterUrl || review.film?.poster;
  const title = review.filmTitle || review.film_title || review.film?.title;
  const year = review.filmYear || review.film_year || review.film?.year;
  
  const director = review.filmDirector || review.film_director || review.director || review.film?.director;
  const targetFilmId = review.filmId || review.film_id || review.tmdbId || review.film?.id;
  const reviewId = review.id || review._id;

  // Extraction et conversion de la note
  const rawRating = review.rating ?? 0;
  const ratingNum = typeof rawRating === 'number' ? rawRating : Number(rawRating) || 0;

  // Fonction de couleur selon le barème demandé (0-4 rouge, >4-7 orange, >7-10 vert)
  const getRatingColor = (val: number) => {
    if (val <= 4) return '#ef4444'; // Rouge
    if (val <= 7) return '#f97316'; // Orange
    return '#22c55e';                 // Vert
  };

  const currentRatingColor = getRatingColor(ratingNum);

  return (
    <div style={styles.card}>
      {/* En-tête Utilisateur + Bouton de suppression */}
      <div style={styles.header}>
        <img 
          src={avatar} 
          alt={username} 
          style={{ ...styles.avatar, cursor: 'pointer' }} 
          onClick={() => onSelectUser && onSelectUser(review.userId || review.user?.id)}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span 
              style={{ fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}
              onClick={() => onSelectUser && onSelectUser(review.userId || review.user?.id)}
            >
              {username}
            </span>
            {isVerified && (
              <CheckCircle2 size={15} color="#ffffff" fill="#1d9bf0" />
            )}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>@{handle}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {review.createdAt || "Il y a 2h"}
          </div>
        </div>

        {onDeleteReview && (
          <button 
            onClick={() => {
              if (window.confirm("Êtes-vous sûr de vouloir supprimer cette critique ? Cette action est irréversible.")) {
                onDeleteReview(reviewId);
              }
            }}
            style={styles.deleteBtn}
            title="Supprimer la critique"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Cartouche du Film cliquable */}
      <div 
        style={{ ...styles.movieBanner, cursor: 'pointer' }}
        onClick={() => {
          if (onSelectFilm && targetFilmId) {
            onSelectFilm(String(targetFilmId));
          }
        }}
        title="Voir la fiche du film"
      >
        <img src={poster} alt={title} style={styles.poster} />
        <div>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold' }}>{title} ({year})</h3>
          {director && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Réalisé par {director}
            </div>
          )}
        </div>
      </div>

      {/* Badges Note (étoile alignée + couleur dynamique) & Recommandation */}
      <div style={styles.badgeRow}>
        <span style={{ ...styles.ratingBadge, color: currentRatingColor }}>
          <Star size={15} fill={currentRatingColor} color={currentRatingColor} /> 
          <span>{ratingNum}/10</span>
        </span>
        {(review.is_recommended ?? review.isRecommended) ? (
          <span style={{ ...styles.recBadge, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <ThumbsUp size={13} /> RECOMMANDÉ
          </span>
        ) : (
          <span style={{ ...styles.recBadge, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <ThumbsDown size={13} /> NON RECOMMANDÉ
          </span>
        )}
      </div>

      <h4 style={styles.title}>{review.title}</h4>
      <p style={styles.content}>{review.content}</p>

      {/* Points Forts & Faibles */}
      <div style={styles.prosConsGrid}>
        {review.strengths && review.strengths.length > 0 && (
          <div style={styles.proBox}>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Points forts
            </span>
            <ul style={styles.list}>
              {review.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {review.weaknesses && review.weaknesses.length > 0 && (
          <div style={styles.conBox}>
            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Minus size={14} /> Points faibles
            </span>
            <ul style={styles.list}>
              {review.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <button style={styles.actionBtn}>
          <Heart size={16} /> <span>{review.likesCount || 342}</span>
        </button>
        <button style={styles.actionBtn}>
          <MessageSquare size={16} /> <span>{review.commentsCount || 28}</span>
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: { backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '18px', marginBottom: '16px', border: '1px solid var(--border-color)', color: 'var(--text-main)' },
  header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', position: 'relative' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
  deleteBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' },
  movieBanner: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-main)', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', border: '1px solid var(--border-color)' },
  poster: { width: '38px', height: '54px', borderRadius: '4px', objectFit: 'cover' },
  
  badgeRow: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' },
  ratingBadge: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '0.95rem' },
  
  // Correction ici : Centrage vertical et horizontal parfait de la cellule
  recBadge: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '6px', 
    padding: '0 12px', 
    height: '28px',
    borderRadius: '8px', 
    fontSize: '0.75rem', 
    fontWeight: 'bold',
    boxSizing: 'border-box'
  },

  title: { margin: '8px 0 4px 0', fontSize: '1.05rem', fontWeight: 'bold' },
  content: { margin: '0 0 14px 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.45' },
  prosConsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' },
  proBox: { backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' },
  conBox: { backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' },
  list: { margin: '6px 0 0 0', paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-main)' },
  footer: { display: 'flex', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' },
  actionBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }
};