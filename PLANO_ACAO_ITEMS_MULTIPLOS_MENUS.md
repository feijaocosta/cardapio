# 📋 PLANO DE AÇÃO: Items em Múltiplos Menus

**Data de Criação:** 2024
**Status:** Planejado
**Objetivo:** Refatorar o sistema para que um item possa estar associado a múltiplos menus (relacionamento N:N)

---

## 📌 CONTEXTO DO PROBLEMA

### Situação Atual
- Um item é criado com um `menuId` obrigatório
- Estrutura: 1 Menu → N Items (relacionamento 1:N)
- Erro ao tentar criar item: "ID do menu é obrigatório"
- Um item não pode estar em múltiplos menus

### Situação Desejada
- Items podem ser criados SEM menu associado
- Um item pode estar em múltiplos menus
- Um menu pode ter múltiplos items
- Estrutura: N Menus ↔ N Items (relacionamento N:N)

### Por que mudar?
- Um item como "Água" ou "Café" pode estar em múltiplos menus
- Evita duplicação de dados
- Mais flexibilidade no gerenciamento de cardápios

---

## 🎯 FASES DO PROJETO

### ✅ FASE 1: Banco de Dados
- [ ] 1.1 - Criar migration para tabela `menu_items` (relacionamento N:N)
- [ ] 1.2 - Remover `menu_id` da tabela `items`
- [ ] 1.3 - Migrar dados existentes para `menu_items`

### ✅ FASE 2: Backend - Domain Layer
- [ ] 2.1 - Atualizar entidade `MenuItem` (remover `menuId`)
- [ ] 2.2 - Criar entidade `MenuItemAssociation` (novo relacionamento)
- [ ] 2.3 - Atualizar `ItemRepository` com novos métodos
- [ ] 2.4 - Atualizar `ItemService` com novos métodos

### ✅ FASE 3: Backend - Application Layer
- [ ] 3.1 - Atualizar `CreateItemDTO` (remover `menuId` obrigatório)
- [ ] 3.2 - Criar `AddItemToMenuDTO`
- [ ] 3.3 - Atualizar `ItemResponseDTO`

### ✅ FASE 4: Backend - HTTP Layer
- [ ] 4.1 - Atualizar `ItemController` (remover `menuId` obrigatório)
- [ ] 4.2 - Adicionar endpoints para gerenciar relacionamentos
- [ ] 4.3 - Atualizar routes

### ✅ FASE 5: Frontend - API
- [ ] 5.1 - Remover `menuId` da interface `MenuItem`
- [ ] 5.2 - Atualizar função `addMenuItem()`
- [ ] 5.3 - Criar funções para relacionamentos

### ✅ FASE 6: Frontend - UI
- [ ] 6.1 - Atualizar componente Admin
- [ ] 6.2 - Separar fluxo: Criar Item → Associar a Menus

---

## 📊 ARQUIVOS QUE SERÃO MODIFICADOS

### Backend
```
server/src/
├── domain/
│   ├── menus/
│   │   ├── MenuItem.ts              (MODIFICAR - remover menuId)
│   │   ├── MenuItemAssociation.ts   (CRIAR - novo)
│   │   ├── ItemRepository.ts        (MODIFICAR - novos métodos)
│   │   └── ItemService.ts           (MODIFICAR - novos métodos)
│   └── ...
├── application/
│   ├── dtos/
│   │   └── item/
│   │       ├── index.ts             (MODIFICAR - CreateItemDTO, ResponseDTO)
│   │       ├── CreateItemDTO.ts     (MODIFICAR - remover menuId)
│   │       ├── AddItemToMenuDTO.ts  (CRIAR - novo)
│   │       └── ...
│   └── ...
├── infrastructure/
│   ├── http/
│   │   ├── controllers/
│   │   │   └── ItemController.ts    (MODIFICAR - novos endpoints)
│   │   └── routes/
│   │       └── itemRoutes.ts        (MODIFICAR - novos endpoints)
│   ├── database/
│   │   └── migrations/
│   │       └── 004_items_many_to_many.ts (CRIAR - migration)
│   └── ...
└── ...
```

### Frontend
```
src/
├── services/
│   └── api.ts                       (MODIFICAR - remover menuId, novos métodos)
├── components/
│   └── admin-view.tsx               (MODIFICAR - separar fluxo)
└── ...
```

---

## 📋 TAREFAS DETALHADAS

---

## FASE 1: Banco de Dados

### Tarefa 1.1: Criar Migration para Tabela `menu_items`

**Arquivo:** `server/src/infrastructure/database/migrations/004_create_menu_items_table.ts`

**O que fazer:**
1. Criar tabela `menu_items` com colunas:
   - `id` (PK, auto-increment)
   - `menu_id` (FK para `menus.id`)
   - `item_id` (FK para `items.id`)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
2. Adicionar índice composto em `(menu_id, item_id)`
3. Adicionar restrição UNIQUE em `(menu_id, item_id)`

**Código esperado:**
```sql
CREATE TABLE menu_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  menu_id INT NOT NULL,
  item_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_menu_item (menu_id, item_id),
  KEY idx_menu_id (menu_id),
  KEY idx_item_id (item_id),
  
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);
```

---

### Tarefa 1.2: Modificar Tabela `items` - Remover `menu_id`

**Arquivo:** `server/src/infrastructure/database/migrations/005_remove_menu_id_from_items.ts`

**O que fazer:**
1. Criar migration que remove coluna `menu_id` da tabela `items`
2. Manter as demais colunas: `id`, `name`, `price`, `description`, `created_at`, `updated_at`

**Código esperado:**
```sql
ALTER TABLE items DROP FOREIGN KEY items_ibfk_1;
ALTER TABLE items DROP COLUMN menu_id;
```

**Nota:** Esta migration deve executar DEPOIS que os dados forem migrados (Tarefa 1.3)

---

### Tarefa 1.3: Migrar Dados Existentes

**Arquivo:** `server/src/infrastructure/database/migrations/006_migrate_items_to_menu_items.ts`

**O que fazer:**
1. Criar migration que copia dados da coluna `menu_id` dos items para a tabela `menu_items`
2. Para cada item existente, criar um registro em `menu_items`

**Código esperado:**
```sql
INSERT INTO menu_items (menu_id, item_id)
SELECT menu_id, id FROM items WHERE menu_id IS NOT NULL;
```

**Sequência de execução das migrations:**
1. Tarefa 1.1 (criar tabela `menu_items`)
2. Tarefa 1.3 (migrar dados)
3. Tarefa 1.2 (remover coluna `menu_id` de `items`)

---

## FASE 2: Backend - Domain Layer

### Tarefa 2.1: Atualizar Entidade `MenuItem`

**Arquivo:** `server/src/domain/menus/MenuItem.ts`

**O que fazer:**
1. Remover propriedade `menuId` da classe
2. Manter: `id`, `name`, `price`, `description`
3. Adicionar propriedades opcionais para quando buscar items com dados da query

**Estrutura esperada:**
```typescript
export class MenuItem {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public description?: string
  ) {}
  
  static create(id: number, name: string, price: number, description?: string): MenuItem {
    return new MenuItem(id, name, price, description);
  }
}
```

---

### Tarefa 2.2: Criar Entidade `MenuItemAssociation`

**Arquivo:** `server/src/domain/menus/MenuItemAssociation.ts` (NOVO)

**O que fazer:**
1. Criar classe para representar o relacionamento entre Menu e Item
2. Propriedades: `id`, `menuId`, `itemId`, `createdAt`

**Estrutura esperada:**
```typescript
export class MenuItemAssociation {
  constructor(
    public id: number,
    public menuId: number,
    public itemId: number,
    public createdAt: Date
  ) {}
}
```

---

### Tarefa 2.3: Atualizar `ItemRepository`

**Arquivo:** `server/src/domain/menus/ItemRepository.ts`

**O que fazer:**
1. Remover método `findByMenuId()` (será criado novo endpoint)
2. Adicionar novos métodos:
   - `addItemToMenu(menuId: number, itemId: number): Promise<void>`
   - `removeItemFromMenu(menuId: number, itemId: number): Promise<void>`
   - `getItemsByMenuId(menuId: number): Promise<MenuItem[]>`
   - `getMenusByItemId(itemId: number): Promise<number[]>` (retorna array de menu IDs)

**Assinatura esperada:**
```typescript
export interface IItemRepository {
  // ... métodos existentes ...
  addItemToMenu(menuId: number, itemId: number): Promise<void>;
  removeItemFromMenu(menuId: number, itemId: number): Promise<void>;
  getItemsByMenuId(menuId: number): Promise<MenuItem[]>;
  getMenusByItemId(itemId: number): Promise<number[]>;
}
```

---

### Tarefa 2.4: Atualizar `ItemService`

**Arquivo:** `server/src/domain/menus/ItemService.ts`

**O que fazer:**
1. Atualizar método `createItem()` para NÃO exigir `menuId`
2. Adicionar novos métodos de orquestração:
   - `addItemToMenu(menuId, itemId): Promise<void>`
   - `removeItemFromMenu(menuId, itemId): Promise<void>`
   - `getItemsByMenuId(menuId): Promise<MenuItem[]>`

**Assinatura esperada:**
```typescript
export class ItemService {
  async createItem(name: string, price: number, description?: string): Promise<MenuItem> {
    // Validações
    // Criar item SEM menuId
  }
  
  async addItemToMenu(menuId: number, itemId: number): Promise<void> {
    // Validar se menu existe
    // Validar se item existe
    // Adicionar à tabela menu_items
  }
  
  async removeItemFromMenu(menuId: number, itemId: number): Promise<void> {
    // Remover de menu_items
  }
  
  async getItemsByMenuId(menuId: number): Promise<MenuItem[]> {
    // Buscar items deste menu
  }
}
```

---

## FASE 3: Backend - Application Layer (DTOs)

### Tarefa 3.1: Atualizar `CreateItemDTO`

**Arquivo:** `server/src/application/dtos/item/CreateItemDTO.ts` (ou similar)

**O que fazer:**
1. Remover campo `menuId` do DTO
2. Manter validação obrigatória para: `name`, `price`
3. Fazer `description` opcional

**Estrutura esperada:**
```typescript
export interface CreateItemDTO {
  name: string;        // Obrigatório
  price: number;       // Obrigatório
  description?: string; // Opcional
}
```

**Validações:**
- `name`: não vazio, string
- `price`: number, > 0
- `description`: string, opcional

---

### Tarefa 3.2: Criar `AddItemToMenuDTO`

**Arquivo:** `server/src/application/dtos/item/AddItemToMenuDTO.ts` (NOVO)

**O que fazer:**
1. Criar DTO para associar item a menu
2. Campos: `menuId`, `itemId`

**Estrutura esperada:**
```typescript
export interface AddItemToMenuDTO {
  menuId: number;  // Obrigatório
  itemId: number;  // Obrigatório
}
```

**Validações:**
- `menuId`: number, > 0, deve existir
- `itemId`: number, > 0, deve existir

---

### Tarefa 3.3: Atualizar `ItemResponseDTO`

**Arquivo:** `server/src/application/dtos/item/ItemResponseDTO.ts` (ou similar)

**O que fazer:**
1. Remover `menuId` da resposta
2. Manter: `id`, `name`, `price`, `description`
3. Opcionalmente adicionar `menuIds?: number[]` para quando necessário

**Estrutura esperada:**
```typescript
export interface ItemResponseDTO {
  id: number;
  name: string;
  price: number;
  description?: string;
  menuIds?: number[]; // Opcional, quando incluir relacionamentos
}
```

---

## FASE 4: Backend - HTTP Layer

### Tarefa 4.1: Atualizar `ItemController` - Remover `menuId` Obrigatório

**Arquivo:** `server/src/infrastructure/http/controllers/ItemController.ts`

**O que fazer:**
1. Atualizar método `POST /api/items` (criar item)
   - NÃO exigir `menuId` no body
   - Aceitar apenas: `name`, `price`, `description`
2. Manter os demais métodos (GET, PUT, DELETE)

**Código esperado para método create:**
```typescript
async create(req: Request, res: Response): Promise<void> {
  const { name, price, description } = req.body;
  
  // Validar campos obrigatórios
  if (!name || price === undefined) {
    throw new BadRequestError('Nome e preço são obrigatórios');
  }
  
  // Criar item SEM menuId
  const item = await this.itemService.createItem(name, price, description);
  
  res.status(201).json(item);
}
```

---

### Tarefa 4.2: Adicionar Endpoints para Relacionamentos

**Arquivo:** `server/src/infrastructure/http/controllers/ItemController.ts`

**O que fazer:**
1. Adicionar método `addItemToMenu`:
   - `POST /api/menus/:menuId/items/:itemId`
   - Parâmetros: `menuId` (path), `itemId` (path)
   - Resposta: 201 Created ou 200 OK

2. Adicionar método `removeItemFromMenu`:
   - `DELETE /api/menus/:menuId/items/:itemId`
   - Parâmetros: `menuId` (path), `itemId` (path)
   - Resposta: 204 No Content

3. Adicionar método `getItemsByMenu`:
   - `GET /api/menus/:menuId/items`
   - Parâmetro: `menuId` (path)
   - Resposta: Array de Items

**Código esperado:**
```typescript
async addItemToMenu(req: Request, res: Response): Promise<void> {
  const { menuId, itemId } = req.params;
  
  await this.itemService.addItemToMenu(Number(menuId), Number(itemId));
  
  res.status(200).json({ message: 'Item adicionado ao menu' });
}

async removeItemFromMenu(req: Request, res: Response): Promise<void> {
  const { menuId, itemId } = req.params;
  
  await this.itemService.removeItemFromMenu(Number(menuId), Number(itemId));
  
  res.status(204).send();
}

async getItemsByMenu(req: Request, res: Response): Promise<void> {
  const { menuId } = req.params;
  
  const items = await this.itemService.getItemsByMenuId(Number(menuId));
  
  res.status(200).json(items);
}
```

---

### Tarefa 4.3: Atualizar Routes

**Arquivo:** `server/src/infrastructure/http/routes/itemRoutes.ts`

**O que fazer:**
1. Manter rotas existentes: `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`
2. Remover rota antiga `GET /api/items/menu/:menuId` (será substituída)
3. Adicionar novas rotas:
   - `GET /api/menus/:menuId/items` (buscar items de um menu)
   - `POST /api/menus/:menuId/items/:itemId` (adicionar item a menu)
   - `DELETE /api/menus/:menuId/items/:itemId` (remover item de menu)

**Estrutura esperada:**
```typescript
router.get('/items', itemController.getAll);
router.post('/items', itemController.create);
router.put('/items/:id', itemController.update);
router.delete('/items/:id', itemController.delete);

// Novas rotas para relacionamentos
router.get('/menus/:menuId/items', itemController.getItemsByMenu);
router.post('/menus/:menuId/items/:itemId', itemController.addItemToMenu);
router.delete('/menus/:menuId/items/:itemId', itemController.removeItemFromMenu);
```

---

## FASE 5: Frontend - API Service

### Tarefa 5.1: Remover `menuId` da Interface `MenuItem`

**Arquivo:** `services/api.ts`

**O que fazer:**
1. Atualizar interface `MenuItem`
2. Remover propriedade `menuId`
3. Manter: `id`, `name`, `price`, `description`

**Estrutura esperada:**
```typescript
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}
```

---

### Tarefa 5.2: Atualizar Função `addMenuItem()`

**Arquivo:** `services/api.ts`

**O que fazer:**
1. Adaptar função para NOT enviar `menuId`
2. Parâmetro: apenas `item` com `name`, `price`, `description`

**Código esperado:**
```typescript
export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  return fetchAPI<MenuItem>('/api/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}
```

**Uso esperado (sem menuId):**
```typescript
await addMenuItem({
  name: 'Pizza Calabresa',
  price: 45.00,
  description: 'Pizza com calabresa'
});
```

---

### Tarefa 5.3: Criar Funções para Relacionamentos

**Arquivo:** `services/api.ts`

**O que fazer:**
1. Adicionar função `addItemToMenu(menuId, itemId)`
2. Adicionar função `removeItemFromMenu(menuId, itemId)`
3. Adicionar função `getMenuItemsByMenuId(menuId)` (adaptar a existente)

**Código esperado:**
```typescript
export async function getMenuItemsByMenuId(menuId: number): Promise<MenuItem[]> {
  return fetchAPI<MenuItem[]>(`/api/menus/${menuId}/items`);
}

export async function addItemToMenu(menuId: number, itemId: number): Promise<void> {
  await fetchAPI(`/api/menus/${menuId}/items/${itemId}`, {
    method: 'POST',
  });
}

export async function removeItemFromMenu(menuId: number, itemId: number): Promise<void> {
  await fetchAPI(`/api/menus/${menuId}/items/${itemId}`, {
    method: 'DELETE',
  });
}
```

---

## FASE 6: Frontend - UI Component

### Tarefa 6.1: Atualizar Componente Admin

**Arquivo:** `src/components/admin-view.tsx`

**O que fazer:**
1. Remover estado `selectedMenuId` do formulário de criação de items
2. Remover dropdown de menu do formulário de criação
3. Manter apenas: `name`, `price`, `description`

**Código esperado:**
```typescript
// Estados para criar item
const [newItemName, setNewItemName] = useState('');
const [newItemPrice, setNewItemPrice] = useState('');
const [newItemDescription, setNewItemDescription] = useState('');

// Remover:
// const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);

const handleAddItem = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newItemName.trim() || !newItemPrice) {
    alert('Por favor, preencha nome e preço');
    return;
  }

  try {
    await addMenuItem({
      name: newItemName.trim(),
      price: parseFloat(newItemPrice),
      description: newItemDescription.trim() || undefined,
    });

    setNewItemName('');
    setNewItemPrice('');
    setNewItemDescription('');
    await loadData();
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    alert('Erro ao adicionar item. Por favor, tente novamente.');
  }
};
```

---

### Tarefa 6.2: Criar Novo Formulário para Associações

**Arquivo:** `src/components/admin-view.tsx`

**O que fazer:**
1. Criar novo section "Associar Items a Menus"
2. Adicionar dropdowns para:
   - Selecionar um menu
   - Selecionar um item
3. Botão para "Associar Item" (chamar `addItemToMenu`)
4. Exibir items de cada menu com botão remover (chamar `removeItemFromMenu`)

**Código esperado (pseudocódigo):**
```typescript
// Estados para associação
const [selectedMenuForAssociation, setSelectedMenuForAssociation] = useState<number | null>(null);
const [selectedItemForAssociation, setSelectedItemForAssociation] = useState<number | null>(null);

const handleAssociateItem = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedMenuForAssociation || !selectedItemForAssociation) {
    alert('Selecione um menu e um item');
    return;
  }

  try {
    await addItemToMenu(selectedMenuForAssociation, selectedItemForAssociation);
    setSelectedMenuForAssociation(null);
    setSelectedItemForAssociation(null);
    await loadData();
  } catch (error) {
    console.error('Erro ao associar item:', error);
    alert('Erro ao associar item. Por favor, tente novamente.');
  }
};

const handleRemoveItemFromMenu = async (menuId: number, itemId: number) => {
  if (confirm('Deseja remover este item do menu?')) {
    try {
      await removeItemFromMenu(menuId, itemId);
      await loadData();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item.');
    }
  }
};
```

---

## 🔄 ORDEM DE EXECUÇÃO

1. **Tarefas Backend (3-4 horas)**
   - Fase 1: BD (1.1 → 1.3 → 1.2)
   - Fase 2: Domain (2.1 → 2.2 → 2.3 → 2.4)
   - Fase 3: DTOs (3.1 → 3.2 → 3.3)
   - Fase 4: HTTP (4.1 → 4.2 → 4.3)

2. **Testar Backend com Postman/Insomnia (30-45 min)**
   - Criar item
   - Associar item a menu
   - Buscar items por menu
   - Remover item de menu

3. **Tarefas Frontend (2-3 horas)**
   - Fase 5: API (5.1 → 5.2 → 5.3)
   - Fase 6: UI (6.1 → 6.2)

4. **Testes E2E (30 min)**
   - Criar item + associar
   - Verificar se item aparece no menu
   - Remover e verificar

---

## ✅ CRITÉRIOS DE SUCESSO

- [ ] Criar item sem exigir `menuId`
- [ ] Associar um item a múltiplos menus
- [ ] Remover item de um menu (sem deletar item)
- [ ] Um menu pode ter múltiplos items
- [ ] Um item pode estar em múltiplos menus
- [ ] Deletar um menu não deleta os items
- [ ] Deletar um item remove de todos os menus
- [ ] UI permite visualizar e gerenciar relacionamentos
- [ ] Sem erros "ID do menu é obrigatório"

---

## 🚨 POTENCIAIS ARMADILHAS

1. **Ordem das migrations:** Sempre executar 1.1 → 1.3 → 1.2
2. **Dados órfãos:** Verificar se existem items sem menu antes de remover coluna
3. **Cascata de deletes:** Testar remoção de menus e items
4. **Cache do frontend:** Limpar estado após operações
5. **Relacionamentos duplicados:** Validar unicidade em `menu_items`

---

## 📚 REFERÊNCIAS ÚTEIS

- Padrão de repository: `ItemRepository`
- Padrão de service: `ItemService`
- Padrão de DTOs: Sempre criar novos DTOs, nunca reutilizar
- Migrations: Manter sequencial e versionada

---

**Status Final:** Pronto para iniciar implementação
**Próximo Passo:** Iniciar Fase 1 - Tarefa 1.1 (Criar migration)
