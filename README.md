# 🎬 Movie Virtual Video Store

Uma loja virtual de filmes construída com Vue 3, Vuex e PrimeVue, integrada à API do TMDb.
Oferece pesquisa em tempo real, modo escuro, favoritos, carrinho lateral inteligente, checkout validado com máscaras, e uma experiência UX fluida e responsiva.

## 🛠️ Funcionalidades

### Página Inicial
- Listagem dinâmica de filmes populares da TMDb
- Pesquisa com debounce e autocomplete
- Paginação incremental ("Carregar mais")
- Filtro por gênero (via API)
- Skeleton loaders durante carregamento

### Carrinho Lateral
- Barra lateral elegante com controle de quantidade
- Total dinâmico, preço unitário e subtotal
- Botão "Finalizar Compra" habilitado somente com itens

### Página de Checkout
Formulário validado com:
- Nome
- CPF (com máscara)
- Celular (com máscara)
- E-mail (com máscara e validação)
- CEP (com máscara e busca simulada)
- Endereço, Cidade e Estado
- Modal de sucesso com mensagem personalizada:
  > "Obrigado, Luiz Felipe! Sua compra foi um sucesso."

### Favoritos
- Toggle de "❤️ Favoritar" em cada card
- Sidebar separada com filmes favoritos
- Persistência via localStorage

### Notificações (Toasts)
- Feedback visual ao adicionar/remover item
- Componente Toast.vue customizado
- Fechamento automático

### Modo Escuro 🌙☀️
- Alternância com toggle (salvo no localStorage)
- Ícones temáticos
- Suporte completo via Tailwind e PrimeVue Theme

### Página 404
- Rota /:catchAll(.*)
- Tela estilizada com mensagem personalizada e botão "Voltar para home"

## 🚀 Tecnologias Utilizadas
- **Framework:** Vue 3 (`<script setup>`)
- **Gerenciamento de Estado:** Vuex com persistência via localStorage
- **Roteamento:** Vue Router com fallback 404
- **Validação:** Vuelidate + Máscaras customizadas
- **UI:** PrimeVue + Tailwind CSS
- **HTTP:** Axios com camada API (`/api/tmdb.js`)
- **UX Extra:** Debounce com Lodash, Toast personalizado, Skeletons, Scroll Lock, Animações
- **API:** TMDb

## 📦 Instalação

```bash
git clone https://github.com/lfelipeapo/movie-virtual-video-store.git
cd movie-virtual-video-store
npm install
```

Crie um arquivo `.env`:

```ini
VITE_THEMOVIEDB_API_KEY=sua_chave_aqui
```

Inicie o projeto:

```bash
npm run dev
```

Acesse: http://localhost:5173

## 📁 Estrutura do Projeto

```bash
src/
├── api/
│   └── tmdb.js              # Cliente Axios para TMDb (getPopularMovies, getMoviesBySearch, etc)
├── components/
│   ├── layout/              # Header, Footer, Sidebars
│   ├── MovieCard.vue        # Card individual do filme
│   └── Toast.vue            # Feedback visual (add/remover item)
├── views/
│   ├── HomeView.vue         # Página inicial
│   ├── CheckoutView.vue     # Página de checkout
│   └── NotFound.vue         # Página 404 personalizada
├── store/
│   └── index.js             # Vuex com persistência (cart + favorites)
├── router/
│   └── index.js             # Roteamento SPA
└── assets/
    └── logo.svg             # Logo customizada
```

## ✅ Implementações Extras (Plus)
- ✅ Dark Mode persistente
- ✅ Toasts visuais com mensagens automáticas
- ✅ Paginação dinâmica de filmes
- ✅ Pesquisa com debounce + autocomplete
- ✅ Animações suaves (modal, sidebar)
- ✅ Filtro por gênero via API
- ✅ Layout 100% responsivo
- ✅ 404 personalizada
- ✅ Código limpo, organizado e modularizado

## 🤝 Contribuição

```bash
# Fork o repositório
# Crie sua branch:
git checkout -b feature/nova-feature

# Commit:
git commit -m "feat: nova funcionalidade"

# Push:
git push origin feature/nova-feature
```
Abra um Pull Request com a descrição clara.

## 📜 Licença
MIT © Luiz Felipe Apolinário

---
