# FASE 2: Domain Layer - CONCLUÍDA ✅

## Resumo da Execução

A FASE 2 implementou a camada de domínio completa com todas as entities, repositories e domain services.

## Estrutura Criada

### 1. **Entities** (Domain Models)

#### Menu (`/domain/menus/Menu.ts`)
- Representa um cardápio com validações
- Métodos: `create()`, `isActive()`, `activate()`, `deactivate()`, `updateLogo()`
- Validações: nome obrigatório, máximo 255 caracteres

#### MenuItem (`/domain/menus/MenuItem.ts`)
- Representa um item de menu com preço
- Métodos: `create()`, `getPriceFormatted()`
- Validações: nome obrigatório, preço positivo, máximo 255 caracteres

#### Order (`/domain/orders/Order.ts`)
- Representa um pedido com status
- Type: `OrderStatus = 'Pendente' | 'Em preparação' | 'Pronto' | 'Entregue' | 'Cancelado'`
- Métodos: `create()`, `changeStatus()`, `getTotal()`
- Validações: cliente obrigatório, status válido, pelo menos um item

#### OrderItem (`/domain/orders/Order.ts`)
- Representa um item dentro de um pedido
- Métodos: `create()`, `getSubtotal()`
- Validações: quantidade positiva, preço não negativo

#### Setting (`/domain/settings/Setting.ts`)
- Representa uma configuração do sistema
- Tipos suportados: 'string', 'number', 'boolean'
- Métodos: `create()`, `getValue()`
- Validações: chave e valor obrigatórios

### 2. **Repository Interfaces** (Abstração de Persistência)

#### IMenuRepository
```typescript
- save(menu: Menu): Promise<Menu>
- findById(id: number): Promise<Menu | null>
- findAll(): Promise<Menu[]>
- delete(id: number): Promise<void>
```

#### IItemRepository
```typescript
- save(item: MenuItem): Promise<MenuItem>
- findById(id: number): Promise<MenuItem | null>
- findByMenuId(menuId: number): Promise<MenuItem[]>
- findAll(): Promise<MenuItem[]>
- delete(id: number): Promise<void>
```

#### IOrderRepository
```typescript
- save(order: Order): Promise<Order>
- findById(id: number): Promise<Order | null>
- findAll(): Promise<Order[]>
- delete(id: number): Promise<void>
```

#### ISettingRepository
```typescript
- save(setting: Setting): Promise<Setting>
- findByKey(key: string): Promise<Setting | null>
- findAll(): Promise<Setting[]>
- delete(key: string): Promise<void>
```

### 3. **Domain Services** (Casos de Uso)

#### MenuService
- `getAllMenus()` - Retorna todos os menus
- `getMenuById(id)` - Busca um menu por ID
- `createMenu(dto)` - Cria novo menu
- `updateMenu(id, dto)` - Atualiza menu
- `deleteMenu(id)` - Deleta menu
- `updateMenuLogo(id, filename)` - Atualiza logo do menu

**DTOs:**
- `CreateMenuDTO`: { name, description? }
- `UpdateMenuDTO`: { name?, description?, active? }
- `MenuResponseDTO`: Resposta formatada para cliente

#### ItemService
- `getItemById(id)` - Busca item por ID
- `getItemsByMenuId(menuId)` - Lista itens de um menu
- `getAllItems()` - Lista todos os itens
- `createItem(dto)` - Cria novo item
- `updateItem(id, dto)` - Atualiza item
- `deleteItem(id)` - Deleta item

**DTOs:**
- `CreateItemDTO`: { menuId, name, price, description? }
- `UpdateItemDTO`: { name?, price?, description? }
- `ItemResponseDTO`: Resposta formatada para cliente

#### OrderService
- `getAllOrders()` - Lista todos os pedidos
- `getOrderById(id)` - Busca pedido por ID
- `createOrder(dto)` - Cria novo pedido
- `updateOrder(id, dto)` - Atualiza pedido
- `deleteOrder(id)` - Deleta pedido
- `changeOrderStatus(id, status)` - Muda status do pedido

**DTOs:**
- `CreateOrderDTO`: { customerName, items: Array<{itemId, quantity, unitPrice}> }
- `UpdateOrderDTO`: { status?, customerName? }
- `OrderResponseDTO`: Inclui total, subtotal por item

#### SettingService
- `getAllSettings()` - Lista todas as configurações
- `getSettingByKey(key)` - Busca configuração por chave
- `updateSetting(key, dto)` - Atualiza configuração
- `createOrUpdateSetting(key, dto)` - Cria ou atualiza
- `deleteSetting(key)` - Deleta configuração

**DTOs:**
- `UpdateSettingDTO`: { value, type? }
- `SettingResponseDTO`: Inclui valor parseado

### 4. **Exports Centralizados**

#### `/domain/menus/index.ts`
- Exporta: Menu, MenuItem, IMenuRepository, IItemRepository, MenuService, ItemService

#### `/domain/orders/index.ts`
- Exporta: Order, OrderItem, OrderStatus, IOrderRepository, OrderService

#### `/domain/settings/index.ts`
- Exporta: Setting, ISettingRepository, SettingService

#### `/domain/index.ts`
- Reexporta todos os módulos para acesso centralizado

## Padrões Aplicados

✅ **Domain-Driven Design (DDD)**
- Entities com lógica de negócio
- Value Objects (OrderStatus)
- Repository Pattern para abstração de dados

✅ **SOLID Principles**
- Single Responsibility: Cada classe tem uma responsabilidade
- Open/Closed: Aberto para extensão via interfaces
- Dependency Inversion: Repositórios como interfaces

✅ **Clean Architecture**
- Entities independentes de frameworks
- Services orquestram lógica de negócio
- DTOs para transferência de dados

✅ **Imutabilidade**
- Entities retornam novas instâncias em mudanças
- Propriedades readonly

✅ **Tratamento de Erros**
- `ValidationError` para validações de negócio
- `NotFoundError` para recursos não encontrados

## Validações Implementadas

### Menu
- Nome obrigatório e não vazio
- Máximo 255 caracteres

### MenuItem
- Nome obrigatório
- Preço deve ser número positivo
- Máximo 255 caracteres

### Order
- Cliente obrigatório
- Status válido (enum)
- Pelo menos um item obrigatório

### OrderItem
- Quantidade deve ser inteiro positivo
- Preço não pode ser negativo

### Setting
- Chave e valor obrigatórios

## Próximos Passos (FASE 3)

A FASE 3 implementará a **Infrastructure Layer** com:
- Implementações de Repositories com SQLite
- Migrations de banco de dados
- Queries SQL para CRUD operations
- Conexão e pool de conexões

**Status:** ✅ FASE 2 CONCLUÍDA - Pronto para FASE 3
