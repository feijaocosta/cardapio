# 📖 Guia de Desenvolvimento

## 🎯 Objetivo

Estabelecer padrões, convenções e boas práticas para desenvolvimento consistente do projeto.

---

## 📝 Convenções de Código

### Nomenclatura

**Componentes React**
```typescript
// PascalCase - um arquivo por componente
export function CustomerView() { }
export function AdminView() { }
export function MenuList() { }
```

**Funções e Variáveis**
```typescript
// camelCase
export async function getMenus() { }
export async function addOrder() { }
const [isLoading, setIsLoading] = useState(false);
```

**Constantes**
```typescript
// UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000';
const AVAILABLE_THEMES = [...];
const MAX_ITEMS_PER_ORDER = 100;
```

**Tipos e Interfaces**
```typescript
// PascalCase
interface MenuItem {
  id: number;
  name: string;
  price: number;
}

type OrderStatus = 'Pendente' | 'Confirmado' | 'Pronto';
```

**Pastas**
```
// kebab-case para pastas
/components
/services
/styles
/lib
/server/src/routes
/server/src/db
```

---

## 🏗️ Estrutura de Arquivos

### Frontend (React)

```
src/
├── App.tsx                    # Componente raiz
│   └── Estado global (isAdmin)
│   └── Render condicional de views
│
├── components/
│   ├── admin-view.tsx        # View do administrador
│   │   └── Gerencia todas as abas admin
│   ├── customer-view.tsx     # View do cliente
│   │   └── Seleção e pedido
│   └── ui/                   # Componentes reutilizáveis
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ... (20+)
│
├── lib/
│   └── storage.ts            # Wrapper localStorage
│
├── services/
│   └── api.ts                # Client HTTP (fetch)
│
├── styles/
│   └── globals.css           # Tailwind CSS global
│
└── main.tsx                  # Entry point
```

### Backend (Express)

```
server/
├── src/
│   ├── index.ts              # Entry point Express
│   │   └── Middlewares (CORS, JSON)
│   │   └── Rotas
│   │
│   ├── db/
│   │   └── database.ts       # Conexão SQLite + migrations
│   │       ├── getDatabase()
│   │       ├── applyMigrations()
│   │       └── initializeDatabase()
│   │
│   └── routes/               # Rotas da API
│       ├── health.ts         # GET /health
│       ├── menus.ts          # CRUD /menus
│       ├── items.ts          # CRUD /items
│       ├── orders.ts         # CRUD /orders
│       └── settings.ts       # CRUD /settings
│
├── migrations/               # SQL migrations
│   ├── 001_init.sql         # Tabelas iniciais
│   └── 002_create_migrations_and_settings.sql
│
├── database.sqlite          # Arquivo do banco
├── package.json
└── tsconfig.json
```

---

## 🧩 Padrões de Componentes

### Componente Funcional React

```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MyComponentProps {
  id: number;
  title: string;
  onSubmit?: (data: FormData) => void;
}

export function MyComponent({ id, title, onSubmit }: MyComponentProps) {
  // Estado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efeitos
  useEffect(() => {
    // Lógica de inicialização
  }, [id]); // Dependências!

  // Handlers
  const handleClick = () => {
    // Lógica do handler
  };

  // Render
  return (
    <Card>
      <h2>{title}</h2>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Clique aqui'}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </Card>
  );
}
```

### Função de API

```typescript
// services/api.ts
export async function addMenuItem(
  item: Omit<MenuItem, 'id'>
): Promise<MenuItem> {
  try {
    return await fetchAPI<MenuItem>('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    throw error;
  }
}
```

### Rota Express

```typescript
// server/src/routes/items.ts
import express from 'express';
import { getDatabase } from '../db/database';

const router = express.Router();

// GET /items - Listar todos
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const items = await db.all('SELECT * FROM menu_items');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /items - Criar novo
router.post('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const { name, price, description } = req.body;
    
    // Validar
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    
    const result = await db.run(
      'INSERT INTO menu_items (name, price, description) VALUES (?, ?, ?)',
      [name, price, description || null]
    );
    
    res.status(201).json({
      id: result.lastID,
      name,
      price,
      description
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## 🎨 Estilos e Tailwind

### Usar Tailwind Classes

```typescript
// ✅ BOM
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
  Clique aqui
</button>

// ❌ RUIM
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Clique aqui
</button>
```

### Temas com Tailwind

```typescript
// services/api.ts
export const AVAILABLE_THEMES = [
  {
    id: 'orange',
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    gradient: 'from-orange-50 to-red-50',
  },
  // ... mais temas
];

// components/admin-view.tsx
const theme = settings.theme || 'orange';
const themeConfig = AVAILABLE_THEMES.find(t => t.id === theme);

<div className={`${themeConfig.gradient} p-4`}>
  Conteúdo com tema
</div>
```

---

## 🔄 Padrão de Estado

### Frontend (React)

```typescript
// ✅ BOM: Estado organizado
const [orders, setOrders] = useState<Order[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// ❌ RUIM: Estado desordenizado
const [o, setO] = useState([]);
const [l, setL] = useState(false);
const [e, setE] = useState('');
```

### Backend (Express)

```typescript
// ✅ BOM: Resposta estruturada
res.json({
  status: 'success',
  data: items,
  count: items.length
});

// ❌ RUIM: Resposta sem estrutura
res.json(items);
```

---

## ✅ Validação de Dados

### Frontend

```typescript
// services/api.ts - Validar antes de enviar
export async function addMenuItem(item: Omit<MenuItem, 'id'>) {
  // Validar obrigatórios
  if (!item.name || !item.name.trim()) {
    throw new Error('Nome do item é obrigatório');
  }
  
  if (item.price < 0) {
    throw new Error('Preço não pode ser negativo');
  }
  
  // Enviar para API
  return fetchAPI<MenuItem>('/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}
```

### Backend

```typescript
// server/src/routes/items.ts - Validar ao receber
router.post('/', async (req, res) => {
  const { name, price, description } = req.body;
  
  // Validação
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  
  // ... inserir no banco
});
```

---

## 🚨 Tratamento de Erros

### Frontend

```typescript
// components/admin-view.tsx
const handleAddItem = async () => {
  try {
    setError(null);
    const newItem = await addMenuItem({
      name: itemName,
      price: parseFloat(itemPrice),
      description: itemDescription
    });
    
    setItems([...items, newItem]);
    setItemName('');
    setItemPrice('');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro desconhecido');
  } finally {
    setIsLoading(false);
  }
};
```

### Backend

```typescript
// server/src/routes/items.ts
router.post('/', async (req, res) => {
  try {
    // ... lógica
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      error: 'Erro ao criar item',
      message: error.message
    });
  }
});
```

---

## 📡 Padrão de Requisição HTTP

### GET - Listar

```typescript
// API Call
export async function getMenus(): Promise<Menu[]> {
  return fetchAPI<Menu[]>('/menus');
}

// Express Handler
router.get('/', async (req, res) => {
  const db = await getDatabase();
  const menus = await db.all('SELECT * FROM menus');
  res.json(menus);
});
```

### POST - Criar

```typescript
// API Call
export async function addMenu(menu: Omit<Menu, 'id'>): Promise<Menu> {
  return fetchAPI<Menu>('/menus', {
    method: 'POST',
    body: JSON.stringify(menu),
  });
}

// Express Handler
router.post('/', async (req, res) => {
  const { name, description, logo } = req.body;
  const db = await getDatabase();
  
  const result = await db.run(
    'INSERT INTO menus (name, description, logo) VALUES (?, ?, ?)',
    [name, description, logo]
  );
  
  res.status(201).json({
    id: result.lastID,
    name,
    description,
    logo,
    active: true
  });
});
```

### PUT - Atualizar

```typescript
// API Call
export async function updateMenu(
  id: number,
  menu: Partial<Omit<Menu, 'id'>>
): Promise<void> {
  await fetchAPI(`/menus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menu),
  });
}

// Express Handler
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, active } = req.body;
  const db = await getDatabase();
  
  await db.run(
    'UPDATE menus SET name = ?, description = ?, active = ? WHERE id = ?',
    [name, description, active, id]
  );
  
  res.json({ message: 'Menu updated successfully' });
});
```

### DELETE - Deletar

```typescript
// API Call
export async function removeMenu(id: number): Promise<void> {
  await fetchAPI(`/menus/${id}`, {
    method: 'DELETE',
  });
}

// Express Handler
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  
  await db.run('DELETE FROM menus WHERE id = ?', id);
  res.json({ message: 'Menu deleted successfully' });
});
```

---

## 🔍 TypeScript Best Practices

### Use Tipos Explícitos

```typescript
// ✅ BOM
interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

const item: MenuItem = {
  id: 1,
  name: 'Pizza',
  price: 35.90
};

// ❌ RUIM
const item: any = { id: 1, name: 'Pizza', price: 35.90 };
```

### Union Types para Estados

```typescript
// ✅ BOM
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: MenuItem[] }
  | { status: 'error'; error: string };

// ❌ RUIM
const [status, setStatus] = useState('');
const [data, setData] = useState(null);
const [error, setError] = useState('');
```

---

## 🧪 Testes Manuais

### Checklist de Funcionalidades

```
Cliente:
- [ ] Selecionar cardápio
- [ ] Ver itens corretamente
- [ ] Adicionar items ao carrinho
- [ ] Remover items do carrinho
- [ ] Calcular total corretamente
- [ ] Fazer pedido com nome
- [ ] Pedido aparece no admin

Admin:
- [ ] Ver pedidos em tempo real
- [ ] Criar novo cardápio
- [ ] Adicionar itens ao cardápio
- [ ] Remover itens do cardápio
- [ ] Ativar/desativar cardápio
- [ ] Criar novo item
- [ ] Alterar tema de cores
- [ ] Toggle mostrar/ocultar preços
```

---

## 📊 Debugging

### Frontend

```typescript
// Console Logging
console.log('Dados carregados:', items);
console.error('Erro:', error);

// React DevTools
// Instale extensão: React DevTools

// Network Tab
// F12 > Network > Veja requisições HTTP
```

### Backend

```typescript
// Console
console.log('Novo pedido criado:', orderId);
console.error('Erro ao conectar banco:', error);

// Logs em Arquivo (futuro)
// Implementar winston ou pino para logs estruturados
```

---

## 🚀 Performance

### Frontend

- Usar `React.memo()` para componentes que não mudam
- Usar `useMemo()` para cálculos pesados
- Lazy loading de componentes

### Backend

- Adicionar índices no SQLite
- Cache de queries frequentes
- Limitar tamanho de responses

---

## 🔐 Segurança

### Validação

```typescript
// Sempre validar entrada do usuário
export async function addMenuItem(item: Omit<MenuItem, 'id'>) {
  if (!item.name?.trim()) {
    throw new Error('Nome inválido');
  }
  if (item.price < 0) {
    throw new Error('Preço inválido');
  }
}
```

### Sanitização

```typescript
// Remover caracteres especiais
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
```

---

**Versão**: 2.0  
**Última Atualização**: Janeiro 2026
