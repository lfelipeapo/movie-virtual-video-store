import { createStore } from 'vuex';

export default createStore({
  state: {
    cartItems: JSON.parse(localStorage.getItem('cart')) || [],
    favoriteItems: JSON.parse(localStorage.getItem('favorites')) || [],
    searchQuery: '',
  },
  mutations: {
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query;
    },
    ADD_TO_CART(state, movie) {
      const cartItem = state.cartItems.find(item => item.id === movie.id);
      if (cartItem) {
        cartItem.quantity++;
      } else {
        state.cartItems.push({ ...movie, quantity: 1 });
      }
    },
    REMOVE_FROM_CART(state, movieId) {
      state.cartItems = state.cartItems.filter(item => item.id !== movieId);
    },
    CLEAR_CART(state) {
      state.cartItems = [];
    },
    TOGGLE_FAVORITE(state, movie) {
      const index = state.favoriteItems.findIndex(item => item.id === movie.id);
      if (index > -1) {
        state.favoriteItems.splice(index, 1);
      } else {
        state.favoriteItems.push(movie);
      }
    },
    CLEAR_FAVORITES(state) {
      state.favoriteItems = [];
    },
    SET_MOVIES(state, movies) {
      state.movies = movies;
    },
    ADD_TO_FAVORITES(state, movie) {
      if (!state.favoriteItems.some(item => item.id === movie.id)) {
        state.favoriteItems.push(movie);
      }
    },
    REMOVE_FROM_FAVORITES(state, movieId) {
      state.favoriteItems = state.favoriteItems.filter(item => item.id !== movieId);
    }
  },
  actions: {
    updateSearchQuery({ commit }, query) {
      commit('SET_SEARCH_QUERY', query);
    },
    addToCart({ commit }, movie) {
      commit('ADD_TO_CART', movie);
    },
    removeFromCart({ commit }, movieId) {
      commit('REMOVE_FROM_CART', movieId);
    },
    clearCart({ commit }) {
      commit('CLEAR_CART');
    },
    toggleFavorite({ commit }, movie) {
      commit('TOGGLE_FAVORITE', movie);
    },
    clearFavorites({ commit }) {
      commit('CLEAR_FAVORITES');
    }
  },
  getters: {
    cartItems: (state) => state.cartItems,
    cartItemCount: (state) => state.cartItems.reduce((total, item) => total + item.quantity, 0),
    favoriteMovies: (state) => state.favoriteItems,
    favoriteCount: (state) => state.favoriteItems.length,
    isFavorite: (state) => (movieId) => state.favoriteItems.some((movie) => movie.id === movieId),
    cartTotal: (state) => {
      return state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
  },
  modules: {},
  plugins: [
    store => {
      store.subscribe((mutation, state) => {
        localStorage.setItem('cart', JSON.stringify(state.cartItems));
        localStorage.setItem('favorites', JSON.stringify(state.favoriteItems));
      });
    }
  ]
}); 