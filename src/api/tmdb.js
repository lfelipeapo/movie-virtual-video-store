import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'ed865d2ec156b7f40699a70c7342b22e',
    language: 'pt-BR'
  }
});

export default {
  getPopularMovies() {
    return apiClient.get('/movie/popular');
  }
}; 