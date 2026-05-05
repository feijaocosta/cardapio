# 🔄 Correções de Compatibilidade Frontend ↔ Backend

**Data**: 23 de janeiro de 2026  
**Status**: ✅ Aplicado

---

## 📋 Resumo das Mudanças

Após a refatoração do backend para Clean Architecture, as rotas mudaram. Este documento lista todas as correções aplicadas.

---

## 🔴 Problemas Encontrados

### 1. Prefixo `/api/` Faltante
O backend refatorado adicionou o prefixo `/api/` a todas as rotas, mas o frontend ainda chamava sem prefixo.

**Antes (Frontend):**
```
GET  /items
GET  /orders
GET  /menus
POST /menus
```

**Depois (Backend):**
```
GET  /api/items
GET  /api/orders
GET  /api/menus
POST /api/menus
```

### 2. Ordem de Rotas em ItemRoutes
A rota genérica `GET /:id` estava capturando `GET /menu/:menuId`.

**Problema:**
```javascript
router.get('/:id', ...)           // ❌ Captura /menu como se fosse um ID
router.get('/menu/:menuId', ...)  // ❌ Nunca alcançado
```

**Solução:**
```javascript
router.get('/menu/:menuId', ...) // ✅ Específico primeiro
router.get('/:id', ...)           // ✅ Genérico depois
```

### 3. Método HTTP para Atualizar Status do Pedido
Frontend usava `PUT`, backend agora usa `PATCH` (mais semântico).

**Antes:**
```typescript
PUT /api/orders/:id
body: { status: "Em preparação" }
```

**Depois:**
```typescript
PATCH /api/orders/:id/status
body: { status: "Em preparação" }
```

---

## ✅ Correções Aplicadas

### Arquivo: `services/api.ts`

#### 1. Todas as rotas adicionam `/api/`

```typescript
// Itens
getMenuItems()        → GET /api/items           ✅
addMenuItem()         → POST /api/items          ✅
updateMenuItem()      → PUT /api/items/:id       ✅
removeMenuItem()      → DELETE /api/items/:id    ✅

// Pedidos
getOrders()           → GET /api/orders          ✅
addOrder()            → POST /api/orders         ✅
updateOrderStatus()   → PATCH /api/orders/:id/status  ✅

// Menus
getMenus()            → GET /api/menus           ✅
getActiveMenus()      → GET /api/menus?active=true ✅
addMenu()             → POST /api/menus          ✅
addMenuWithLogo()     → POST /api/menus          ✅
updateMenu()          → PUT /api/menus/:id       ✅
removeMenu()          → DELETE /api/menus/:id    ✅
getMenuItemsByMenuId()→ GET /api/items/menu/:menuId ✅

// Configurações
getSettings()         → GET /api/settings        ✅
updateSettings()      → PUT /api/settings        ✅
```

#### 2. Mudança do método HTTP para Order Status

```typescript
// ANTES
await fetchAPI(`/orders/${orderId}`, {
  method: 'PUT',
  body: JSON.stringify({ status }),
});

// DEPOIS
await fetchAPI(`/api/orders/${orderId}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status }),
});
```

---

### Arquivo: `server/src/infrastructure/http/routes/ItemRoutes.ts`

#### Reordenação de Rotas (Específicas Primeiro)

```typescript
// ❌ ANTES - Ordem errada
router.get('/:id', ...)
router.get('/menu/:menuId', ...)  // Nunca alcançado!

// ✅ DEPOIS - Ordem correta
router.get('/menu/:menuId', ...)  // Específico primeiro
router.get('/:id', ...)           // Genérico depois
```

---

## 🧪 Como Testar as Mudanças

### 1. Terminal 1: Iniciar Backend
```bash
cd /Users/feijao/development/cardapio/server
npm run dev
# Deve mostrar: 🚀 Servidor rodando em http://localhost:3000
```

### 2. Terminal 2: Iniciar Frontend
```bash
cd /Users/feijao/development/cardapio
npm run dev
# Deve mostrar a interface React
```

### 3. Testes Manuais

#### Teste 1: Listar Menus
```bash
curl -X GET http://localhost:3000/api/menus
# Deve retornar JSON array com menus
```

#### Teste 2: Listar Items
```bash
curl -X GET http://localhost:3000/api/items
# Deve retornar JSON array com items
```

#### Teste 3: Items de Menu Específico
```bash
curl -X GET http://localhost:3000/api/items/menu/1
# Deve retornar apenas items do menu 1
```

#### Teste 4: Listar Pedidos
```bash
curl -X GET http://localhost:3000/api/orders
# Deve retornar JSON array com pedidos
```

#### Teste 5: Mudar Status de Pedido
```bash
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Em preparação"}'
# Deve atualizar o status
```

---

## 📊 Checklist de Verificação

- [x] Prefixo `/api/` adicionado a todas as rotas do frontend
- [x] Método `updateOrderStatus()` usa `PATCH` em vez de `PUT`
- [x] Rota `/api/items/menu/:menuId` funciona corretamente
- [x] Ordem de rotas em backend está correta
- [x] Todas as chamadas de API compatíveis com novo backend

---

## 🚨 Possíveis Erros e Soluções

### Erro 1: "Cannot GET /items"
**Causa:** Frontend ainda usa rotas velhas sem `/api/`  
**Solução:** Verificar se `services/api.ts` foi atualizado com `/api/`

### Erro 2: "Cannot GET /api/items/menu/1"
**Causa:** Rota genérica `/:id` está capturando antes da rota específica  
**Solução:** Verificar ordem em `ItemRoutes.ts` - `/menu/:menuId` deve vir antes de `/:id`

### Erro 3: "405 Method Not Allowed" em updateOrderStatus
**Causa:** Frontend usa `PUT` mas backend espera `PATCH`  
**Solução:** Verificar se `services/api.ts` usa `PATCH` e endpoint correto `/orders/:id/status`

---

## 📝 Próximas Etapas

1. **Testar toda a aplicação** com o frontend e backend rodando juntos
2. **Verificar console do navegador** em busca de erros de CORS ou 404
3. **Testar fluxos completos:**
   - [ ] Criar menu
   - [ ] Adicionar items ao menu
   - [ ] Criar pedido
   - [ ] Mudar status do pedido
   - [ ] Deletar menu
4. **Se tudo funcionar:** Fazer commit das mudanças

---

## 🔗 Referências

- **Backend Routes:** `/server/src/infrastructure/http/routes/`
- **Frontend API Calls:** `/services/api.ts`
- **Documentação Backend:** `/ARQUITETURA_REFATORACAO.md`

