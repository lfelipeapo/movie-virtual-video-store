<template>
  <div class="movie-card">
    <div class="poster-wrapper">
      <img :src="posterUrl" :alt="movie.title" class="poster-image" />
      <div class="favorite-icon" @click="toggleFavorite">
        <i class="pi" :class="isMovieFavorite ? 'pi-heart-fill' : 'pi-heart'"></i>
      </div>
    </div>
    <div class="details">
      <p class="release-date">{{ releaseDate }}</p>
      <h3 class="movie-title">{{ movie.title }}</h3>
      <div class="rating">
        <i class="pi pi-star-fill"></i>
        <span>{{ movie.vote_average }}</span>
      </div>
      <p class="price">R$ {{ movie.price ? movie.price.toFixed(2) : 'N/A' }}</p>
    </div>
    <button
      class="add-to-cart-button"
      @click="addToCart"
      v-tooltip.top="'Adicionar ao Carrinho'"
    >
      Adicionar
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const posterUrl = computed(() => {
  return props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=No+Image';
});

const releaseDate = computed(() => {
  if (!props.movie.release_date) return '';
  const [year, month, day] = props.movie.release_date.split('-');
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const isMovieFavorite = computed(() => store.getters.isFavorite(props.movie.id));

const addToCart = () => {
  store.dispatch('addToCart', props.movie);
};

const toggleFavorite = () => {
  store.dispatch('toggleFavorite', props.movie);
};
</script>

<style scoped>
.movie-card {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--surface-card);
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: var(--text-color);
  transition: transform 0.2s;
}
.movie-card:hover {
    transform: translateY(-5px);
}
.poster-wrapper {
  position: relative;
}
.poster-image {
  width: 100%;
  height: auto;
  display: block;
}
.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0,0,0,0.3);
  color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.favorite-icon .pi-heart-fill {
    color: var(--primary-color);
}
.details {
  padding: 1rem;
  flex-grow: 1;
  text-align: left;
}
.release-date {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}
.movie-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color);
}
.rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-color-secondary);
}
.rating .pi-star-fill {
    color: #f59e0b; /* amber-500 */
}
.price {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  color: var(--text-color);
}
.add-to-cart-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.2s;
}
.add-to-cart-button:hover {
    filter: brightness(90%);
}
</style> 