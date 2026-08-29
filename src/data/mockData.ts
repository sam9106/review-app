import type { Review, User } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Dupuis',
  handle: 'cinema_critic',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    user: CURRENT_USER,
    tmdbId: 157336,
    filmTitle: 'Interstellar',
    filmPoster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    filmYear: '2014',
    rating: 9.5,
    isRecommended: true,
    title: 'Une œuvre d\'art cosmique et émotionnelle',
    content: 'Nolan livre ici un chef-d\'œuvre absolu. La bande son de Hans Zimmer amplifie chaque moment de tension. Une claque visuelle et philosophique.',
    strengths: ['Bande originale magistrale', 'Mise en scène', 'Impact émotionnel puissant'],
    weaknesses: ['Quelques longueurs au milieu', 'Troisième acte clivant'],
    likesCount: 342,
    commentsCount: 28,
    createdAt: 'Il y a 2h',
  },
];