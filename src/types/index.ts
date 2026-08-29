export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  isVerifiedReviewer: boolean;
  followersCount: number;
  followingCount: number;
}

export interface Film {
  id: string;
  slug: string;
  title: string;
  year: number;
  director: string;
  posterUrl: string;
  bannerUrl: string;
  synopsis: string;
  ratingAverage: number;
  reviewsCount: number;
  recommendPercentage: number;
  whereToWatch: { name: string; url: string }[];
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  filmId: string;
  film: Film;
  rating: number; // 0 - 10
  isRecommended: boolean; // YES / NO
  title: string;
  content: string;
  strengths: string[];
  weaknesses: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  isVerifiedReviewer: boolean;
  followersCount: number;
  followingCount: number;
}

export interface Film {
  id: string;
  slug: string;
  title: string;
  year: number;
  director: string;
  posterUrl: string;
  bannerUrl: string;
  synopsis: string;
  ratingAverage: number;
  reviewsCount: number;
  recommendPercentage: number;
  whereToWatch: { name: string; url: string }[];
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  filmId: string;
  film: Film;
  rating: number; // 0 - 10
  isRecommended: boolean; // YES / NO
  title: string;
  content: string;
  strengths: string[];
  weaknesses: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

// Nouveaux types pour enrichir le flux d'activités
export type ActivityType = 'review' | 'rating' | 'watchlist' | 'follow';

export interface FeedItem {
  id: string;
  type: ActivityType;
  user: User;
  createdAt: string;
  film?: Film; // Utilisé pour les notes rapides ou watchlists
  rating?: number; // Pour les notes sur 10 sans critique rédigée
  listName?: string; // Nom de la liste (ex: "À voir absolument")
  review?: Review; // Si c'est une critique complète
}