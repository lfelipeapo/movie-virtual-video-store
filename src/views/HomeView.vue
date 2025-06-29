<template>
  <div class="home-view">
    <div v-if="loading" class="movie-grid grid gap-2 md:gap-4">
      <div v-for="n in 8" :key="n" class="movie-card skeleton-card">
        <div class="poster-wrapper skeleton-poster"></div>
        <div class="details">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
        <div class="skeleton skeleton-btn"></div>
      </div>
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
.skeleton-card {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 350px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.skeleton-poster {
  width: 100%;
  height: 220px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  border-radius: 8px;
  animation: skeleton-loading 1.2s infinite linear;
}
.skeleton {
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  border-radius: 4px;
  animation: skeleton-loading 1.2s infinite linear;
}
.skeleton-title {
  width: 70%;
  height: 20px;
  margin-bottom: 0.5rem;
}
.skeleton-text {
  width: 100%;
  height: 14px;
  margin-bottom: 0.3rem;
}
.skeleton-text.short {
  width: 50%;
}
.skeleton-btn {
  width: 100%;
  height: 36px;
  margin-top: 1rem;
}
@keyframes skeleton-loading {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
.loading-spinner, .error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
</style> 