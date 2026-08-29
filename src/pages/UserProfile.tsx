import React, { useState, useEffect } from 'react';
import type { Review, User } from '../types';
import { ReviewCard } from '../components/ReviewCard';
import { User as UserIcon, Film, Popcorn, ListMusic, Bookmark, Heart } from 'lucide-react';

interface UserProfileProps {
  user: User;
  reviews: Review[];
  onSelectFilm: (filmId: number) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, reviews, onSelectFilm }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'watched' | 'favorites' | 'watchlist' | 'playlists'>('reviews');
  const [watchedFilms, setWatchedFilms] = useState<any[]>([]);
  const [favoriteFilms, setFavoriteFilms] = useState<any[]>([]);
  const [watchlistFilms, setWatchlistFilms] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([
    { id: '1', title: "Chefs-d'œuvre sci-fi", count: 4 },
    { id: '2', title: "À voir d'urgence", count: 12 }
  ]);

  // États pour gérer dynamiquement les survols (effets "hover" en React inline)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [hoveredMovieId, setHoveredMovieId] = useState<number | string | null>(null);
  const [hoveredPlaylistId, setHoveredPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    // Chargement des listes depuis le localStorage
    const watched = JSON.parse(localStorage.getItem('user_watched_films') || '[]');
    setWatchedFilms(watched);

    const favorites = JSON.parse(localStorage.getItem('user_favorite_films') || '[]');
    setFavoriteFilms(favorites);

    const watchlist = JSON.parse(localStorage.getItem('user_watchlist') || '[]');
    setWatchlistFilms(watchlist);
  }, []);

  const userReviews = reviews.filter((r) => r.user?.id === user.id || r.userId === user.id);

  return (
    <div style={styles.container}>
      <div style={styles.headerCard}>
        <div style={styles.avatarContainer}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}><UserIcon size={32} /></div>
          )}
        </div>
        <div style={styles.userInfo}>
          <h2 style={styles.userName}>{user.name}</h2>
          <span style={styles.userHandle}>{user.handle || '@membre'}</span>
          <p style={styles.userBio}>{user.bio || 'Passionné de cinéma et de critiques.'}</p>
        </div>
      </div>

      {/* STATS ROW : 5 colonnes pour intégrer les favoris avec style */}
      <div style={styles.statsRow}>
        <div 
          onClick={() => setActiveTab('reviews')} 
          style={{ 
            ...styles.statBox, 
            borderColor: activeTab === 'reviews' || hoveredStat === 'reviews' ? 'var(--accent-purple)' : 'var(--border-color)',
            backgroundColor: activeTab === 'reviews' ? 'rgba(168, 85, 247, 0.1)' : 'var(--bg-card)',
            transform: hoveredStat === 'reviews' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredStat === 'reviews' ? '0 0 15px rgba(168, 85, 247, 0.3)' : 'none'
          }}
          onMouseEnter={() => setHoveredStat('reviews')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <Film size={18} color="var(--accent-purple)" />
          <span style={styles.statCount}>{userReviews.length}</span>
          <span style={styles.statLabel}>Critiques</span>
        </div>

        <div 
          onClick={() => setActiveTab('watched')} 
          style={{ 
            ...styles.statBox, 
            borderColor: activeTab === 'watched' || hoveredStat === 'watched' ? '#f59e0b' : 'var(--border-color)',
            backgroundColor: activeTab === 'watched' ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-card)',
            transform: hoveredStat === 'watched' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredStat === 'watched' ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none'
          }}
          onMouseEnter={() => setHoveredStat('watched')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <Popcorn size={18} color="#f59e0b" />
          <span style={styles.statCount}>{watchedFilms.length}</span>
          <span style={styles.statLabel}>Films vus</span>
        </div>

        <div 
          onClick={() => setActiveTab('favorites')} 
          style={{ 
            ...styles.statBox, 
            borderColor: activeTab === 'favorites' || hoveredStat === 'favorites' ? '#ef4444' : 'var(--border-color)',
            backgroundColor: activeTab === 'favorites' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)',
            transform: hoveredStat === 'favorites' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredStat === 'favorites' ? '0 0 15px rgba(239, 68, 68, 0.3)' : 'none'
          }}
          onMouseEnter={() => setHoveredStat('favorites')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <Heart size={18} color="#ef4444" fill="#ef4444" />
          <span style={styles.statCount}>{favoriteFilms.length}</span>
          <span style={styles.statLabel}>Favoris</span>
        </div>

        <div 
          onClick={() => setActiveTab('watchlist')} 
          style={{ 
            ...styles.statBox, 
            borderColor: activeTab === 'watchlist' || hoveredStat === 'watchlist' ? 'var(--accent-purple)' : 'var(--border-color)',
            backgroundColor: activeTab === 'watchlist' ? 'rgba(168, 85, 247, 0.1)' : 'var(--bg-card)',
            transform: hoveredStat === 'watchlist' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredStat === 'watchlist' ? '0 0 15px rgba(168, 85, 247, 0.3)' : 'none'
          }}
          onMouseEnter={() => setHoveredStat('watchlist')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <Bookmark size={18} color="var(--accent-purple)" />
          <span style={styles.statCount}>{watchlistFilms.length}</span>
          <span style={styles.statLabel}>Watchlist</span>
        </div>

        <div 
          onClick={() => setActiveTab('playlists')} 
          style={{ 
            ...styles.statBox, 
            borderColor: activeTab === 'playlists' || hoveredStat === 'playlists' ? '#3b82f6' : 'var(--border-color)',
            backgroundColor: activeTab === 'playlists' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
            transform: hoveredStat === 'playlists' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredStat === 'playlists' ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none'
          }}
          onMouseEnter={() => setHoveredStat('playlists')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <ListMusic size={18} color="#3b82f6" />
          <span style={styles.statCount}>{playlists.length}</span>
          <span style={styles.statLabel}>Playlists</span>
        </div>
      </div>

      {/* CONTENU SELON L'ONGLET ACTIF */}
      {activeTab === 'reviews' && (
        <>
          <h3 style={styles.sectionTitle}>Publications de {user.name}</h3>
          <div style={styles.feed}>
            {userReviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Aucune publication pour le moment.</p>
            ) : (
              userReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  onSelectFilm={(id) => onSelectFilm(Number(id))} 
                />
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'watched' && (
        <>
          <h3 style={styles.sectionTitle}>Films marqués comme vus ({watchedFilms.length})</h3>
          {watchedFilms.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Aucun film marqué comme vu pour l'instant.</p>
          ) : (
            <div style={styles.moviesGrid}>
              {watchedFilms.map((film) => {
                const isHovered = hoveredMovieId === film.id;
                return (
                  <div 
                    key={film.id} 
                    style={{
                      ...styles.movieCard,
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
                    }} 
                    onClick={() => onSelectFilm(Number(film.id))}
                    onMouseEnter={() => setHoveredMovieId(film.id)}
                    onMouseLeave={() => setHoveredMovieId(null)}
                  >
                    <img 
                      src={film.posterUrl || 'https://via.placeholder.com/130x190?text=No+Image'} 
                      alt={film.title} 
                      style={{
                        ...styles.moviePoster,
                        boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.5)' : 'none',
                        borderColor: isHovered ? 'var(--accent-purple)' : 'transparent'
                      }} 
                    />
                    <span style={{
                      ...styles.movieCardTitle,
                      color: isHovered ? 'var(--accent-purple)' : 'var(--text-main)'
                    }}>{film.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'favorites' && (
        <>
          <h3 style={styles.sectionTitle}>Films favoris ({favoriteFilms.length})</h3>
          {favoriteFilms.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Aucun film ajouté aux favoris pour le moment.</p>
          ) : (
            <div style={styles.moviesGrid}>
              {favoriteFilms.map((film) => {
                const isHovered = hoveredMovieId === film.id;
                return (
                  <div 
                    key={film.id} 
                    style={{
                      ...styles.movieCard,
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
                    }} 
                    onClick={() => onSelectFilm(Number(film.id))}
                    onMouseEnter={() => setHoveredMovieId(film.id)}
                    onMouseLeave={() => setHoveredMovieId(null)}
                  >
                    <img 
                      src={film.posterUrl || 'https://via.placeholder.com/130x190?text=No+Image'} 
                      alt={film.title} 
                      style={{
                        ...styles.moviePoster,
                        boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.5)' : 'none',
                        borderColor: isHovered ? '#ef4444' : 'transparent'
                      }} 
                    />
                    <span style={{
                      ...styles.movieCardTitle,
                      color: isHovered ? '#ef4444' : 'var(--text-main)'
                    }}>{film.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'watchlist' && (
        <>
          <h3 style={styles.sectionTitle}>Ma Watchlist ({watchlistFilms.length})</h3>
          {watchlistFilms.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Votre watchlist est vide pour le moment.</p>
          ) : (
            <div style={styles.moviesGrid}>
              {watchlistFilms.map((film) => {
                const isHovered = hoveredMovieId === film.id;
                return (
                  <div 
                    key={film.id} 
                    style={{
                      ...styles.movieCard,
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
                    }} 
                    onClick={() => onSelectFilm(Number(film.id))}
                    onMouseEnter={() => setHoveredMovieId(film.id)}
                    onMouseLeave={() => setHoveredMovieId(null)}
                  >
                    <img 
                      src={film.posterUrl || 'https://via.placeholder.com/130x190?text=No+Image'} 
                      alt={film.title} 
                      style={{
                        ...styles.moviePoster,
                        boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.5)' : 'none',
                        borderColor: isHovered ? 'var(--accent-purple)' : 'transparent'
                      }} 
                    />
                    <span style={{
                      ...styles.movieCardTitle,
                      color: isHovered ? 'var(--accent-purple)' : 'var(--text-main)'
                    }}>{film.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'playlists' && (
        <>
          <h3 style={styles.sectionTitle}>Playlists de films ({playlists.length})</h3>
          <div style={styles.playlistsGrid}>
            {playlists.map((playlist) => {
              const isHovered = hoveredPlaylistId === playlist.id;
              return (
                <div 
                  key={playlist.id} 
                  style={{
                    ...styles.playlistCard,
                    borderColor: isHovered ? '#3b82f6' : 'var(--border-color)',
                    boxShadow: isHovered ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                  onMouseEnter={() => setHoveredPlaylistId(playlist.id)}
                  onMouseLeave={() => setHoveredPlaylistId(null)}
                >
                  <div style={styles.playlistHeader}>
                    <ListMusic size={20} color="#3b82f6" />
                    <span style={{
                      ...styles.playlistTitle,
                      color: isHovered ? '#3b82f6' : 'var(--text-main)'
                    }}>{playlist.title}</span>
                  </div>
                  <span style={styles.playlistCount}>{playlist.count} films</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px', width: '100%' },
  headerCard: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' },
  avatarContainer: { width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', flexShrink: '0' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', backgroundColor: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  userInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  userName: { fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 },
  userHandle: { fontSize: '0.85rem', color: 'var(--text-muted)' },
  userBio: { fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' },
  
  // Grille de statistiques sur 5 colonnes pour s'adapter parfaitement
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' },
  statBox: { backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'all 0.25s ease' },
  statCount: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' },
  statLabel: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  
  sectionTitle: { fontSize: '1.1rem', fontWeight: 'bold', marginTop: '10px' },
  feed: { display: 'flex', flexDirection: 'column', gap: '16px' },
  moviesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' },
  movieCard: { display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer', transition: 'transform 0.25s ease' },
  moviePoster: { width: '100%', height: '210px', borderRadius: '10px', objectFit: 'cover', backgroundColor: 'var(--bg-card)', border: '2px solid transparent', transition: 'all 0.25s ease' },
  movieCardTitle: { fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.2s ease' },

  playlistsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  playlistCard: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer', transition: 'all 0.25s ease' },
  playlistHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  playlistTitle: { fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', transition: 'color 0.2s ease' },
  playlistCount: { fontSize: '0.8rem', color: 'var(--text-muted)' }
};