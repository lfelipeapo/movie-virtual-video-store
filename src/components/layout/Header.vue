<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Badge from 'primevue/badge';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputSwitch from 'primevue/inputswitch';
import logoImage from '@/assets/logo.svg';

const store = useStore();
const emit = defineEmits(['open-cart', 'open-favorites']);

const cartItemCount = computed(() => store.getters.cartItemCount);
const favoriteItemCount = computed(() => store.getters.favoriteCount);
const isDarkMode = ref(localStorage.getItem('isDarkMode') === 'true');
const searchQuery = ref('');

watch(searchQuery, (newQuery) => {
  store.dispatch('updateSearchQuery', newQuery);
});

const toggleTheme = (value) => {
  if (value) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
};

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
      <div class="action-item" v-tooltip.bottom="`Mudar para modo ${isDarkMode ? 'claro' : 'escuro'}`">
        <InputSwitch v-model="isDarkMode" @update:modelValue="toggleTheme" />
        <span class="action-label">Tema</span>
      </div>
      <div class="action-item" v-tooltip.bottom="'Favoritos'">
        <div @click="emit('open-favorites')" class="action-icon-container">
          <i class="pi pi-heart"></i>
          <Badge v-if="favoriteItemCount > 0" :value="favoriteItemCount" severity="danger" />
        </div>
        <span class="action-label">Favoritos</span>
      </div>
      <div class="action-item" v-tooltip.bottom="'Carrinho'">
        <div @click="emit('open-cart')" class="action-icon-container">
          <i class="pi pi-shopping-cart"></i>
          <Badge v-if="cartItemCount > 0" :value="cartItemCount" severity="danger" />
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
}

.action-label {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.action-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-container .p-badge {
  position: absolute;
  top: -8px;
  right: -8px;
}

.actions i {
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color-secondary);
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