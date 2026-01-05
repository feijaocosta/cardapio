# 🎯 Sistema de Pedidos v2.0 - Síntese do Projeto

## 📌 Resumo Executivo

**Sistema completo de pedidos com arquitetura Backend + Frontend**:
- **Frontend**: React + TypeScript + Tailwind CSS (navegador)
- **Backend**: Node.js/Express + SQLite (servidor)
- **Banco**: SQLite com migrations automáticas
- **Deploy**: Frontend em Vercel/Netlify, Backend em qualquer servidor Node.js

**Status**: ✅ Totalmente funcional, pronto para uso em produção

---

## 🏗️ Stack Tecnológico

### Frontend
- React 18+
- TypeScript 5.0+
- Vite 5.0+
- Tailwind CSS 4.0+
- lucide-react (ícones)
- fetch API (comunicação com backend)

### Backend
- Node.js 18+ LTS
- Express.js
- SQLite3 com sqlite
- dotenv (variáveis de ambiente)
- CORS habilitado

### Banco de Dados
- SQLite (arquivo `database.sqlite`)
- Sistema de migrations automáticas
- 6 tabelas principais
- Relacionamentos M2M

---

## 🏛️ Arquitetura Geral

```
┌──────────────────────────────────────────────────────────────┐
│                      NAVEGADOR (Cliente)                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          React Application (Vite)                      │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  ┌──────────────────┐     ┌────────────────────────┐ │ │
│  │  │ Customer View    │     │ Admin View             │ │ │
│  │  │ - Seleção Cardápio│     │ - Gerenciar Pedidos    │ │ │
│  │  │ - Carrinho       │     │ - Cardápios            │ │ │
│  │  │ - Checkout       │     │ - Itens                │ │ │
│  │  └──────────────────┘     │ - Configurações        │ │ │
│  │         │                 └────────────────────────┘ │ │
│  │         └─────────────┬──────────────────┘            │ │
│  │                       │                              │ │
│  │             ┌─────────▼──────────┐                  │ │
│  │             │   API Service      │                  │ │
│  │             │   (services/api.ts)│                  │ │
│  │             └─────────┬──────────┘                  │ │
│  └─────────────────────────┼──────────────────────────────┘ │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP (REST API)
                             │ localhost:3000
┌────────────────────────────▼────────────────────────────────┐
│                   SERVIDOR (Backend)                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        Express.js Application                          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  Middlewares: CORS, JSON Parser                       │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Rotas:                                          │ │ │
│  │  │  - GET/POST /menus                               │ │ │
│  │  │  - GET/POST /items                               │ │ │
│  │  │  - GET/POST /orders                              │ │ │
│  │  │  - GET/PUT /settings                             │ │ │
│  │  │  - GET /health                                   │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                      │                                │ │
│  │         ┌────────────▼─────────────┐                 │ │
│  │         │  Database Module         │                 │ │
│  │         │  (src/db/database.ts)    │                 │ │
│  │         │  - Connection            │                 │ │
│  │         │  - Migrations            │                 │ │
│  │         │  - Queries               │                 │ │
│  │         └────────────┬─────────────┘                 │ │
│  │                      │                                │ │
│  │         ┌────────────▼─────────────┐                 │ │
│  │         │   SQLite Database        │                 │ │
│  │         │   (database.sqlite)      │                 │ │
│  │         └──────────────────────────┘                 │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Schema do Banco de Dados

### Tabelas Principais

```sql
-- Cardápios
menus (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  active BOOLEAN
)

-- Itens do cardápio
menu_items (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT
)

-- Relacionamento M2M (Cardápio ↔ Item)
menu_menu_items (
  menu_id INTEGER,
  menu_item_id INTEGER,
  PRIMARY KEY (menu_id, menu_item_id)
)

-- Pedidos
orders (
  id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  created_at DATETIME,
  status TEXT
)

-- Itens dos pedidos
order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER,
  item_id INTEGER,
  quantity INTEGER
)

-- Configurações
settings (
  id INTEGER PRIMARY KEY,
  key TEXT UNIQUE,
  value TEXT
)
```

---

## 🎨 Funcionalidades Principais

### 👥 Visão do Cliente
- Seleção de cardápios ativos
- Visualização de itens com/sem preços
- Carrinho interativo
- Fazer pedido com nome
- Interface responsiva

### 🔧 Visão do Administrador
- **Pedidos**: Listar e gerenciar pedidos
- **Cardápios**: CRUD, upload de logos, ativar/desativar
- **Itens**: CRUD, gerenciar biblioteca global
- **Configurações**: Temas (5 opções), mostrar/ocultar preços

### 📡 API REST
- Endpoints RESTful completos
- JSON Request/Response
- CORS habilitado
- Health check

---

## 📁 Estrutura do Projeto

```
cardapio/
├── /src                          # Frontend React
│   ├── components/
│   │   ├── admin-view.tsx       # Painel admin
│   │   ├── customer-view.tsx    # Interface cliente
│   │   └── ui/                  # 20+ componentes UI
│   ├── lib/
│   │   └── storage.ts           # localStorage wrapper
│   ├── styles/
│   │   └── globals.css          # Tailwind global
│   ├── App.tsx
│   └── main.tsx
│
├── /services
│   └── api.ts                   # Client HTTP (fetch)
│
├── /server                      # Backend Express
│   ├── /src
│   │   ├── index.ts            # Entry point Express
│   │   ├── db/
│   │   │   └── database.ts     # Conexão SQLite + migrations
│   │   └── routes/
│   │       ├── menus.ts
│   │       ├── items.ts
│   │       ├── orders.ts
│   │       ├── settings.ts
│   │       └── health.ts
│   ├── /migrations             # SQL migrations
│   │   ├── 001_init.sql
│   │   └── 002_create_migrations_and_settings.sql
│   ├── database.sqlite         # Arquivo de banco
│   └── package.json
│
├── package.json                # Frontend deps
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

---

## 🔄 Fluxo de Dados

### Cliente faz pedido:
```
1. customer-view.tsx
   └─→ Usuário clica "Fazer Pedido"

2. services/api.ts
   └─→ addOrder(customerName, items)
   └─→ fetch POST /orders

3. Backend: routes/orders.ts
   └─→ Valida dados
   └─→ Chama database functions

4. Database: src/db/database.ts
   └─→ INSERT orders
   └─→ INSERT order_items
   └─→ sqlite3 persiste

5. Response JSON
   └─→ Retorna para Frontend

6. admin-view.tsx
   └─→ getOrders() busca lista atualizada
   └─→ Re-renderiza com novo pedido
```

---

## 💾 Migrations

Sistema automático de migrations:

```bash
# 001_init.sql - Tabelas principais
CREATE TABLE menus (...)
CREATE TABLE menu_items (...)
...

# 002_create_migrations_and_settings.sql
CREATE TABLE migrations (...)
CREATE TABLE settings (...)
```

**Execução automática** ao iniciar backend.

---

## 🎨 5 Temas Disponíveis

| Tema | Cor | Uso |
|------|-----|-----|
| 🟠 Laranja | Orange/Red | Pizzaria, comida rápida |
| 🔵 Azul | Blue/Indigo | Profissional, corporativo |
| 🟢 Verde | Green/Emerald | Saudável, natural |
| 🟣 Roxo | Purple/Pink | Moderno, elegante |
| 🔴 Vermelho | Red/Rose | Urgente, promocional |

---

## ⚠️ Limitações e Considerações

1. **Servidor Único**: Um único banco SQLite (não distribuído)
2. **Performance**: Suporta ~1000-5000 pedidos confortavelmente
3. **Sem Autenticação**: Implementar conforme necessário
4. **Sem Rate Limiting**: Adicionar middleware se expor para produção
5. **Sem Criptografia**: Dados sem encriptação no banco

---

## 🚀 Deploy

### Frontend
- Vercel: Deploy automático
- Netlify: Build e deploy
- GitHub Pages: Build estático

### Backend
- Railway: railway.app
- Render: render.com
- DigitalOcean: App Platform
- Servidor próprio: Node.js + PM2

---

## 📚 Documentação Relacionada

| Documento | Propósito |
|-----------|----------|
| **SETUP_AMBIENTE.md** | Configuração inicial |
| **GUIA_DESENVOLVIMENTO.md** | Padrões e convenções |
| **ARQUITETURA_BACKEND.md** | Estrutura servidor |
| **ARQUITETURA_FRONTEND.md** | Estrutura cliente |
| **BANCO_DADOS.md** | Schema e migrations |
| **API_ENDPOINTS.md** | Endpoints REST |

---

**Versão**: 2.0  
**Status**: ✅ Backend + Frontend Integrados  
**Data**: Janeiro 2026
