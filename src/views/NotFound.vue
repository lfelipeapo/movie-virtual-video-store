<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">🎬</div>
      <h1>😢 Filme não encontrado</h1>
      <div class="not-found-actions">
        <router-link to="/" class="back-home-btn">
          <i class="pi pi-home"></i>
          Voltar à Home
        </router-link>
        <button @click="$router.go(-1)" class="go-back-btn">
          <i class="pi pi-arrow-left"></i>
          Voltar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente de filme não encontrado
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-ground);
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
  background: var(--surface-card);
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

.not-found h1 {
  color: var(--text-color);
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.not-found p {
  color: var(--text-color-secondary);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.back-home-btn,
.go-back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.back-home-btn {
  background: var(--primary-color);
  color: white;
}

.back-home-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

.go-back-btn {
  background: var(--surface-border);
  color: var(--text-color);
}

.go-back-btn:hover {
  background: var(--surface-hover);
  transform: translateY(-2px);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .not-found {
    padding: 1rem;
  }
  
  .not-found-content {
    padding: 2rem 1.5rem;
  }
  
  .not-found h1 {
    font-size: 1.5rem;
  }
  
  .not-found p {
    font-size: 1rem;
  }
  
  .not-found-actions {
    flex-direction: column;
  }
}
</style> 