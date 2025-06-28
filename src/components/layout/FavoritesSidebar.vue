<template>
  <!-- eslint-disable-next-line vue/no-v-model-argument -->
  <Drawer v-model:visible="isVisible" position="right" class="w-full md:w-30rem">
    <template #header>
        <div class="flex justify-content-between align-items-center w-full">
            <span class="font-bold text-lg">Meus Favoritos</span>
            <Button label="Esvaziar" link @click="clearFavorites" class="p-0"></Button>
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
import { computed } from 'vue';
import { useStore } from 'vuex';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible']);

const store = useStore();

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
}

</script>

<style scoped>
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
</style> 