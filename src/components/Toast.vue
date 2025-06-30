<template>
  <Transition name="toast">
    <div v-if="show" class="toast" :class="type">
      <div class="toast-content">
        <i :class="iconClass"></i>
        <span class="toast-message">{{ message }}</span>
      </div>
      <button @click="closeToast" class="toast-close">
        <i class="pi pi-times"></i>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const emit = defineEmits(['close']);

const show = ref(true);

const iconClass = computed(() => {
  const icons = {
    success: 'pi pi-check-circle',
    error: 'pi pi-times-circle',
    warning: 'pi pi-exclamation-triangle',
    info: 'pi pi-info-circle'
  };
  return icons[props.type] || icons.success;
});

const closeToast = () => {
  show.value = false;
  emit('close');
};

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      closeToast();
    }, props.duration);
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  min-width: 300px;
  max-width: 400px;
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  gap: 0.5rem;
}

.toast.success {
  border-left-color: #10b981;
}

.toast.error {
  border-left-color: #ef4444;
}

.toast.warning {
  border-left-color: #f59e0b;
}

.toast.info {
  border-left-color: #3b82f6;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.toast-content i {
  font-size: 1.25rem;
}

.toast.success .toast-content i {
  color: #10b981;
}

.toast.error .toast-content i {
  color: #ef4444;
}

.toast.warning .toast-content i {
  color: #f59e0b;
}

.toast.info .toast-content i {
  color: #3b82f6;
}

.toast-message {
  color: var(--text-color);
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  background: var(--surface-hover);
  color: var(--text-color);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .toast {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style> 