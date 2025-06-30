<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Badge from 'primevue/badge';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import logoImage from '@/assets/logo.svg';

const store = useStore();
const emit = defineEmits(['open-cart', 'open-favorites']);

const cartItemCount = computed(() => store.getters.cartItemCount);
const favoriteItemCount = computed(() => store.getters.favoriteCount);
const isDark = ref(localStorage.getItem('theme') === 'dark');
const searchQuery = ref('');

watch(searchQuery, (newQuery) => {
  store.dispatch('updateSearchQuery', newQuery);
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark-mode', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  // Aplicar tema inicial
  document.documentElement.classList.toggle('dark-mode', isDark.value);
});

</script>

<template>
  <header class="app-header flex justify-content-between align-items-center p-3">
    <RouterLink to="/" class="logo-link">
      <div class="logo">
        <img :src="logoImage" alt="Movie Store" class="logo-image" @contextmenu.prevent />
      </div>
    </RouterLink>
    <div class="search-bar flex-grow-1 mx-3">
      <IconField iconPosition="right" class="w-full">
        <InputText v-model="searchQuery" placeholder="Pesquisa" class="w-full border-round" />
        <InputIcon class="pi pi-search"></InputIcon>
      </IconField>
    </div>
    <div class="actions flex align-items-center gap-3">
      <div class="action-item" v-tooltip.bottom="`Mudar para modo ${isDark ? 'claro' : 'escuro'}`">
        <button 
          @click="toggleTheme" 
          :aria-pressed="isDark"
          class="theme-toggle-btn"
        >
          <div class="toggle-container">
            <transition name="toggle-slide" mode="out-in">
              <span v-if="isDark" key="moon" class="theme-icon">🌘</span>
              <span v-else key="sun" class="theme-icon">☀️</span>
            </transition>
          </div>
        </button>
        <span class="action-label">Tema</span>
      </div>
      <div class="action-item" v-tooltip.bottom="'Favoritos'">
        <div @click="emit('open-favorites')" class="action-icon-container">
          <i class="pi pi-heart"></i>
          <transition name="badge-pop" appear>
            <Badge v-if="favoriteItemCount > 0" :value="favoriteItemCount" severity="danger" />
          </transition>
        </div>
        <span class="action-label">Favoritos</span>
      </div>
      <div class="action-item" v-tooltip.bottom="'Carrinho'">
        <div @click="emit('open-cart')" class="action-icon-container">
          <i class="pi pi-shopping-cart"></i>
          <transition name="badge-pop" appear>
            <Badge v-if="cartItemCount > 0" :value="cartItemCount" severity="danger" />
          </transition>
        </div>
        <span class="action-label">Carrinho</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--surface-header);
  border-bottom: 1px solid var(--surface-border);
  transition: all 0.3s ease;
}

.logo {
  display: flex;
  align-items: center;
  user-select: none;
  pointer-events: none;
}

.logo-image {
  height: 100px;
  width: auto;
  max-width: 200px;
}

.search-bar {
  max-width: 50%;
  flex-grow: 1;
  margin: 0 2rem;
}

.search-bar .p-input-icon-right {
    width: 100%;
}

.search-bar .p-inputtext {
    width: 100%;
    border-radius: 20px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-item:hover {
  background-color: var(--surface-hover);
  transform: translateY(-2px);
}

.action-label {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  transition: color 0.3s ease;
}

.action-item:hover .action-label {
  color: var(--primary-color);
}

.action-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  min-width: 48px;
  min-height: 48px;
}

.action-icon-container:hover {
  background-color: var(--surface-card);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-icon-container .p-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  transition: all 0.3s ease;
}

.action-icon-container:hover .p-badge {
  transform: scale(1.2);
}

.actions i {
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color-secondary);
  transition: all 0.3s ease;
}

.action-icon-container:hover i {
  color: var(--primary-color);
  transform: scale(1.1);
}

.theme-toggle-btn {
  background: var(--surface-card);
  border: 2px solid var(--surface-border);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  min-height: 32px;
  position: relative;
  overflow: hidden;
}

.theme-toggle-btn:hover {
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.theme-toggle-btn:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.toggle-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon {
  font-size: 1.2rem;
  display: block;
  transition: all 0.3s ease;
  position: absolute;
}

.theme-toggle-btn:hover .theme-icon {
  transform: scale(1.1);
}

/* Animações de toggle suave */
.toggle-slide-enter-active,
.toggle-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px) rotate(-180deg) scale(0.8);
}

.toggle-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) rotate(180deg) scale(0.8);
}

.toggle-slide-enter-to,
.toggle-slide-leave-from {
  opacity: 1;
  transform: translateX(0) rotate(0deg) scale(1);
}

/* Animações para badges */
.badge-pop-enter-active {
  animation: badgePop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.badge-pop-leave-active {
  animation: badgePop 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse;
}

@keyframes badgePop {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.logo-link {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .app-header {
    flex-direction: row;
    align-items: center;
    padding: 0.5rem 1rem;
    flex-wrap: wrap;
  }
  .logo-link {
    margin-bottom: 0;
  }
  .actions {
    margin-bottom: 0;
  }
  .search-bar {
    margin: 0.5rem 0 0 0;
    max-width: 100%;
    width: 100%;
    order: 3;
    flex-basis: 100%;
  }
  .logo-image {
    height: 60px;
    max-width: 120px;
  }
}
</style> 