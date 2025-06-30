import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_THEMOVIEDB_API_KEY,
    language: 'pt-BR'
  }
});

export default {
  getPopularMovies(page = 1, perPage = 21) {
    return apiClient.get('/movie/popular', {
      params: { 
        page,
        'page_size': perPage
      }
    });
  }
}; 