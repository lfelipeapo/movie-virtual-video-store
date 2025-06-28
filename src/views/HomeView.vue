<template>
  <div class="home-view">
    <div v-if="loading" class="loading-spinner">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
    <div v-else-if="error" class="error-message">
      <p>Ocorreu um erro ao buscar os filmes.</p>
    </div>
    <div v-else class="movie-grid grid gap-2 md:gap-4">
      <MovieCard 
        v-for="movie in filteredMovies" 
        :key="movie.id" 
        :movie="movie" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import MovieCard from '../components/MovieCard.vue';
import tmdb from '../api/tmdb';

const store = useStore();
const allMovies = ref([]);
const loading = ref(true);
const error = ref(null);

const searchQuery = computed(() => store.state.searchQuery);

const filteredMovies = computed(() => {
  if (!searchQuery.value) {
    return allMovies.value;
  }
  return allMovies.value.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(async () => {
  try {
    const response = await tmdb.getPopularMovies();
    allMovies.value = response.data.results.map(movie => ({
      ...movie,
      price: parseFloat((Math.random() * (89.99 - 19.99) + 19.99).toFixed(2))
    }));
  } catch (err) {
    console.error(err);
    error.value = err;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
.loading-spinner, .error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
</style> 