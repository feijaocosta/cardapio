# Sistema de Pedidos - Configuração Completa

Este sistema foi desenvolvido no Figma Make e requer um backend Node.js + Express + SQLite para funcionar fora do ambiente Figma Make.

## Arquitetura

- **Frontend**: React + TypeScript + Tailwind CSS (código gerado neste projeto)
- **Backend**: Node.js + Express + SQLite (você precisa implementar)
- **Comunicação**: API REST

## Setup Frontend

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` e configure a URL da API:

```
VITE_API_URL=http://localhost:3000/api
```

### 3. Executar o Frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Setup Backend

O frontend espera que um servidor backend esteja rodando com os endpoints documentados em `/docs/backend-setup.md`.

### Passos Rápidos:

1. Leia a documentação completa em: `/docs/backend-setup.md`
2. Crie um novo diretório para o backend (fora deste projeto)
3. Implemente as rotas conforme especificado na documentação
4. Execute o backend na porta 3000 (ou configure outra porta no `.env`)

## Documentação Importante

- **📖 Guia Completo do Backend**: `/docs/backend-setup.md`
  - Schema do banco de dados SQLite
  - Estrutura de diretórios
  - Código completo das rotas
  - Exemplos de requisições/respostas

## Funcionalidades

### Cliente
- Seleção de cardápios
- Visualização de itens disponíveis
- Criação de pedidos
- Temas personalizáveis

### Admin
- Gerenciamento de cardápios (criar, editar, ativar/desativar)
- Gerenciamento de itens (adicionar, remover)
- Visualização de pedidos
- Configurações do sistema (tema de cores, exibição de preços)
- Sistema de múltiplos cardápios (many-to-many)

## Estrutura do Projeto Frontend

```
/
├── services/
│   └── api.ts              # Serviço centralizado de API
├── src/
│   ├── components/
│   │   ├── admin-view.tsx  # Painel administrativo
│   │   └── customer-view.tsx # Interface do cliente
│   ├── App.tsx             # Componente principal
│   └── main.tsx
├── docs/
│   └── backend-setup.md    # Documentação completa do backend
├── .env.example            # Exemplo de variáveis de ambiente
└── README-BACKEND.md       # Este arquivo
```

## Banco de Dados

O SQLite será armazenado em arquivo no servidor backend (`database.sqlite`).

### Tabelas:
- `menu_items` - Itens do cardápio
- `orders` - Pedidos realizados
- `order_items` - Itens de cada pedido
- `menus` - Cardápios
- `menu_menu_items` - Relacionamento many-to-many entre menus e itens
- `settings` - Configurações do sistema

## Endpoints da API

Todos os endpoints estão documentados em `/docs/backend-setup.md`.

Resumo:
- `GET /api/health` - Health check
- `GET /api/menu-items` - Lista itens
- `POST /api/menu-items` - Cria item
- `GET /api/orders` - Lista pedidos
- `POST /api/orders` - Cria pedido
- `GET /api/menus` - Lista cardápios
- `POST /api/menus` - Cria cardápio
- `GET /api/menus/:id/items` - Lista itens de um cardápio
- `POST /api/menus/:id/items` - Adiciona item ao cardápio
- `GET /api/settings` - Busca configurações
- `PUT /api/settings` - Atualiza configurações

## Deploy

### Frontend (Vercel, Netlify, etc.)
1. Configure a variável de ambiente `VITE_API_URL` para apontar ao servidor backend
2. Build: `npm run build`
3. Deploy da pasta `dist/`

### Backend (VPS, Railway, Render, etc.)
1. Siga as instruções em `/docs/backend-setup.md`
2. Configure o CORS para permitir o domínio do frontend
3. Certifique-se de que o arquivo `database.sqlite` persista entre restarts

## Suporte

Este código foi gerado no Figma Make e adaptado para usar um backend separado. Para questões sobre a implementação do backend, consulte `/docs/backend-setup.md`.
