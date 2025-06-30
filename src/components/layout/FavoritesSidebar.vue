<template>
  <!-- eslint-disable-next-line vue/no-v-model-argument -->
  <Drawer ref="sidebar" v-model:visible="isVisible" position="right" class="w-full md:w-30rem">
    <template #header>
        <div class="flex justify-content-between align-items-center w-full">
            <span class="font-bold text-lg">Meus Favoritos</span>
            <Button label="Esvaziar" link @click="clearFavorites" class="p-0 mr-2"></Button>
        </div>
    </template>

    <div v-if="favoriteItems.length === 0" class="empty-favorites text-center">
      <p>Sua lista de favoritos está vazia.</p>
    </div>
    <div v-else class="favorites-content">
      <div class="favorite-items">
        <div v-for="item in favoriteItems" :key="item.id" class="favorite-item flex align-items-center p-2 border-bottom-1 surface-border">
          <img :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`" :alt="item.title" class="w-4rem h-6rem mr-2" />
          <div class="item-details flex-grow-1">
            <p class="font-bold">{{ item.title }}</p>
            <p class="font-bold text-primary mt-1">R$ {{ item.price ? item.price.toFixed(2) : 'N/A' }}</p>
          </div>
          <div class="item-actions">
            <Button icon="pi pi-shopping-cart" severity="success" text rounded @click="addToCart(item)" v-tooltip.left="'Adicionar ao carrinho'"></Button>
            <Button icon="pi pi-trash" severity="danger" text rounded @click="toggleFavorite(item)" v-tooltip.left="'Remover dos favoritos'"></Button>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible']);

const store = useStore();
const sidebar = ref(null);

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const favoriteItems = computed(() => store.state.favoriteItems);

const addToCart = (movie) => {
  store.dispatch('addToCart', movie);
};

const toggleFavorite = (movie) => {
  store.dispatch('toggleFavorite', movie);
};

const clearFavorites = () => {
    store.dispatch('clearFavorites');
};

const closeSidebar = () => {
  isVisible.value = false;
};

const handleClickOutside = (e) => {
  // Não fechar se o clique vier dos botões do header
  if (e.target.closest('.action-item') || e.target.closest('.action-icon-container')) {
    return;
  }
  
  // Não fechar se o clique for dentro da sidebar (qualquer parte)
  if (sidebar.value && sidebar.value.$el.contains(e.target)) {
    return;
  }
  
  // Só fechar se clicar no overlay/mask (fora da sidebar)
  if (e.target.classList.contains('p-drawer-mask') || e.target.classList.contains('p-component-overlay')) {
    closeSidebar();
  }
};

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    closeSidebar();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
/* Garantir que o scroll funcione quando sidebar estiver aberta */
:deep(.p-drawer-mask) {
  overflow: auto !important;
  animation: fadeInMask 0.3s;
}

:deep(.p-drawer) {
  overflow: auto !important;
  animation: fadeInDrawer 0.4s cubic-bezier(.4,0,.2,1);
}

/* Manter scroll da página principal */
body {
  overflow: auto !important;
}

html {
  overflow: auto !important;
}

.empty-favorites {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-actions {
  display: flex;
  flex-direction: row;
}

@keyframes fadeInDrawer {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeInMask {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 