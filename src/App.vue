<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import CartSidebar from './components/layout/CartSidebar.vue'
import FavoritesSidebar from './components/layout/FavoritesSidebar.vue'

const isCartVisible = ref(false)
const isFavoritesVisible = ref(false)
</script>

<template>
  <div class="app-container">
    <Header @open-cart="isCartVisible = true" @open-favorites="isFavoritesVisible = true" />
    <main class="app-main">
      <RouterView />
    </main>
    <Footer />
    <!-- eslint-disable-next-line vue/no-v-model-argument -->
    <CartSidebar v-model:visible="isCartVisible" />
    <!-- eslint-disable-next-line vue/no-v-model-argument -->
    <FavoritesSidebar v-model:visible="isFavoritesVisible" />
    </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--surface-ground);
}

.app-main {
  flex-grow: 1;
  padding: 2rem;
}

@media (min-width: 768px) {
  .app-main {
    padding: 2rem;
  }
}
</style>
