<template>
  <footer class="app-footer">
    <p>&copy; {{ currentYear }} Movie Store. Todos os direitos reservados.<br>Desenvolvido por Luiz Felipe Apolinário</p>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  padding: 1rem;
  text-align: center;
  background-color: var(--surface-ground);
  color: var(--text-color);
  border-top: 1px solid var(--surface-border);
}
</style> 