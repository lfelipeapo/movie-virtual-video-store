<template>
  <div class="home-view">
    <div v-if="loading && allMovies.length === 0" class="movie-grid grid gap-2 md:gap-4">
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
    <div v-else>
      <!-- Filtros -->
      <div class="filters-container">
        <div class="filter-group">
          <label for="genre-filter" class="filter-label">Gênero:</label>
          <select 
            id="genre-filter"
            v-model="selectedGenre" 
            @change="filterByGenre"
            class="genre-select"
          >
            <option value="">Todos os gêneros</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.id">
              {{ genre.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="filteredMovies.length > 0" class="movie-grid grid gap-2 md:gap-4">
        <MovieCard 
          v-for="(movie, index) in filteredMovies" 
          :key="generateUniqueKey(movie, index)" 
          :movie="movie" 
        />
      </div>
      
      <!-- Mensagem quando não há resultados na pesquisa -->
      <div v-else-if="searchQuery && searchQuery.length > 0" class="no-results">
        <div class="no-results-content">
          <div class="no-results-icon">🔍</div>
          <h3>Nenhum filme encontrado</h3>
          <p>Não encontramos filmes para "{{ searchQuery }}"</p>
          <div class="no-results-suggestions">
            <p>Tente:</p>
            <ul>
              <li>Verificar a ortografia</li>
              <li>Usar termos mais gerais</li>
              <li>Procurar por gênero ou ano</li>
            </ul>
          </div>
          <button @click="clearSearch" class="clear-search-btn" type="button">
            <i class="pi pi-times"></i>
            Limpar pesquisa
          </button>
        </div>
      </div>
      
      <!-- Paginação -->
      <div v-if="!loading && !error && paginationInfo.showPagination" class="pagination-container">
        <div class="pagination-info">
          <span v-if="paginationInfo.isSearch">
            {{ paginationInfo.totalResults }} {{ paginationInfo.totalResults === 1 ? 'filme encontrado' : 'filmes encontrados' }} para "{{ searchQuery }}"
          </span>
          <span v-else>
            Página {{ paginationInfo.currentPage }} de {{ paginationInfo.totalPages }}
          </span>
          <span v-if="!paginationInfo.isSearch">
            {{ paginationInfo.totalResults }} filmes no total
          </span>
        </div>
        
        <div v-if="!paginationInfo.isSearch && paginationInfo.totalPages > 1" class="pagination-controls">
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage <= 1"
            class="pagination-btn"
          >
            <i class="pi pi-chevron-left"></i>
            Anterior
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="pageNum in visiblePages" 
              :key="pageNum"
              @click="goToPage(pageNum)"
              :class="['page-btn', { active: pageNum === currentPage }]"
            >
              {{ pageNum }}
            </button>
          </div>
          
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage >= totalPages"
            class="pagination-btn"
          >
            Próxima
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
        
        <div v-else-if="paginationInfo.isSearch && filteredMovies.length === 0" class="no-results">
          <p>Nenhum filme encontrado para "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import MovieCard from '../components/MovieCard.vue';
import tmdb from '../api/tmdb';
import debounce from "lodash/debounce";

const store = useStore();
const allMovies = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const totalResults = ref(0);
const genres = ref([]);
const selectedGenre = ref('');

// Função para gerar chave única para cada filme
const generateUniqueKey = (movie, index) => {
  return `movie-${movie.id}-${index}-${movie.title?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`;
};

const searchQuery = computed(() => store.state.searchQuery);

const filteredMovies = computed(() => {
  return allMovies.value;
});

// Calcular paginação baseada nos filmes filtrados
const paginationInfo = computed(() => {
  if (!searchQuery.value && !selectedGenre.value) {
    return {
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalResults: totalResults.value,
      showPagination: true,
      isSearch: false
    };
  } else {
    return {
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalResults: totalResults.value,
      showPagination: true,
      isSearch: true
    };
  }
});

// Calcular páginas visíveis na paginação
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  const totalPages = paginationInfo.value.totalPages;
  
  if (totalPages <= 1) return [];
  
  let start = Math.max(1, paginationInfo.value.currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const loadMovies = async (pageNum = 1) => {
  try {
    let response;
    
    if (searchQuery.value) {
      response = await tmdb.getMoviesBySearch(searchQuery.value, pageNum);
    } else if (selectedGenre.value) {
      response = await tmdb.getMoviesByGenre(selectedGenre.value, pageNum);
    } else {
      response = await tmdb.getPopularMovies(pageNum);
    }
    
    const newMovies = response.data.results.map(movie => ({
      ...movie,
      price: parseFloat((Math.random() * (89.99 - 19.99) + 19.99).toFixed(2))
    }));
    
    allMovies.value = newMovies;
    totalPages.value = response.data.total_pages;
    totalResults.value = response.data.total_results;
  } catch (err) {
    console.error('Erro ao carregar filmes:', err);
    error.value = err;
  }
};

const goToPage = async (pageNum) => {
  if (pageNum < 1 || pageNum > totalPages.value) return;
  
  currentPage.value = pageNum;
  await loadMovies(pageNum);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const loadGenres = async () => {
  try {
    const response = await tmdb.getGenres();
    genres.value = response.data.genres;
  } catch (err) {
    console.error('Erro ao carregar gêneros:', err);
  }
};

const filterByGenre = async () => {
  currentPage.value = 1;
  await loadMovies(1);
};

onMounted(async () => {
  try {
    await loadGenres();
    await loadMovies(1);
  } finally {
    loading.value = false;
  }
});

// Reset paginação quando mudar a busca
watch(searchQuery, async (newQuery, oldQuery) => {
  if (newQuery !== oldQuery) {
    currentPage.value = 1;
    await loadMovies(1);
  }
});

// Reset paginação quando mudar o gênero
watch(selectedGenre, async (newGenre, oldGenre) => {
  if (newGenre !== oldGenre) {
    currentPage.value = 1;
    await loadMovies(1);
  }
});

const clearSearch = async () => {
  store.dispatch('clearSearch');
  currentPage.value = 1;
  await loadMovies(1);
};

</script>

<style scoped>
/* Garantir que o scroll funcione quando sidebar estiver aberta */
:deep(.p-drawer-mask) {
  overflow: auto !important;
}

:deep(.p-drawer) {
  overflow: auto !important;
}

/* Manter scroll da página principal */
body {
  overflow: auto !important;
}

html {
  overflow: auto !important;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (min-width: 768px) {
  .movie-grid {
    gap: 0.5rem;
    padding: 0.5rem;
  }
}

@media (max-width: 767px) {
  .movie-grid {
    gap: 1rem;
    padding: 0.5rem;
  }
}

.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  gap: 1rem;
}

.pagination-info {
  display: flex;
  gap: 2rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-color-secondary);
}

.no-results-content {
  max-width: 500px;
  margin: 0 auto;
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.no-results h3 {
  color: var(--text-color);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.no-results p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.no-results-suggestions {
  text-align: left;
  margin-bottom: 2rem;
}

.no-results-suggestions p {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.no-results-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.no-results-suggestions li {
  padding: 0.25rem 0;
  color: var(--text-color-secondary);
  position: relative;
  padding-left: 1.5rem;
}

.no-results-suggestions li::before {
  content: "•";
  color: var(--primary-color);
  font-weight: bold;
  position: absolute;
  left: 0;
}

.clear-search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  font-size: 1rem;
  min-height: 44px;
  user-select: none;
  outline: none;
}

.clear-search-btn:hover {
  background: #0056b3;
}

.clear-search-btn:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.clear-search-btn:active {
  transform: scale(0.98);
}

.clear-search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  background-color: var(--surface-card);
  color: var(--text-color);
  border: 1px solid var(--surface-border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--surface-hover);
  border-color: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  background-color: var(--surface-card);
  color: var(--text-color);
  border: 1px solid var(--surface-border);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--surface-hover);
  border-color: var(--primary-color);
}

.page-btn.active {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  border-color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .page-numbers {
    order: -1;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .no-results {
    padding: 2rem 1rem;
  }
  
  .no-results-content {
    padding: 1.5rem;
  }
  
  .no-results h3 {
    font-size: 1.25rem;
  }
  
  .no-results p {
    font-size: 1rem;
  }
}

.filters-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
}

.genre-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  background: var(--surface-ground);
  color: var(--text-color);
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.genre-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.genre-select:hover {
  border-color: var(--surface-hover);
}

@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .genre-select {
    min-width: auto;
  }
}
</style> 