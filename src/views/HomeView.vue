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
      <div class="movie-grid grid gap-2 md:gap-4">
        <MovieCard 
          v-for="movie in filteredMovies" 
          :key="movie.id" 
          :movie="movie" 
        />
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
            :disabled="currentPage <= 1 || loadingMore"
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
              :disabled="loadingMore"
            >
              {{ pageNum }}
            </button>
          </div>
          
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage >= totalPages || loadingMore"
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
      
      <!-- Loading spinner para carregar mais -->
      <div v-if="loadingMore" class="loading-more">
        <div class="loading-spinner">
          <i class="pi pi-spin pi-spinner"></i>
          <span>Carregando filmes...</span>
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

const store = useStore();
const allMovies = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const totalResults = ref(0);

const searchQuery = computed(() => store.state.searchQuery);

const filteredMovies = computed(() => {
  if (!searchQuery.value) {
    return allMovies.value;
  }
  return allMovies.value.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Calcular paginação baseada nos filmes filtrados
const paginationInfo = computed(() => {
  const filteredCount = filteredMovies.value.length;
  
  if (!searchQuery.value) {
    // Sem pesquisa: usar dados da API
    return {
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalResults: totalResults.value,
      showPagination: true,
      isSearch: false
    };
  } else {
    // Com pesquisa: mostrar apenas contagem dos resultados filtrados
    return {
      currentPage: 1,
      totalPages: 1,
      totalResults: filteredCount,
      showPagination: filteredCount > 0,
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
    const response = await tmdb.getPopularMovies(pageNum);
    const newMovies = response.data.results.map(movie => ({
      ...movie,
      price: parseFloat((Math.random() * (89.99 - 19.99) + 19.99).toFixed(2))
    }));
    
    allMovies.value = newMovies;
    totalPages.value = response.data.total_pages;
    totalResults.value = response.data.total_results;
  } catch (err) {
    console.error(err);
    error.value = err;
  }
};

const goToPage = async (pageNum) => {
  if (pageNum < 1 || pageNum > totalPages.value || loadingMore.value) return;
  
  loadingMore.value = true;
  currentPage.value = pageNum;
  
  try {
    await loadMovies(pageNum);
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    loadingMore.value = false;
  }
};

onMounted(async () => {
  try {
    await loadMovies(1);
  } finally {
    loading.value = false;
  }
});

// Reset paginação quando mudar a busca
watch(searchQuery, async (newQuery, oldQuery) => {
  if (newQuery && newQuery !== oldQuery) {
    // Verificar e carregar mais filmes se necessário para a pesquisa
    await checkAndLoadMoreForSearch();
  }
});

// Função para carregar mais filmes
const loadMoreMovies = async () => {
  if (loadingMore.value || currentPage.value >= totalPages.value) return;
  
  loadingMore.value = true;
  currentPage.value++;
  
  try {
    const response = await tmdb.getPopularMovies(currentPage.value);
    const newMovies = response.data.results.map(movie => ({
      ...movie,
      price: parseFloat((Math.random() * (89.99 - 19.99) + 19.99).toFixed(2))
    }));
    
    // Adicionar novos filmes aos existentes
    allMovies.value = [...allMovies.value, ...newMovies];
  } catch (err) {
    console.error(err);
    error.value = err;
  } finally {
    loadingMore.value = false;
  }
};

// Função para verificar se precisamos carregar mais filmes para a pesquisa
const checkAndLoadMoreForSearch = async () => {
  if (!searchQuery.value) return;
  
  const filteredCount = filteredMovies.value.length;
  
  // Se temos poucos resultados e ainda há páginas para carregar
  if (filteredCount < 5 && currentPage.value < totalPages.value) {
    await loadMoreMovies();
    
    // Verificar novamente após carregar
    setTimeout(() => {
      const newFilteredCount = filteredMovies.value.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      ).length;
      
      if (newFilteredCount < 5 && currentPage.value < totalPages.value) {
        loadMoreMovies();
      }
    }, 300);
  }
};
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
  padding: 2rem;
  color: var(--text-color-secondary);
}

.no-results p {
  font-size: 1.1rem;
  margin: 0;
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

.loading-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
}

.loading-spinner i {
  font-size: 1.2rem;
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
}
</style> 