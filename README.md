# Movie Virtual Video Store

Uma loja virtual de filmes construída com Vue 3, Vuex e PrimeVue, integrando a API do TMDb.  
Permite buscar filmes, adicionar ao carrinho, preencher um checkout com validações e exibir modal de sucesso.

---

## 🛠️ Funcionalidades

- **Página Inicial**  
  - Lista de filmes da API TMDb em grid responsivo  
  - Pesquisa em tempo real por título  
  - Botão “Adicionar ao Carrinho” e “Favoritar” em cada card  

- **Carrinho Lateral**  
  - Sidebar que exibe itens adicionados  
  - Quantidade, preço unitário e subtotal dinâmico  
  - Botão “Finalizar Compra” habilitado apenas quando há itens  

- **Página de Checkout**  
  - Formulário com campos obrigatórios: Nome, CPF, Celular, E-mail, CEP, Endereço, Cidade, Estado  
  - Máscaras em CPF, Celular e CEP (InputMask)  
  - Máscara/regra customizada em E-mail (apenas caracteres válidos)  
  - Validação com Vuelidate  
  - Fluxo de cálculo de frete simulado a partir de JSON  
  - Modal de sucesso customizado: “Obrigado, <Nome>!”  

- **Favoritos**  
  - Toggle de favoritos no card de filmes  
  - Sidebar “Meus Favoritos” para gerenciar lista  

- **UX & UX**  
  - Layout responsivo (`mobile → desktop`)  
  - Sidebars e modal com animações leves (fade-in)  
  - Skeleton loaders enquanto a API carrega  

---

## 🚀 Tecnologias

- **Framework**: Vue 3 + `<script setup>`
- **State**: Vuex  
- **Roteamento**: Vue Router  
- **Validação**: Vuelidate  
- **UI**: PrimeVue (InputText, InputMask, Button, Dialog, ProgressSpinner…)  
- **HTTP**: Axios  
- **API Filmes**: TMDb (https://developers.themoviedb.org/3)  
- **Estilo**: Tailwind CSS + variáveis de tema PrimeVue  

---

## 📥 Instalação

1. Clone o repositório:
   ```bash
   git clone git@github.com:lfelipeapo/movie-virtual-video-store.git
   cd movie-virtual-video-store

Instale as dependências:

bash
Copy
Edit
npm install
# ou
yarn install
Crie um arquivo .env na raiz:

env
Copy
Edit
VUE_APP_TMDB_API_KEY=seu_api_key_tmdb_aqui
Inicie em modo desenvolvimento:

bash
Copy
Edit
npm run serve
# ou
yarn serve
Abra no navegador em http://localhost:8080.

⚙️ Scripts disponíveis
npm run serve — servidor de desenvolvimento

npm run build — build de produção em dist/

npm run lint — executa ESLint

📁 Estrutura do Projeto
bash
Copy
Edit
src/
├── api/
│   └── tmdb.js            # Cliente Axios para TMDb
├── components/
│   ├── MovieCard.vue      # Card de filme
│   ├── CartSidebar.vue    # Carrinho lateral
│   └── FavoritesSidebar.vue
├── views/
│   ├── HomeView.vue       # Página inicial
│   └── CheckoutView.vue   # Página de checkout
├── store/
│   └── index.js           # Vuex: estado do carrinho & favoritos
├── router/
│   └── index.js           # Rotas Home ↔ Checkout
└── assets/
    └── styles.css         # Estilos globais (Tailwind + overrides)
🤝 Contribuição
Fork do projeto

Crie uma branch feature: git checkout -b feature/nova-funcionalidade

Commit suas alterações: git commit -m "feat: descrição"

Push na branch: git push origin feature/nova-funcionalidade

Abra um Pull Request

📜 Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.
