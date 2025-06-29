<template>
  <div class="checkout-page p-4 lg:p-6">
    <!-- Loading -->
    <div v-if="isLoading" class="loading-overlay">
      <ProgressSpinner />
    </div>

    <!-- Voltar -->
    <div class="back-button-container mb-4">
      <Button
        icon="pi pi-arrow-left"
        label="Voltar para Home"
        @click="goToHome"
        class="p-button-outlined"
        severity="secondary"
      />
    </div>

    <div class="grid">
      <!-- Formulário -->
      <div class="col-12 lg:col-7 pr-lg-5">
        <h2 class="text-2xl font-bold mb-4">Finalizar Compra</h2>
        <div class="form-grid grid">
          <div class="field col-12">
            <label for="name">Nome Completo</label>
            <InputText
              id="name"
              ref="nameInput"
              v-model="v$.form.name.$model"
              :class="{ 'p-invalid': v$.form.name.$invalid && submitted }"
              class="w-full"
              placeholder="Digite seu nome completo"
            />
            <small
              v-if="v$.form.name.$invalid && submitted"
              class="p-error"
            >Nome é obrigatório.</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="cpf">CPF</label>
            <InputMask
              id="cpf"
              v-model="v$.form.cpf.$model"
              mask="999.999.999-99"
              :class="{ 'p-invalid': v$.form.cpf.$invalid && submitted }"
              class="w-full"
              placeholder="000.000.000-00"
            />
            <small
              v-if="v$.form.cpf.$invalid && submitted"
              class="p-error"
            >CPF é obrigatório.</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="phone">Celular</label>
            <InputMask
              id="phone"
              v-model="v$.form.phone.$model"
              mask="(99) 99999-9999"
              :class="{ 'p-invalid': v$.form.phone.$invalid && submitted }"
              class="w-full"
              placeholder="(99) 99999-9999"
            />
            <small
              v-if="v$.form.phone.$invalid && submitted"
              class="p-error"
            >Celular é obrigatório.</small>
          </div>

          <div class="field col-12">
            <label for="email">E-mail</label>
            <InputText
              id="email"
              v-model="v$.form.email.$model"
              :class="{ 'p-invalid': v$.form.email.$invalid && submitted }"
              class="w-full"
              placeholder="seu@email.com"
              @update:modelValue="onEmailInput"
            />
            <small
              v-if="v$.form.email.$invalid && submitted"
              class="p-error"
            >{{ v$.form.email.email.$message || 'E-mail é obrigatório.' }}</small>
          </div>

          <div class="field col-12 md:col-5">
            <label for="cep">CEP</label>
            <InputMask
              id="cep"
              v-model="v$.form.cep.$model"
              mask="99999-999"
              @blur="fetchAddressAndShipping"
              :class="{ 'p-invalid': v$.form.cep.$invalid && submitted }"
              class="w-full"
              placeholder="00000-000"
            />
            <small
              v-if="v$.form.cep.$invalid && submitted"
              class="p-error"
            >CEP é obrigatório.</small>
          </div>

          <div class="field col-12 md:col-7">
            <label for="address">Endereço</label>
            <InputText
              id="address"
              v-model="v$.form.address.$model"
              :class="{ 'p-invalid': v$.form.address.$invalid && submitted }"
              class="w-full"
            />
            <small
              v-if="v$.form.address.$invalid && submitted"
              class="p-error"
            >Endereço é obrigatório.</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="city">Cidade</label>
            <InputText
              id="city"
              v-model="v$.form.city.$model"
              :class="{ 'p-invalid': v$.form.city.$invalid && submitted }"
              class="w-full"
            />
            <small
              v-if="v$.form.city.$invalid && submitted"
              class="p-error"
            >Cidade é obrigatório.</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="state">Estado</label>
            <InputText
              id="state"
              v-model="v$.form.state.$model"
              :class="{ 'p-invalid': v$.form.state.$invalid && submitted }"
              class="w-full"
            />
            <small
              v-if="v$.form.state.$invalid && submitted"
              class="p-error"
            >Estado é obrigatório.</small>
          </div>
        </div>
      </div>

      <!-- Resumo do Pedido -->
      <div class="col-12 lg:col-5">
        <div class="summary-card p-4">
          <h3 class="text-xl font-bold mb-4">Resumo do Pedido</h3>

          <template v-if="cartItems.length">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex align-items-center mb-3"
            >
              <img
                :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`"
                class="w-4rem h-6rem mr-3"
              />
              <div class="flex-grow-1">
                <p class="font-semibold">{{ item.title }}</p>
                <p class="text-sm">
                  {{ item.quantity }} x R$ {{ item.price.toFixed(2) }}
                </p>
              </div>
              <p class="font-semibold">R$ {{ (item.quantity * item.price).toFixed(2) }}</p>
            </div>

            <hr class="my-3" />

            <div class="flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>R$ {{ cartTotal.toFixed(2) }}</span>
            </div>

            <div v-if="shippingOptions.length">
              <p class="font-semibold mb-2">Frete:</p>
              <div
                v-for="option in shippingOptions"
                :key="option.ID"
                class="field-radiobutton"
              >
                <RadioButton
                  v-model="selectedShipping"
                  :inputId="option.ID"
                  name="shipping"
                  :value="option"
                  @change="shippingSelectionError = ''"
                />
                <label :for="option.ID">
                  {{ option.service_name }}
                  - R$ {{ option.sValor }}
                  (Prazo: {{ option.sPrazoEntrega }})
                </label>
              </div>
            </div>

            <p v-if="shippingError" class="p-error text-sm mt-2">{{ shippingError }}</p>
            <p v-if="shippingSelectionError" class="p-error text-sm mt-2">{{ shippingSelectionError }}</p>

            <hr class="my-3" />

            <div class="flex justify-content-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {{ finalTotal.toFixed(2) }}</span>
            </div>

            <Button
              label="Finalizar"
              @click="handleCheckout"
              class="w-full mt-4"
              :disabled="!cartItems.length"
            />
          </template>

          <template v-else>
            <div class="text-center p-4">
              <i class="pi pi-shopping-cart text-4xl text-gray-400 mb-3"></i>
              <p class="text-lg font-semibold mb-2">Seu carrinho está vazio</p>
              <p class="text-sm text-gray-600 mb-4">
                Adicione produtos ao carrinho antes de finalizar a compra.
              </p>
              <Button
                label="Voltar à Loja"
                @click="goToHome"
                class="p-button-outlined"
                icon="pi pi-home"
              />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Modal de Sucesso -->
    <Dialog
      :visible="showSuccessModal"
      @update:visible="showSuccessModal = $event"
      appendTo="body"
      modal
      :header="`Obrigado ${customerName}!`"
      :style="{ width: '30rem' }"
    >
      <div class="text-center">
        <i class="pi pi-check-circle text-green-500 text-6xl mb-3"></i>
        <p class="text-lg">Sua compra foi finalizada com sucesso!</p>
        <Button label="Ir para loja" @click="goToHome" class="mt-4" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

import axios from 'axios'
import { frete } from '../data/db_frete.json'

import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import RadioButton from 'primevue/radiobutton'
import ProgressSpinner from 'primevue/progressspinner'

// Estado do formulário e validações
const form = reactive({
  name: '', cpf: '', phone: '',
  email: '', cep: '',
  address: '', city: '', state: ''
})

const rules = { form: {
  name: { required },
  cpf: { required },
  phone: { required },
  email: { required, email },
  cep: { required },
  address: { required },
  city: { required },
  state: { required }
}}

const v$ = useVuelidate(rules, { form })
const submitted = ref(false)

// Store, roteamento e flags
const store = useStore()
const router = useRouter()
const isLoading = ref(false)
const showSuccessModal = ref(false)
const customerName = ref('')

// Frete
const shippingOptions = ref([])
const selectedShipping = ref(null)
const shippingError = ref('')
const shippingSelectionError = ref('')

// Carrinho
const cartItems = computed(() => store.getters.cartItems)
const cartTotal = computed(() => store.getters.cartTotal)

// Totais
const finalTotal = computed(() => {
  const shipping = selectedShipping.value
    ? parseFloat(selectedShipping.value.sValor)
    : 0
  return cartTotal.value + shipping
})

// Busca endereço e frete pelo CEP
async function fetchAddressAndShipping() {
  if (!cartItems.value.length) {
    shippingError.value = 'Seu carrinho está vazio.'
    return
  }

  const rawCep = form.cep.replace(/\D/g, '')
  if (rawCep.length !== 8) {
    shippingError.value = 'Digite um CEP válido com 8 dígitos.'
    form.address = ''
    form.city = ''
    form.state = ''
    shippingOptions.value = []
    selectedShipping.value = null
    return
  }

  isLoading.value = true
  shippingOptions.value = []
  selectedShipping.value = null
  shippingError.value = ''
  shippingSelectionError.value = ''

  try {
    // Endereço automático
    const { data } = await axios.get(`https://brasilapi.com.br/api/cep/v2/${rawCep}`)
    if (!data || !data.street) {
      throw new Error('CEP não encontrado.')
    }
    form.address = data.street || ''
    form.city = data.city || ''
    form.state = data.state || ''

    // Mock de frete
    if (Array.isArray(frete)) {
      shippingOptions.value = frete.map(o => ({
        ID: o.ID,
        service_name: o.service_name,
        sValor: o.sValor,
        sPrazoEntrega: o.sPrazoEntrega
      }))
    } else {
      throw new Error('Nenhuma opção de frete encontrada.')
    }
  } catch (err) {
    form.address = ''
    form.city = ''
    form.state = ''
    shippingOptions.value = []
    selectedShipping.value = null
    shippingError.value = err.response?.data?.message || err.message || 'Erro ao buscar CEP.'
  } finally {
    isLoading.value = false
  }
}

// Finaliza checkout
async function handleCheckout() {
  if (!cartItems.value.length) {
    shippingError.value = 'Seu carrinho está vazio.'
    return
  }

  submitted.value = true
  shippingSelectionError.value = ''

  const valid = await v$.value.$validate()
  if (!valid || !selectedShipping.value) {
    if (!selectedShipping.value) {
      shippingSelectionError.value = 'Selecione um método de entrega.'
    }
    return
  }

  // Salva nome antes de limpar
  customerName.value = form.name
  store.dispatch('clearCart')
  clearForm()
  showSuccessModal.value = true
}

// Volta para home
function goToHome() {
  showSuccessModal.value = false
  router.push('/')
}

// Limpa o formulário
function clearForm() {
  form.name = ''
  form.cpf = ''
  form.phone = ''
  form.email = ''
  form.cep = ''
  form.address = ''
  form.city = ''
  form.state = ''
  
  // Reset das validações
  submitted.value = false
  v$.value.$reset()
  
  // Reset do frete
  shippingOptions.value = []
  selectedShipping.value = null
  shippingError.value = ''
  shippingSelectionError.value = ''
}

// Função para aplicar máscara de e-mail (permite letras, números, @, ponto, underline, hífen)
function onEmailInput(val) {
  const clean = val.replace(/[^a-zA-Z0-9@._-]/g, '')
  form.email = clean
  v$.value.form.email.$model = clean
}

const nameInput = ref(null)
onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    const input = nameInput.value?.$el.querySelector('input')
    if (input) {
      input.focus()
    }
  }, 50)
})
</script>

<style scoped>
.checkout-page {
  max-width: 1200px;
  margin: 0 auto;
}

.back-button-container {
  display: flex;
  justify-content: flex-start;
}

.summary-card {
  background: var(--surface-section);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.p-error {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #e53935;
}

label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

:deep(.p-dialog-mask) {
  animation: fadeInMask 0.3s;
}
:deep(.p-dialog) {
  animation: fadeInDialog 0.4s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInDialog {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fadeInMask {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
