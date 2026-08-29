const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Force update cache v2
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const searchTMDBMovies = async (query: string): Promise<TMDBMovie[]> => {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Erreur TMDB Search:', error);
    return [];
  }
};

// Alias pour compatibilité
export const searchMovies = searchTMDBMovies;

export const getTMDBMovieDetails = async (movieId: string | number) => {
  try {
    const [detailsRes, creditsRes, releaseDatesRes] = await Promise.all([
      fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR&append_to_response=videos`),
      fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`),
      fetch(`${BASE_URL}/movie/${movieId}/release_dates?api_key=${API_KEY}`)
    ]);

    const data = await detailsRes.json();
    const credits = await creditsRes.json();
    const releaseDatesData = await releaseDatesRes.json();
    
    const trailer = data.videos?.results?.find(
      (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );

    let certification = 'Tous publics';
    const frRelease = releaseDatesData.results?.find((r: any) => r.iso_3166_1 === 'FR');
    if (frRelease && frRelease.release_dates) {
      const certItem = frRelease.release_dates.find((d: any) => d.certification && d.certification !== '');
      if (certItem) {
        certification = certItem.certification.startsWith('-') ? certItem.certification : `-${certItem.certification}`;
      }
    }

    const director = credits.crew?.find((person: any) => person.job === 'Director')?.name || 'Inconnu';
    const cast = credits.cast?.slice(0, 3).map((actor: any) => actor.name).join(', ') || 'Non spécifié';

    return {
      id: String(data.id),
      title: data.title,
      posterUrl: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : '',
      backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '',
      releaseDate: data.release_date || 'N/A',
      runtime: data.runtime ? `${data.runtime} min` : 'N/A',
      voteAverage: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
      overview: data.overview,
      genres: data.genres?.map((g: any) => g.name) || [],
      director,
      cast,
      certification,
      youtubeId: trailer ? trailer.key : null,
    };
  } catch (error) {
    console.error('Erreur TMDB Details:', error);
    return null;
  }
};

export const getNowPlayingMovies = async (): Promise<TMDBMovie[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Erreur Now Playing:', error);
    return [];
  }
};

export const getUpcomingMovies = async (): Promise<TMDBMovie[]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Erreur Upcoming:', error);
    return [];
  }
};