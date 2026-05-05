# 📚 Índice de Documentação - Sistema de Pedidos v2.0

## 🎯 Bem-vindo!

Escolha o documento que melhor se adequa ao seu perfil:

---

## 👨‍💻 Para Desenvolvedores

### 1️⃣ **[PROJETO_SINTESE.md](PROJETO_SINTESE.md)** ← COMECE AQUI
- Síntese executiva do projeto
- Stack tecnológico (React, Node.js, SQLite)
- Visão geral da arquitetura
- Funcionalidades principais
- ⏱️ Tempo: **5 minutos**

### 2️⃣ **[SETUP_AMBIENTE.md](SETUP_AMBIENTE.md)**
- Pré-requisitos (Node.js, npm)
- Instalação rápida (frontend + backend)
- Configuração de variáveis de ambiente
- Troubleshooting comum
- ⏱️ Tempo: **10 minutos**

### 3️⃣ **[GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md)**
- Convenções de código
- Padrões de componentes (React e Express)
- Estrutura de arquivos
- Validação e tratamento de erros
- TypeScript best practices
- ⏱️ Tempo: **20 minutos**

---

## 🏗️ Para Arquitetos & Leads

### 4️⃣ **[ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md)**
- Estrutura do servidor Express
- Database module (SQLite + migrations)
- Rotas da API (5 endpoints principais)
- Padrões de desenvolvimento backend
- ⏱️ Tempo: **15 minutos**

### 5️⃣ **[ARQUITETURA_FRONTEND.md](ARQUITETURA_FRONTEND.md)**
- Estrutura do React
- Componentes principais (App, CustomerView, AdminView)
- Fluxo de dados e renderização
- Sistema de temas
- ⏱️ Tempo: **15 minutos**

### 6️⃣ **[BANCO_DADOS.md](BANCO_DADOS.md)**
- Schema SQLite completo (7 tabelas)
- Relacionamentos (M2M, 1:M)
- Sistema de migrations
- Queries principais
- Backup e troubleshooting
- ⏱️ Tempo: **15 minutos**

---

## 🚀 Começo Rápido

### ⚡ Se você tem 5 minutos:
```bash
# Ler:
PROJETO_SINTESE.md

# Fazer:
cd server && npm install && npm run dev
# (em outro terminal)
npm install && npm run dev
```

### ⏱️ Se você tem 30 minutos:
```
1. PROJETO_SINTESE.md (5 min)
2. SETUP_AMBIENTE.md (10 min)
3. Rodar projeto (10 min)
4. Explorar interface (5 min)
```

### 📚 Se você tem 2 horas (Completo):
```
1. PROJETO_SINTESE.md (5 min)
2. SETUP_AMBIENTE.md (10 min)
3. GUIA_DESENVOLVIMENTO.md (20 min)
4. ARQUITETURA_BACKEND.md (15 min)
5. ARQUITETURA_FRONTEND.md (15 min)
6. BANCO_DADOS.md (15 min)
7. Explorar código (25 min)
```

---

## 📊 Mapa de Navegação

```
START
  │
  ├─→ [PROJETO_SINTESE.md] ← Visão Geral
  │        │
  │        ├─→ Desenvolvedor?
  │        │   └─→ [SETUP_AMBIENTE.md]
  │        │       └─→ [GUIA_DESENVOLVIMENTO.md]
  │        │           ├─→ [ARQUITETURA_BACKEND.md]
  │        │           ├─→ [ARQUITETURA_FRONTEND.md]
  │        │           └─→ [BANCO_DADOS.md]
  │        │
  │        └─→ Arquiteto/Lead?
  │            └─→ [ARQUITETURA_BACKEND.md]
  │                ├─→ [ARQUITETURA_FRONTEND.md]
  │                └─→ [BANCO_DADOS.md]
  │
  └─→ Dúvidas?
      └─→ Consulte todos os arquivos (cada um tem troubleshooting)
```

---

## 🎯 Qual Documento Ler?

### "Quero entender o projeto rapidamente"
→ **[PROJETO_SINTESE.md](PROJETO_SINTESE.md)**

### "Preciso instalar e rodar agora"
→ **[SETUP_AMBIENTE.md](SETUP_AMBIENTE.md)**

### "Vou desenvolver features novas"
→ **[GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md)** + **[ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md)** + **[ARQUITETURA_FRONTEND.md](ARQUITETURA_FRONTEND.md)**

### "Preciso entender a arquitetura"
→ **[ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md)** + **[ARQUITETURA_FRONTEND.md](ARQUITETURA_FRONTEND.md)**

### "Preciso trabalhar com banco de dados"
→ **[BANCO_DADOS.md](BANCO_DADOS.md)**

### "Tenho um problema/erro"
→ Procure por "troubleshooting" em cada arquivo

---

## 📁 Estrutura dos 6 Documentos

```
Documentação/
│
├── 1. PROJETO_SINTESE.md
│   ├── Resumo Executivo
│   ├── Stack Tecnológico
│   ├── Arquitetura Geral
│   └── Links para Documentação
│
├── 2. SETUP_AMBIENTE.md
│   ├── Pré-requisitos
│   ├── Instalação Rápida
│   ├── Configuração Detalhada
│   └── Troubleshooting
│
├── 3. GUIA_DESENVOLVIMENTO.md
│   ├── Convenções de Código
│   ├── Estrutura de Arquivos
│   ├── Padrões de Componentes
│   └── Boas Práticas
│
├── 4. ARQUITETURA_BACKEND.md
│   ├── Visão Geral
│   ├── Estrutura de Pastas
│   ├── Entry Point
│   ├── Database Module
│   ├── Rotas da API
│   └── Padrões Backend
│
├── 5. ARQUITETURA_FRONTEND.md
│   ├── Visão Geral
│   ├── Estrutura de Pastas
│   ├── Componentes Principais
│   ├── Sistema de Temas
│   └── Integração com API
│
└── 6. BANCO_DADOS.md
    ├── Schema Completo
    ├── Relacionamentos
    ├── Migrations
    ├── Queries Principais
    └── Backup & Troubleshooting
```

---

## ✨ Destaques de Cada Documento

### PROJETO_SINTESE.md
✅ Melhor para: Visão geral rápida  
📊 Contém: Diagramas, stack, limitações  
⏱️ Leitura: 5 minutos  

### SETUP_AMBIENTE.md
✅ Melhor para: Instalação e configuração  
🔧 Contém: Passo a passo, debugging  
⏱️ Leitura: 10 minutos  

### GUIA_DESENVOLVIMENTO.md
✅ Melhor para: Desenvolvimento consistente  
📝 Contém: Padrões, exemplos de código  
⏱️ Leitura: 20 minutos  

### ARQUITETURA_BACKEND.md
✅ Melhor para: Desenvolvimento do servidor  
🖥️ Contém: Rotas, database, migrations  
⏱️ Leitura: 15 minutos  

### ARQUITETURA_FRONTEND.md
✅ Melhor para: Desenvolvimento do cliente  
🎨 Contém: Componentes, temas, fluxos  
⏱️ Leitura: 15 minutos  

### BANCO_DADOS.md
✅ Melhor para: Trabalhar com dados  
💾 Contém: Schema, queries, backup  
⏱️ Leitura: 15 minutos  

---

## 🎓 Ordem de Leitura Recomendada

### Para Novo Desenvolvedor
1. PROJETO_SINTESE.md
2. SETUP_AMBIENTE.md
3. GUIA_DESENVOLVIMENTO.md
4. ARQUITETURA_FRONTEND.md
5. ARQUITETURA_BACKEND.md
6. BANCO_DADOS.md

### Para Arquiteto/Lead
1. PROJETO_SINTESE.md
2. ARQUITETURA_BACKEND.md
3. ARQUITETURA_FRONTEND.md
4. BANCO_DADOS.md
5. GUIA_DESENVOLVIMENTO.md
6. SETUP_AMBIENTE.md

### Para DevOps/Infra
1. PROJETO_SINTESE.md
2. SETUP_AMBIENTE.md
3. ARQUITETURA_BACKEND.md
4. BANCO_DADOS.md

---

## 🔗 Links Rápidos

| Documento | Quando Usar | Tempo |
|-----------|------------|-------|
| [PROJETO_SINTESE.md](PROJETO_SINTESE.md) | Visão geral | 5 min |
| [SETUP_AMBIENTE.md](SETUP_AMBIENTE.md) | Instalar | 10 min |
| [GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md) | Desenvolver | 20 min |
| [ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md) | Backend | 15 min |
| [ARQUITETURA_FRONTEND.md](ARQUITETURA_FRONTEND.md) | Frontend | 15 min |
| [BANCO_DADOS.md](BANCO_DADOS.md) | Dados | 15 min |

---

## 💡 Dicas Úteis

### Procurando algo específico?
Use `Ctrl+F` (ou `Cmd+F` no Mac) em cada documento para buscar

### Vendo muito código?
Pule a seção de código detalhado se preferir conceitos gerais

### Quer aprender fazendo?
Leia [SETUP_AMBIENTE.md](SETUP_AMBIENTE.md) e comece a rodar o projeto

---

## ✅ Próximos Passos

1. **Escolha seu documento** baseado no seu perfil acima
2. **Leia** o documento escolhido
3. **Implemente** o conhecimento
4. **Consulte** outros documentos conforme necessário

---

## 🆘 Ficou Perdido?

Se você não sabe por onde começar:

**Opção 1**: Leia todos na ordem (90 minutos)
**Opção 2**: Comece com [PROJETO_SINTESE.md](PROJETO_SINTESE.md) e siga as recomendações
**Opção 3**: Procure por "troubleshooting" em cada documento

---

**Versão**: 2.0  
**Data**: Janeiro 2026  
**Status**: ✅ Documentação Consolidada

**Bom desenvolvimento! 🚀**

---

# 📡 API Endpoints - Sistema de Pedidos v2.0

## 📌 Visão Geral

Documentação completa dos endpoints REST da API Express. A API roda em `http://localhost:3000`.

---

## 🔌 Base URL

```
http://localhost:3000
```

### Headers Necessários

```json
{
  "Content-Type": "application/json"
}
```

---

## ✅ Health Check

### GET /health

Verifica se o servidor está online.

**Request:**
```bash
curl http://localhost:3000/health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-05T10:30:00Z"
}
```

---

## 🍕 Menus (Cardápios)

### GET /menus

Listar todos os cardápios.

**Request:**
```bash
curl http://localhost:3000/menus
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Cardápio Principal",
    "description": "Nossos pratos principais",
    "logo": "https://exemplo.com/logo.jpg",
    "active": 1
  },
  {
    "id": 2,
    "name": "Cardápio Kids",
    "description": "Itens para crianças",
    "logo": "https://exemplo.com/kids-logo.jpg",
    "active": 1
  }
]
```

---

### POST /menus

Criar um novo cardápio.

**Request:**
```bash
curl -X POST http://localhost:3000/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cardápio de Verão",
    "description": "Pratos refrescantes",
    "logo": "https://exemplo.com/summer-logo.jpg"
  }'
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Cardápio de Verão",
  "description": "Pratos refrescantes",
  "logo": "https://exemplo.com/summer-logo.jpg",
  "active": true
}
```

---

### PUT /menus/:id

Atualizar um cardápio existente.

**Request:**
```bash
curl -X PUT http://localhost:3000/menus/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cardápio Atualizado",
    "description": "Nova descrição",
    "logo": "https://exemplo.com/novo-logo.jpg",
    "active": false
  }'
```

**Response (200 OK):**
```json
{
  "message": "Menu updated"
}
```

---

### DELETE /menus/:id

Deletar um cardápio (também remove itens associados).

**Request:**
```bash
curl -X DELETE http://localhost:3000/menus/1
```

**Response (200 OK):**
```json
{
  "message": "Menu deleted"
}
```

---

## 🍔 Items (Itens do Cardápio)

### GET /items

Listar todos os itens do cardápio.

**Request:**
```bash
curl http://localhost:3000/items
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Pizza Margherita",
    "price": 35.90,
    "description": "Molho, mozzarela e manjericão"
  },
  {
    "id": 2,
    "name": "Hamburger Artesanal",
    "price": 28.50,
    "description": "Pão caseiro, carne premium"
  }
]
```

---

### POST /items

Criar um novo item.

**Request:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Calabresa",
    "price": 39.90,
    "description": "Pizza com calabresa e cebola"
  }'
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Pizza Calabresa",
  "price": 39.90,
  "description": "Pizza com calabresa e cebola"
}
```

**Validação:**
- `name` é obrigatório
- `price` é obrigatório e deve ser >= 0

**Response (400 Bad Request):**
```json
{
  "error": "Nome e preço são obrigatórios"
}
```

---

### PUT /items/:id

Atualizar um item existente.

**Request:**
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margherita Premium",
    "price": 42.90,
    "description": "Margherita com ingredientes importados"
  }'
```

**Response (200 OK):**
```json
{
  "message": "Item updated"
}
```

---

### DELETE /items/:id

Deletar um item (também remove de todos os cardápios).

**Request:**
```bash
curl -X DELETE http://localhost:3000/items/1
```

**Response (200 OK):**
```json
{
  "message": "Item deleted"
}
```

---

## 🛒 Orders (Pedidos)

### GET /orders

Listar todos os pedidos (ordenado por data DESC).

**Request:**
```bash
curl http://localhost:3000/orders
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "customer_name": "João Silva",
    "created_at": "2026-01-05T10:30:00Z",
    "status": "Pendente",
    "items": "1:2,2:1"
  },
  {
    "id": 2,
    "customer_name": "Maria Santos",
    "created_at": "2026-01-05T11:00:00Z",
    "status": "Em preparação",
    "items": "3:1"
  }
]
```

---

### POST /orders

Criar um novo pedido.

**Request:**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Pedro Costa",
    "items": [
      {
        "id": 1,
        "quantity": 2
      },
      {
        "id": 2,
        "quantity": 1
      }
    ]
  }'
```

**Response (201 Created):**
```json
{
  "id": 3,
  "customerName": "Pedro Costa",
  "status": "Pendente",
  "items": [
    {
      "id": 1,
      "quantity": 2
    },
    {
      "id": 2,
      "quantity": 1
    }
  ],
  "createdAt": "2026-01-05T11:30:00Z"
}
```

**Observações:**
- Usa transação SQL (BEGIN/COMMIT/ROLLBACK)
- Se houver erro, nenhum item é inserido
- `customerName` é obrigatório
- `items` deve ter pelo menos um item

---

### PATCH /orders/:id/status

Atualizar o status de um pedido.

**Request:**
```bash
curl -X PATCH http://localhost:3000/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Em preparação"
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "customerName": "Joao Silva",
  "status": "Em preparação"
}
```

**Status permitidos:**
- `Pendente`
- `Em preparação`
- `Pronto`
- `Entregue`
- `Cancelado`

---

## ⚙️ Settings (Configurações)

### GET /settings

Obter todas as configurações do sistema.

**Request:**
```bash
curl http://localhost:3000/settings
```

**Response (200 OK):**
```json
{
  "showPrices": true,
  "theme": "orange",
  "currency": "BRL"
}
```

---

### PUT /settings

Atualizar configurações (uma ou múltiplas).

**Request:**
```bash
curl -X PUT http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "showPrices": false,
    "theme": "blue"
  }'
```

**Response (200 OK):**
```json
{
  "message": "Settings updated"
}
```

**Configurações disponíveis:**
- `showPrices` (boolean) - Exibir preços no cardápio
- `theme` (string) - Tema de cores (orange, blue, green, purple, red)
- `currency` (string) - Moeda (BRL, USD, EUR)

---

## 🔗 Endpoints Relacionados (M2M)

### GET /menus/:id/items

Listar itens de um cardápio específico.

**Request:**
```bash
curl http://localhost:3000/menus/1/items
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Pizza Margherita",
    "price": 35.90,
    "description": "Molho, mozzarela e manjericão"
  },
  {
    "id": 2,
    "name": "Hamburger Artesanal",
    "price": 28.50,
    "description": "Pão caseiro, carne premium"
  }
]
```

---

### POST /menus/:id/items

Adicionar um item a um cardápio.

**Request:**
```bash
curl -X POST http://localhost:3000/menus/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 3
  }'
```

**Response (201 Created):**
```json
{
  "message": "Item added to menu"
}
```

---

### DELETE /menus/:id/items/:itemId

Remover um item de um cardápio.

**Request:**
```bash
curl -X DELETE http://localhost:3000/menus/1/items/3
```

**Response (200 OK):**
```json
{
  "message": "Item removed from menu"
}
```

---

## 📊 Códigos de Status HTTP

| Código | Significado | Exemplo |
|--------|------------|---------|
| **200** | OK | GET bem-sucedido |
| **201** | Created | POST bem-sucedido |
| **400** | Bad Request | Dados inválidos |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Conflito (ex: chave única) |
| **500** | Server Error | Erro no servidor |

---

## 🔍 Exemplos de Requisições Completas

### Fluxo Completo: Criar e Listar Pedido

```bash
# 1. Criar um novo cardápio
curl -X POST http://localhost:3000/menus \
  -H "Content-Type: application/json" \
  -d '{"name":"Cardápio Teste","description":"Para testes"}'

# 2. Criar um item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Pizza Teste","price":30,"description":"Pizza de teste"}'

# 3. Adicionar item ao cardápio
curl -X POST http://localhost:3000/menus/1/items \
  -H "Content-Type: application/json" \
  -d '{"itemId":1}'

# 4. Fazer um pedido
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Cliente Teste","items":[{"id":1,"quantity":2}]}'

# 5. Listar pedidos
curl http://localhost:3000/orders

# 6. Atualizar status do pedido
curl -X PATCH http://localhost:3000/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Em preparação"}'
```

---

## 🧪 Testar com Postman/Insomnia

### Import Collection

```json
{
  "info": {
    "name": "Sistema de Pedidos",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/health"
      }
    },
    {
      "name": "List Menus",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/menus"
      }
    },
    {
      "name": "Create Order",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/orders",
        "body": {
          "mode": "raw",
          "raw": "{\"customerName\":\"Test\",\"items\":[{\"id\":1,\"quantity\":1}]}"
        }
      }
    }
  ]
}
```

---

## 🐛 Troubleshooting

### "Connection refused"
- Verifique se o backend está rodando: `npm run dev` na pasta `server/`
- Verifique a porta: padrão é 3000

### "CORS error"
- Backend já tem CORS habilitado
- Se não funcionar, verifique `server/src/index.ts`

### "404 Not Found"
- Verifique se o endpoint está correto
- Verifique se o ID existe no banco

### "500 Server Error"
- Verifique o console do servidor
- Pode ser erro de validação ou banco de dados

---

## 📚 Documentação Relacionada

- **[ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md)** - Implementação dos endpoints
- **[BANCO_DADOS.md](BANCO_DADOS.md)** - Schema das tabelas
- **[GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md)** - Padrões de desenvolvimento

---

**Versão**: 2.0  
**Data**: Janeiro 2026  
**Status**: ✅ API Completa
