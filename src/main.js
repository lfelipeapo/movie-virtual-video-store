import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Import local CSS after PrimeVue theme to allow overrides
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark-mode'
        }
    },
    pt: {}
});
app.directive('tooltip', Tooltip);

app.mount('#app')
