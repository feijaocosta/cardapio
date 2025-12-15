# 🍕 Sistema de Pedidos - React + SQLite

Sistema completo de pedidos com interface para clientes e administradores, usando React, TypeScript, Tailwind CSS e SQLite (via sql.js) para persistência de dados no navegador.

## ✨ Funcionalidades

### 👥 Visão do Cliente
- **Seleção de Cardápio**: Escolha entre múltiplos cardápios disponíveis
- **Visualização de Itens**: Veja itens com nome, descrição e preço (se configurado)
- **Carrinho Interativo**: Adicione/remova itens com controles intuitivos
- **Pedidos Rápidos**: Faça pedidos informando apenas seu nome
- **Temas Personalizáveis**: Interface com cores adaptáveis
- **Logos de Cardápios**: Cada cardápio pode ter sua própria imagem/logo

### 🔧 Visão do Administrador
- **Gerenciamento de Pedidos**: Visualize todos os pedidos do mais recente ao mais antigo
- **Múltiplos Cardápios**: Crie cardápios diferentes (Kids, Inverno, Festa, etc.)
- **Biblioteca de Itens**: Gerencie itens que podem ser usados em múltiplos cardápios
- **Configurações Flexíveis**:
  - Mostrar/ocultar preços
  - Escolher entre 5 temas de cores
  - Pré-visualização em tempo real
- **Upload de Logos**: Adicione imagens para cada cardápio

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview
```

Acesse: **http://localhost:5173**

## 📚 Documentação Completa

- **[INSTALACAO.md](/INSTALACAO.md)** - Guia completo de instalação e configuração
- **[ATUALIZACOES.md](/ATUALIZACOES.md)** - Detalhes sobre as funcionalidades implementadas
- **[COMO_REPLICAR.md](/COMO_REPLICAR.md)** - Instruções para replicar o projeto

## 🛠️ Tecnologias

- **React 18** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS 4** - Estilização
- **sql.js** - SQLite no navegador
- **lucide-react** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── admin-view.tsx      # Painel administrativo
│   └── customer-view.tsx   # Interface do cliente
├── lib/
│   └── database.ts         # Lógica SQLite e API
├── styles/
│   └── globals.css         # Estilos globais
├── App.tsx                 # Componente principal
└── main.tsx               # Entry point
```

## 🎨 Temas Disponíveis

- 🟠 **Laranja** - Comida rápida, pizzaria
- 🔵 **Azul** - Profissional, corporativo
- 🟢 **Verde** - Saudável, natural
- 🟣 **Roxo** - Moderno, elegante
- 🔴 **Vermelho** - Urgente, promocional

## 💾 Banco de Dados

O sistema usa SQLite (via sql.js) com as seguintes tabelas:

- **menus** - Cardápios
- **menu_items** - Itens do menu
- **menu_menu_items** - Relacionamento muitos-para-muitos
- **orders** - Pedidos
- **order_items** - Itens dos pedidos
- **settings** - Configurações do sistema

Dados são persistidos no **localStorage** do navegador.

## 🔥 Novidades da Versão 2.0

### ✅ Problema do sql-wasm Resolvido
- Sistema agora funciona perfeitamente fora do ambiente Figma Make
- Arquivos .wasm copiados corretamente no build

### ✅ Sistema de Configurações
- Toggle para mostrar/ocultar preços
- 5 temas de cores personalizáveis
- Pré-visualização em tempo real

### ✅ Múltiplos Cardápios
- Crie quantos cardápios quiser
- Um item pode estar em múltiplos cardápios
- Upload de logos/imagens
- Ativar/desativar cardápios

## 📱 Uso

### Como Cliente
1. Abra a aplicação
2. Selecione um cardápio
3. Escolha os itens desejados
4. Informe seu nome
5. Faça o pedido

### Como Admin
1. Alterne para "Visão Admin"
2. Use as abas:
   - **Pedidos**: Veja todos os pedidos
   - **Cardápios**: Gerencie cardápios e seus itens
   - **Itens**: Gerencie a biblioteca de itens
   - **Configurações**: Ajuste temas e exibição de preços

## 🌐 Deploy

### Opções Recomendadas:
- **Vercel** (automático): https://vercel.com
- **Netlify**: https://netlify.com
- **GitHub Pages**: Veja [INSTALACAO.md](/INSTALACAO.md)

## 📋 Requisitos

- Node.js 18+
- npm 9+
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## ⚠️ Notas Importantes

1. **Persistência**: Dados salvos no localStorage (limite ~5-10MB)
2. **Backup**: Limpar cache do navegador apaga os dados
3. **Segurança**: Não recomendado para dados sensíveis
4. **Internet**: Necessário apenas para carregar logos externos

## 🤝 Contribuindo

Este é um projeto de exemplo educacional. Sinta-se livre para:
- Adaptar para suas necessidades
- Adicionar novas funcionalidades
- Melhorar o código
- Compartilhar melhorias

## 📄 Licença

MIT License - Sinta-se livre para usar em seus projetos.

## 🎯 Casos de Uso

- **Restaurantes**: Cardápios sazonais
- **Cafeterias**: Menu do dia vs. completo
- **Eventos**: Cardápios específicos por evento
- **Food Trucks**: Alternância de cardápios
- **Delivery**: Diferentes cardápios por região

## 🔗 Links Úteis

- [Documentação React](https://react.dev)
- [Documentação Vite](https://vitejs.dev)
- [Documentação Tailwind](https://tailwindcss.com)
- [Documentação sql.js](https://sql.js.org)

---

**Versão**: 2.0  
**Status**: ✅ Produção  
**Última Atualização**: Dezembro 2024

Desenvolvido com ❤️ usando React + TypeScript + SQLite