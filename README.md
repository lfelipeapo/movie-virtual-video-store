# 🎬 Movie Virtual Video Store

Uma loja virtual de filmes construída com **Vue 3**, **Vuex** e **PrimeVue**, integrando a API do TMDb. Permite buscar filmes, adicionar ao carrinho, realizar checkout com validações e exibir modal de sucesso personalizado.

---

## 🛠️ Funcionalidades

### Página Inicial
- Lista de filmes da API TMDb em grid responsivo
- Pesquisa em tempo real por título
- Botão “Adicionar ao Carrinho” e “Favoritar” em cada card

### Carrinho Lateral
- Sidebar que exibe itens adicionados
- Quantidade, preço unitário e subtotal dinâmico
- Botão “Finalizar Compra” habilitado apenas quando há itens

### Página de Checkout
- Formulário com campos obrigatórios: Nome, CPF, Celular, E-mail, CEP, Endereço, Cidade, Estado
- **Máscaras:** CPF, Celular, CEP e E-mail
- **Validação:** Vuelidate
- Fluxo de cálculo de frete simulado a partir de JSON
- Modal de sucesso customizado: “Obrigado, <Nome>!”

### Favoritos
- Toggle de favoritos no card de filmes
- Sidebar “Meus Favoritos” para gerenciar lista

### UX & UI
- Layout responsivo (mobile → desktop)
- Sidebars e modal com animações leves (fade-in)
- Skeleton loaders enquanto a API carrega

---

## 🚀 Tecnologias Utilizadas

- **Framework:** Vue 3 (`<script setup>`)
- **Gerenciamento de Estado:** Vuex
- **Roteamento:** Vue Router
- **Validação:** Vuelidate
- **UI:** PrimeVue (InputText, InputMask, Button, Dialog, ProgressSpinner…)
- **HTTP:** Axios
- **API de Filmes:** [TMDb](https://developers.themoviedb.org/3)
- **Estilo:** Tailwind CSS + variáveis de tema PrimeVue

---

## 📥 Instalação

1. **Clone o repositório:**
   ```bash
   git clone git@github.com:lfelipeapo/movie-virtual-video-store.git
   cd movie-virtual-video-store
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Crie um arquivo `.env` na raiz:**
   ```
   VUE_APP_TMDB_API_KEY=seu_api_key_tmdb_aqui
   ```

4. **Inicie em modo desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Abra no navegador:**  
   [http://localhost:5173](http://localhost:5173) (ou porta do Vite)

---

## ⚙️ Scripts Disponíveis

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção em `dist/`
- `npm run lint` — executa ESLint

---

## 📁 Estrutura do Projeto

```
src/
├── api/
│   └── tmdb.js            # Cliente Axios para TMDb
├── components/
│   ├── layout/            # Header, Footer, Sidebars
│   ├── MovieCard.vue      # Card de filme
│   └── ...
├── views/
│   ├── HomeView.vue       # Página inicial
│   └── CheckoutView.vue   # Página de checkout
├── store/
│   └── index.js           # Vuex: estado do carrinho & favoritos
├── router/
│   └── index.js           # Rotas Home ↔ Checkout
└── assets/
    └── logo.svg           # Logo da loja
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas alterações: `git commit -m "feat: descrição"`
4. Push na branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📜 Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
