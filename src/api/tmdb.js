import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_THEMOVIEDB_API_KEY,
    language: 'pt-BR'
  }
});

export default {
  getPopularMovies(page = 1) {
    return apiClient.get('/movie/popular', {
      params: {
        page,
        include_adult: false,
        language: 'pt-BR'
      }
    });
  },
  getMoviesBySearch(query, page = 1) {
    return apiClient.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
        language: 'pt-BR'
      }
    });
  },
  getGenres() {
    return apiClient.get('/genre/movie/list', {
      params: {
        language: 'pt-BR'
      }
    });
  },
  getMoviesByGenre(genreId, page = 1) {
    return apiClient.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        language: 'pt-BR',
        sort_by: 'popularity.desc'
      }
    });
  }
}; 