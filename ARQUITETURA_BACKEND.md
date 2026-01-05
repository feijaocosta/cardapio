# 🖥️ Arquitetura do Backend

## 📌 Visão Geral

Backend Express.js + SQLite que fornece API REST para Frontend React consumir.

```
┌─────────────────────────────────────┐
│      Frontend (React)               │
│      http://localhost:5173          │
└────────────────┬────────────────────┘
                 │ HTTP Fetch
                 │ Porta 3000
                 ▼
┌─────────────────────────────────────┐
│      Express.js (Backend)           │
│      http://localhost:3000          │
├─────────────────────────────────────┤
│  Middlewares:                       │
│  - CORS                             │
│  - JSON Parser                      │
├─────────────────────────────────────┤
│  Rotas (5):                         │
│  - /menus (CRUD)                    │
│  - /items (CRUD)                    │
│  - /orders (CRUD)                   │
│  - /settings (R/U)                  │
│  - /health (GET)                    │
├─────────────────────────────────────┤
│  Database Module                    │
│  - Conexão SQLite                   │
│  - Migrations Automáticas           │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│      SQLite (database.sqlite)       │
│                                     │
│  Tables:                            │
│  - menus                            │
│  - menu_items                       │
│  - menu_menu_items (M2M)            │
│  - orders                           │
│  - order_items                      │
│  - settings                         │
│  - migrations                       │
└─────────────────────────────────────┘
```

---

## 🏗️ Estrutura de Pastas

```
server/
├── src/
│   ├── index.ts                    # Entry Point
│   │   └── Inicializa Express
│   │   └── Configura middlewares
│   │   └── Carrega rotas
│   │   └── Inicia servidor
│   │
│   ├── db/
│   │   └── database.ts             # Database Module
│   │       ├── getDatabase()        # Retorna conexão
│   │       ├── applyMigrations()    # Executa migrations
│   │       └── initializeDatabase() # Setup inicial
│   │
│   └── routes/                     # Rotas da API
│       ├── health.ts               # GET /health
│       ├── menus.ts                # GET/POST/PUT/DELETE /menus
│       ├── items.ts                # GET/POST/PUT/DELETE /items
│       ├── orders.ts               # GET/POST/PUT /orders
│       └── settings.ts             # GET/PUT /settings
│
├── migrations/                     # SQL Migrations
│   ├── 001_init.sql               # Tabelas iniciais
│   └── 002_create_migrations_and_settings.sql
│
├── database.sqlite                # Arquivo do banco (gerado automaticamente)
├── package.json
├── tsconfig.json
└── .env                           # Variáveis de ambiente
```

---

## 🚀 Entry Point (index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/database';
import menusRouter from './routes/menus';
import ordersRouter from './routes/orders';
import itemsRouter from './routes/items';
import healthRouter from './routes/health';
import settingsRouter from './routes/settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Parseia JSON

// Inicializar banco
initializeDatabase().then(() => {
  console.log('✅ Banco de dados inicializado');
});

// Rotas
app.use('/menus', menusRouter);
app.use('/orders', ordersRouter);
app.use('/items', itemsRouter);
app.use('/health', healthRouter);
app.use('/settings', settingsRouter);

// Health check raiz
app.get('/', (req, res) => {
  res.json({ message: 'API rodando' });
});

// Error handler global
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Erro:', err);
  res.status(500).json({ error: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
```

---

## 💾 Database Module (database.ts)

```typescript
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const migrationsPath = path.resolve(__dirname, '../../migrations');

// Abrir conexão com banco
export async function getDatabase(): Promise<Database> {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

// Aplicar migrations automáticas
async function applyMigrations(db: Database): Promise<void> {
  // 1. Criar tabela de migrations (se não existir)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Garantir que migrations/ existe
  if (!fs.existsSync(migrationsPath)) {
    fs.mkdirSync(migrationsPath, { recursive: true });
    console.log(`📁 Diretório migrations criado: ${migrationsPath}`);
  }

  // 3. Obter migrations já aplicadas
  const appliedMigrations = await db.all<{ name: string }[]>(
    'SELECT name FROM migrations'
  );
  const appliedNames = new Set(appliedMigrations.map(m => m.name));

  // 4. Ler arquivos de migrations
  const migrationFiles = fs
    .readdirSync(migrationsPath)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Ordem alfabética

  // 5. Aplicar migrations pendentes
  for (const file of migrationFiles) {
    if (!appliedNames.has(file)) {
      console.log(`🔄 Aplicando migration: ${file}`);
      
      const sqlPath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(sqlPath, 'utf-8');
      
      try {
        await db.exec(sql);
        await db.run('INSERT INTO migrations (name) VALUES (?)', [file]);
        console.log(`✅ Migration aplicada: ${file}`);
      } catch (error) {
        console.error(`❌ Erro ao aplicar migration ${file}:`, error);
        throw error;
      }
    }
  }
}

// Inicializar banco (chamado ao iniciar servidor)
export async function initializeDatabase(): Promise<Database> {
  const db = await getDatabase();
  await applyMigrations(db);
  console.log('📦 Banco de dados pronto!');
  return db;
}
```

---

## 📡 Rotas da API

### 1. Health Check (`/health`)

```typescript
// server/src/routes/health.ts
router.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

**Response:**
```json
{ "status": "ok", "timestamp": "2026-01-05T10:30:00Z" }
```

### 2. Menus (`/menus`)

```typescript
// GET /menus - Listar todos
router.get('/', async (req, res) => {
  const db = await getDatabase();
  const menus = await db.all('SELECT * FROM menus ORDER BY id DESC');
  res.json(menus);
});

// POST /menus - Criar
router.post('/', async (req, res) => {
  const { name, description, logo } = req.body;
  const db = await getDatabase();
  
  const result = await db.run(
    'INSERT INTO menus (name, description, logo, active) VALUES (?, ?, ?, ?)',
    [name, description || null, logo || null, 1]
  );
  
  res.status(201).json({
    id: result.lastID,
    name,
    description,
    logo,
    active: true
  });
});

// PUT /menus/:id - Atualizar
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, logo, active } = req.body;
  const db = await getDatabase();
  
  await db.run(
    'UPDATE menus SET name = ?, description = ?, logo = ?, active = ? WHERE id = ?',
    [name, description, logo, active, id]
  );
  
  res.json({ message: 'Menu updated' });
});

// DELETE /menus/:id - Deletar
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  
  // Remover items associados
  await db.run('DELETE FROM menu_menu_items WHERE menu_id = ?', id);
  // Remover menu
  await db.run('DELETE FROM menus WHERE id = ?', id);
  
  res.json({ message: 'Menu deleted' });
});
```

### 3. Items (`/items`)

```typescript
// GET /items - Listar todos
router.get('/', async (req, res) => {
  const db = await getDatabase();
  const items = await db.all('SELECT * FROM menu_items ORDER BY id DESC');
  res.json(items);
});

// POST /items - Criar
router.post('/', async (req, res) => {
  const { name, price, description } = req.body;
  const db = await getDatabase();
  
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
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
});

// PUT /items/:id - Atualizar
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const db = await getDatabase();
  
  await db.run(
    'UPDATE menu_items SET name = ?, price = ?, description = ? WHERE id = ?',
    [name, price, description, id]
  );
  
  res.json({ message: 'Item updated' });
});

// DELETE /items/:id - Deletar
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  
  // Remover de cardápios
  await db.run('DELETE FROM menu_menu_items WHERE menu_item_id = ?', id);
  // Remover item
  await db.run('DELETE FROM menu_items WHERE id = ?', id);
  
  res.json({ message: 'Item deleted' });
});
```

### 4. Orders (`/orders`)

```typescript
// GET /orders - Listar todos (mais recentes primeiro)
router.get('/', async (req, res) => {
  const db = await getDatabase();
  
  const orders = await db.all(`
    SELECT 
      o.id,
      o.customer_name,
      o.created_at,
      o.status,
      GROUP_CONCAT(oi.item_id || ':' || oi.quantity) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);
  
  res.json(orders);
});

// POST /orders - Criar novo pedido
router.post('/', async (req, res) => {
  const { customerName, items, menuId } = req.body;
  const db = await getDatabase();
  
  try {
    // Iniciar transação
    await db.run('BEGIN TRANSACTION');
    
    // Inserir ordem
    const orderResult = await db.run(
      'INSERT INTO orders (customer_name, status) VALUES (?, ?)',
      [customerName, 'Pendente']
    );
    
    const orderId = orderResult.lastID;
    
    // Inserir itens da ordem
    for (const item of items) {
      await db.run(
        'INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.id, item.quantity]
      );
    }
    
    // Commit
    await db.run('COMMIT');
    
    res.status(201).json({
      id: orderId,
      customerName,
      status: 'Pendente',
      items,
      createdAt: new Date()
    });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// PUT /orders/:id - Atualizar status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = await getDatabase();
  
  await db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  );
  
  res.json({ message: 'Order updated' });
});
```

### 5. Settings (`/settings`)

```typescript
// GET /settings - Obter todas as configurações
router.get('/', async (req, res) => {
  const db = await getDatabase();
  const rows = await db.all('SELECT key, value FROM settings');
  
  const settings: Record<string, any> = {};
  rows.forEach(row => {
    settings[row.key] = row.value === 'true' || row.value;
  });
  
  res.json(settings);
});

// PUT /settings - Atualizar configurações
router.put('/', async (req, res) => {
  const db = await getDatabase();
  
  for (const [key, value] of Object.entries(req.body)) {
    await db.run(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, String(value)]
    );
  }
  
  res.json({ message: 'Settings updated' });
});
```

---

## 💡 Padrões de Desenvolvimento Backend

### Error Handling

```typescript
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const data = await db.all('SELECT * FROM menus');
    res.json(data);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({
      error: 'Erro ao buscar dados',
      message: error.message
    });
  }
});
```

### Validação

```typescript
router.post('/', async (req, res) => {
  const { name, price } = req.body;
  
  // Validação
  if (!name?.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Preço inválido' });
  }
  
  // ... continuar
});
```

### Transações SQL

```typescript
try {
  await db.run('BEGIN TRANSACTION');
  
  // Múltiplas operações
  await db.run('INSERT ...');
  await db.run('UPDATE ...');
  
  await db.run('COMMIT');
} catch (error) {
  await db.run('ROLLBACK');
  throw error;
}
```

---

## 🔍 Debugging

### Logs

```typescript
console.log('📊 Query:', sql);
console.log('📤 Response:', data);
console.error('❌ Erro:', error);
```

### Testar Rotas

```bash
# Health check
curl http://localhost:3000/health

# Listar menus
curl http://localhost:3000/menus

# Criar menu
curl -X POST http://localhost:3000/menus \
  -H "Content-Type: application/json" \
  -d '{"name":"Cardápio A","description":"Teste"}'

# Listar itens
curl http://localhost:3000/items
```

---

## 📦 Variáveis de Ambiente

```bash
# server/.env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
```

---

**Versão**: 2.0  
**Última Atualização**: Janeiro 2026
