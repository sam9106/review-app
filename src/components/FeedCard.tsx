import React, { useState } from 'react';
import type { FeedItem } from '../types';
import { ReviewCard } from './ReviewCard';
import { Bookmark, Star, UserPlus, Heart, MessageCircle, Send } from 'lucide-react';

interface FeedCardProps {
  item: FeedItem;
  onSelectFilm: (filmId: string | any) => void;
  onSelectUser: (userId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ item, onSelectFilm, onSelectUser, onDeleteReview }) => {
  // États locaux pour les interactions (Likes et Commentaires)
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(342); // Valeur d'exemple ou basée sur ton item
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentsList, setCommentsList] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'Thomas', text: 'Entièrement d’accord avec toi !', time: 'Il y a 10 min' }
  ]);
  const [newCommentText, setNewCommentText] = useState<string>('');

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      user: 'Moi',
      text: newCommentText.trim(),
      time: 'À l\'instant'
    };

    setCommentsList([...commentsList, newComment]);
    setNewCommentText('');
  };

  if (item.type === 'review' && item.review) {
    return (
      <ReviewCard 
        review={item.review} 
        onSelectFilm={onSelectFilm} 
        onSelectUser={onSelectUser} 
        onDeleteReview={onDeleteReview}
      />
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <img 
          src={item.user.avatar} 
          alt={item.user.name} 
          style={styles.avatar} 
          onClick={() => onSelectUser(item.user.id)}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={styles.userName} onClick={() => onSelectUser(item.user.id)}>
              {item.user.name}
            </span>
            {item.user.isVerified && <span style={styles.verifiedBadge}>✓</span>}
          </div>
          <span style={styles.time}>{item.createdAt}</span>
        </div>
      </div>

      <div style={styles.body}>
        {item.type === 'watchlist' && item.film && (
          <div style={styles.actionRow}>
            <Bookmark size={18} color="var(--accent-purple)" />
            <p style={styles.actionText}>
              A ajouté <span onClick={() => onSelectFilm(item.film)} style={styles.filmLink}>{item.film.title}</span> à sa liste <b>"{item.listName || 'À voir'}"</b>.
            </p>
          </div>
        )}

        {item.type === 'rating' && item.film && (
          <div style={styles.ratingContainer}>
            <div style={styles.ratingLeft}>
              <Star size={18} color="#eab308" fill="#eab308" style={{ flexShrink: 0 }} />
              <span style={styles.actionText}>
                A noté <span onClick={() => onSelectFilm(item.film)} style={styles.filmLink}>{item.film.title}</span>
              </span>
            </div>
            <div style={styles.scoreBadge}>
              {item.rating}/10
            </div>
          </div>
        )}

        {item.type === 'follow' && (
          <div style={styles.actionRow}>
            <UserPlus size={18} color="#22c55e" />
            <p style={styles.actionText}>
              A commencé à suivre ton profil.
            </p>
          </div>
        )}
      </div>

      {/* Barre d'interaction : Likes & Commentaires */}
      <div style={styles.interactionBar}>
        <div style={styles.interactionItem} onClick={handleLikeToggle}>
          <Heart 
            size={18} 
            color={isLiked ? '#ef4444' : 'var(--text-muted)'} 
            fill={isLiked ? '#ef4444' : 'none'} 
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }} 
          />
          <span style={{ color: isLiked ? '#ef4444' : 'var(--text-muted)', fontWeight: isLiked ? 'bold' : 'normal' }}>
            {likesCount}
          </span>
        </div>

        <div style={styles.interactionItem} onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          <span style={{ color: 'var(--text-muted)' }}>
            {commentsList.length}
          </span>
        </div>
      </div>

      {/* Section Commentaires déroulante */}
      {showComments && (
        <div style={styles.commentsSection}>
          <div style={styles.commentsList}>
            {commentsList.map(comment => (
              <div key={comment.id} style={styles.commentItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={styles.commentUser}>{comment.user}</span>
                  <span style={styles.commentTime}>{comment.time}</span>
                </div>
                <p style={styles.commentText}>{comment.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} style={styles.commentForm}>
            <input 
              type="text" 
              placeholder="Écrire un commentaire..." 
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              style={styles.commentInput}
            />
            <button type="submit" style={styles.commentSubmitButton}>
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: { 
    backgroundColor: 'var(--bg-card)', 
    border: '1px solid var(--border-color)', 
    borderRadius: '16px', 
    padding: '16px', 
    marginBottom: '12px' 
  },
  header: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    marginBottom: '12px' 
  },
  avatar: { 
    width: '38px', 
    height: '38px', 
    borderRadius: '50%', 
    objectFit: 'cover', 
    cursor: 'pointer' 
  },
  userName: { 
    fontWeight: 'bold', 
    fontSize: '0.9rem', 
    color: 'var(--text-main)', 
    cursor: 'pointer' 
  },
  verifiedBadge: { 
    color: '#3b82f6', 
    fontSize: '0.8rem', 
    fontWeight: 'bold' 
  },
  time: { 
    fontSize: '0.75rem', 
    color: 'var(--text-muted)' 
  },
  body: { 
    fontSize: '0.9rem', 
    color: 'var(--text-main)' 
  },
  actionRow: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px' 
  },
  actionText: { 
    margin: 0, 
    color: 'var(--text-main)' 
  },
  filmLink: { 
    color: 'var(--accent-purple)', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
  },
  ratingContainer: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start', // <-- Aligne tout vers la gauche
    width: '100%',
    gap: '12px', // <-- Contrôle l'espace exact entre le titre "Interstellar" et le badge "9/10"
    padding: '6px 0'
  },
  ratingLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  scoreBadge: { 
    backgroundColor: '#000000', 
    color: '#22c55e', 
    padding: '4px 12px 3px 12px', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    fontSize: '0.85rem', 
    border: '1px solid var(--border-color)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    flexShrink: 0
  },
  interactionBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '14px',
    paddingTop: '10px',
    borderTop: '1px solid var(--border-color)',
    fontSize: '0.85rem'
  },
  interactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  commentsSection: {
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: '1px dashed var(--border-color)'
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
    maxHeight: '150px',
    overflowY: 'auto'
  },
  commentItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem'
  },
  commentUser: {
    fontWeight: 'bold',
    color: 'var(--text-main)',
    fontSize: '0.8rem'
  },
  commentTime: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
  },
  commentText: {
    margin: 0,
    color: 'var(--text-main)',
    fontSize: '0.85rem'
  },
  commentForm: {
    display: 'flex',
    gap: '8px'
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '6px 10px',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    outline: 'none'
  },
  commentSubmitButton: {
    backgroundColor: 'var(--accent-purple)',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '0 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};