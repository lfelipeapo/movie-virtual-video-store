import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

//Arquivo de estilo global do projeto
import './app.css'
//Arquivo de estilo global do PrimeVue
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
