<template>
  <!-- eslint-disable-next-line vue/no-v-model-argument -->
  <Drawer ref="sidebar" v-model:visible="isVisible" position="right" class="w-full md:w-30rem">
    <template #header>
        <div class="flex justify-content-between align-items-center w-full">
            <span class="font-bold text-lg">Meu Carrinho</span>
            <Button label="Esvaziar" link @click="clearCart" class="p-0 mr-2"></Button>
        </div>
    </template>
    
    <div v-if="cartItems.length === 0" class="empty-cart text-center">
      <p>Seu carrinho está vazio.</p>
    </div>
    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item flex align-items-center p-2">
          <img :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`" :alt="item.title" class="w-4rem h-6rem mr-2" />
          <div class="item-details flex-grow-1">
            <p class="font-bold">{{ item.title }}</p>
            <p>{{ item.quantity }} x R$ {{ item.price.toFixed(2) }}</p>
          </div>
          <Button
            icon="pi pi-trash"
            class="p-button-danger p-button-text"
            @click="removeFromCart(item.id)"
            v-tooltip.left="'Remover do carrinho'"
          />
        </div>
      </div>
      <div class="cart-summary mt-4">
        <div class="flex justify-content-between">
          <span class="font-bold">Total</span>
          <span class="font-bold">R$ {{ cartTotal.toFixed(2) }}</span>
        </div>
        <router-link to="/checkout">
          <Button label="Ir para o Checkout" class="w-full mt-2" @click="closeSidebar"></Button>
        </router-link>
      </div>
    </div>
  </Drawer>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';

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

const cartItems = computed(() => store.state.cartItems);
const cartTotal = computed(() => store.getters.cartTotal);

const removeFromCart = (movieId) => {
  store.dispatch('removeFromCart', movieId);
};

const clearCart = () => {
  store.dispatch('clearCart');
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

.empty-cart {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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