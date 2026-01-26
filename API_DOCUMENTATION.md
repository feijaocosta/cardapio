# API de Cardápio - Documentação de Endpoints

## Items

### Gerenciar Items

- **GET** `/api/items` - Listar todos os items
- **GET** `/api/items/:id` - Buscar item por ID
- **GET** `/api/items/menu/:menuId` - Listar items de um menu específico
- **POST** `/api/items` - Criar novo item
  ```json
  {
    "name": "Pizza Margherita",
    "price": 45.50,
    "description": "Pizza tradicional com tomate e mozzarela"
  }
  ```
- **PUT** `/api/items/:id` - Atualizar item
  ```json
  {
    "name": "Pizza Margherita Premium",
    "price": 55.00,
    "description": "Pizza premium com ingredientes importados"
  }
  ```
- **DELETE** `/api/items/:id` - Deletar item

### Associar Items a Menus (N:N)

- **POST** `/api/items/:id/menus` - Adicionar item a um menu
  ```json
  {
    "menuId": 1
  }
  ```
- **DELETE** `/api/items/:id/menus/:menuId` - Remover item de um menu

---

## Menus

### Gerenciar Menus

- **GET** `/api/menus` - Listar todos os menus (com `itemIds`)
- **GET** `/api/menus/:id` - Buscar menu por ID (com `itemIds`)
- **POST** `/api/menus` - Criar novo menu
  ```json
  {
    "name": "Menu Almoço",
    "description": "Menu especial de almoço"
  }
  ```
- **PUT** `/api/menus/:id` - Atualizar menu
  ```json
  {
    "name": "Menu Almoço Atualizado",
    "description": "Menu atualizado",
    "active": true
  }
  ```
- **DELETE** `/api/menus/:id` - Deletar menu

### Gerenciar Logo

- **POST** `/api/menus/:id/logo` - Upload de logo (multipart/form-data)
- **GET** `/api/menus/:id/logo` - Download da logo

### Gerenciar Items do Menu (N:N)

- **GET** `/api/menus/:id/items` - Listar todos os items do menu
- **POST** `/api/menus/:id/items` - Adicionar item ao menu
  ```json
  {
    "itemId": 1
  }
  ```
- **DELETE** `/api/menus/:id/items/:itemId` - Remover item do menu

---

## Respostas

### Item Response
```json
{
  "id": 1,
  "name": "Pizza Margherita",
  "price": 45.50,
  "description": "Pizza tradicional com tomate e mozzarela",
  "menuIds": [1, 2],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Menu Response
```json
{
  "id": 1,
  "name": "Menu Almoço",
  "description": "Menu especial de almoço",
  "logoFilename": "menu_1_logo.jpg",
  "active": true,
  "itemIds": [1, 2, 3],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## Mudanças Estruturais

### Antes (1:N)
```
Item.menuId → Menu (um item pertencia a um único menu)
```

### Depois (N:N)
```
Menu ←→ Item via tabela menu_items (um item pode estar em múltiplos menus)
```

### Tabela menu_items
```sql
id        | menu_id | item_id | created_at | updated_at
----------|---------|---------|------------|----------
1         | 1       | 1       | 2024-01-15 | 2024-01-15
2         | 1       | 2       | 2024-01-15 | 2024-01-15
3         | 2       | 1       | 2024-01-15 | 2024-01-15
```
