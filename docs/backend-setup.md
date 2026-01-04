# Guia de Implementação do Backend - API REST com SQLite

Este documento descreve como implementar o backend Node.js + Express + SQLite para o sistema de pedidos.

## Estrutura do Projeto Backend

```
backend/
├── src/
│   ├── database/
│   │   ├── db.js          # Configuração do SQLite
│   │   └── schema.sql     # Schema do banco de dados
│   ├── routes/
│   │   ├── menuItems.js   # Rotas de itens do cardápio
│   │   ├── orders.js      # Rotas de pedidos
│   │   ├── menus.js       # Rotas de cardápios
│   │   └── settings.js    # Rotas de configurações
│   └── server.js          # Servidor Express
├── database.sqlite        # Arquivo do banco de dados
├── package.json
└── .env
```

## 1. Instalação das Dependências

```bash
mkdir backend
cd backend
npm init -y
npm install express cors better-sqlite3 dotenv
npm install --save-dev nodemon
```

## 2. Schema do Banco de Dados SQLite

Crie o arquivo `src/database/schema.sql`:

```sql
-- Tabela de itens do cardápio
CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  total REAL NOT NULL,
  date TEXT NOT NULL,
  menu_id INTEGER,
  FOREIGN KEY (menu_id) REFERENCES menus(id)
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Tabela de cardápios
CREATE TABLE IF NOT EXISTS menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  active INTEGER DEFAULT 1
);

-- Tabela de relacionamento many-to-many entre menus e itens
CREATE TABLE IF NOT EXISTS menu_menu_items (
  menu_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  PRIMARY KEY (menu_id, menu_item_id),
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Dados iniciais
INSERT INTO menu_items (name, price, description) VALUES
  ('Pizza Margherita', 35.90, 'Molho, mussarela e manjericão'),
  ('Hambúrguer Artesanal', 28.50, 'Pão, carne, queijo e salada'),
  ('Refrigerante', 6.00, 'Lata 350ml'),
  ('Batata Frita', 15.00, 'Porção 400g');

INSERT INTO menus (name, description, active) VALUES
  ('Cardápio Geral', 'Cardápio principal com todos os itens', 1);

INSERT INTO menu_menu_items (menu_id, menu_item_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4);

INSERT INTO settings (key, value) VALUES
  ('showPrices', 'true'),
  ('theme', 'orange');
```

## 3. Configuração do Banco de Dados

Crie o arquivo `src/database/db.js`:

```javascript
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Habilita foreign keys
db.pragma('foreign_keys = ON');

// Inicializa o banco de dados com o schema
function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Verifica se o banco já está inicializado
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  
  if (tables.length === 0) {
    // Executa o schema apenas se o banco estiver vazio
    db.exec(schema);
    console.log('✅ Banco de dados inicializado com sucesso!');
  } else {
    console.log('✅ Banco de dados já existe.');
  }
}

initDatabase();

module.exports = db;
```

## 4. Servidor Express

Crie o arquivo `src/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const menuItemsRoutes = require('./routes/menuItems');
const ordersRoutes = require('./routes/orders');
const menusRoutes = require('./routes/menus');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API está funcionando' });
});

// Rotas
app.use('/api/menu-items', menuItemsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/settings', settingsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
```

## 5. Rotas - Menu Items

Crie o arquivo `src/routes/menuItems.js`:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/menu-items - Listar todos os itens
router.get('/', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM menu_items ORDER BY id').all();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/menu-items - Criar novo item
router.post('/', (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    const result = db.prepare(
      'INSERT INTO menu_items (name, price, description) VALUES (?, ?, ?)'
    ).run(name, price, description || null);
    
    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/menu-items/:id - Atualizar item
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description || null);
    }
    
    if (updates.length > 0) {
      values.push(id);
      db.prepare(`UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/menu-items/:id - Deletar item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## 6. Rotas - Orders

Crie o arquivo `src/routes/orders.js`:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/orders - Listar todos os pedidos
router.get('/', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
    
    // Busca os itens de cada pedido
    const ordersWithItems = orders.map(order => {
      const items = db.prepare(
        'SELECT menu_item_id as menuItemId, name, quantity, price FROM order_items WHERE order_id = ?'
      ).all(order.id);
      
      return {
        id: order.id,
        customerName: order.customer_name,
        total: order.total,
        date: order.date,
        menuId: order.menu_id,
        items
      };
    });
    
    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders - Criar novo pedido
router.post('/', (req, res) => {
  try {
    const { customerName, items, total, menuId } = req.body;
    const date = new Date().toISOString();
    
    // Inicia transação
    const insertOrder = db.prepare(
      'INSERT INTO orders (customer_name, total, date, menu_id) VALUES (?, ?, ?, ?)'
    );
    
    const insertOrderItem = db.prepare(
      'INSERT INTO order_items (order_id, menu_item_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)'
    );
    
    const transaction = db.transaction((customerName, total, date, menuId, items) => {
      const result = insertOrder.run(customerName, total, date, menuId || null);
      const orderId = result.lastInsertRowid;
      
      items.forEach(item => {
        insertOrderItem.run(orderId, item.menuItemId, item.name, item.quantity, item.price);
      });
      
      return orderId;
    });
    
    const orderId = transaction(customerName, total, date, menuId, items);
    
    // Busca o pedido criado
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const orderItems = db.prepare(
      'SELECT menu_item_id as menuItemId, name, quantity, price FROM order_items WHERE order_id = ?'
    ).all(orderId);
    
    res.status(201).json({
      id: order.id,
      customerName: order.customer_name,
      total: order.total,
      date: order.date,
      menuId: order.menu_id,
      items: orderItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## 7. Rotas - Menus

Crie o arquivo `src/routes/menus.js`:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/menus - Listar cardápios (com filtro opcional ?active=true)
router.get('/', (req, res) => {
  try {
    const { active } = req.query;
    
    let query = 'SELECT * FROM menus';
    if (active === 'true') {
      query += ' WHERE active = 1';
    }
    query += ' ORDER BY id';
    
    const menus = db.prepare(query).all();
    
    const menusWithBoolean = menus.map(menu => ({
      ...menu,
      active: Boolean(menu.active)
    }));
    
    res.json(menusWithBoolean);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/menus - Criar novo cardápio
router.post('/', (req, res) => {
  try {
    const { name, description, logo, active } = req.body;
    
    const result = db.prepare(
      'INSERT INTO menus (name, description, logo, active) VALUES (?, ?, ?, ?)'
    ).run(name, description || null, logo || null, active ? 1 : 0);
    
    const menu = db.prepare('SELECT * FROM menus WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      ...menu,
      active: Boolean(menu.active)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/menus/:id - Atualizar cardápio
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logo, active } = req.body;
    
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description || null);
    }
    if (logo !== undefined) {
      updates.push('logo = ?');
      values.push(logo || null);
    }
    if (active !== undefined) {
      updates.push('active = ?');
      values.push(active ? 1 : 0);
    }
    
    if (updates.length > 0) {
      values.push(id);
      db.prepare(`UPDATE menus SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/menus/:id - Deletar cardápio
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    // As foreign keys com ON DELETE CASCADE cuidam dos itens relacionados
    db.prepare('DELETE FROM menus WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/menus/:id/items - Listar itens de um cardápio
router.get('/:id/items', (req, res) => {
  try {
    const { id } = req.params;
    
    const items = db.prepare(`
      SELECT mi.id, mi.name, mi.price, mi.description
      FROM menu_items mi
      INNER JOIN menu_menu_items mmi ON mi.id = mmi.menu_item_id
      WHERE mmi.menu_id = ?
      ORDER BY mi.id
    `).all(id);
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/menus/:id/items - Adicionar item a um cardápio
router.post('/:id/items', (req, res) => {
  try {
    const { id } = req.params;
    const { itemId } = req.body;
    
    // Verifica se já existe
    const existing = db.prepare(
      'SELECT 1 FROM menu_menu_items WHERE menu_id = ? AND menu_item_id = ?'
    ).get(id, itemId);
    
    if (!existing) {
      db.prepare(
        'INSERT INTO menu_menu_items (menu_id, menu_item_id) VALUES (?, ?)'
      ).run(id, itemId);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/menus/:id/items/:itemId - Remover item de um cardápio
router.delete('/:id/items/:itemId', (req, res) => {
  try {
    const { id, itemId } = req.params;
    
    db.prepare(
      'DELETE FROM menu_menu_items WHERE menu_id = ? AND menu_item_id = ?'
    ).run(id, itemId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## 8. Rotas - Settings

Crie o arquivo `src/routes/settings.js`:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/settings - Buscar configurações
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    
    const settings = {};
    rows.forEach(row => {
      if (row.key === 'showPrices') {
        settings.showPrices = row.value === 'true';
      } else if (row.key === 'theme') {
        settings.theme = row.value;
      }
    });
    
    res.json({
      showPrices: settings.showPrices ?? true,
      theme: settings.theme ?? 'orange'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/settings - Atualizar configurações
router.put('/', (req, res) => {
  try {
    const { showPrices, theme } = req.body;
    
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    
    if (showPrices !== undefined) {
      stmt.run('showPrices', showPrices ? 'true' : 'false');
    }
    
    if (theme !== undefined) {
      stmt.run('theme', theme);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## 9. Arquivo .env

Crie o arquivo `.env` no backend:

```
PORT=3000
NODE_ENV=development
```

## 10. Package.json Scripts

Adicione ao `package.json`:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

## 11. Executando o Backend

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

## 12. Configuração do Frontend

No projeto frontend, crie um arquivo `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

Para produção, altere para a URL real do servidor:

```
VITE_API_URL=https://seu-servidor.com/api
```

## Endpoints da API

### Menu Items
- `GET /api/menu-items` - Lista todos os itens
- `POST /api/menu-items` - Cria novo item
- `PUT /api/menu-items/:id` - Atualiza item
- `DELETE /api/menu-items/:id` - Remove item

### Orders
- `GET /api/orders` - Lista todos os pedidos
- `POST /api/orders` - Cria novo pedido

### Menus
- `GET /api/menus` - Lista cardápios
- `GET /api/menus?active=true` - Lista apenas cardápios ativos
- `POST /api/menus` - Cria novo cardápio
- `PUT /api/menus/:id` - Atualiza cardápio
- `DELETE /api/menus/:id` - Remove cardápio
- `GET /api/menus/:id/items` - Lista itens do cardápio
- `POST /api/menus/:id/items` - Adiciona item ao cardápio
- `DELETE /api/menus/:id/items/:itemId` - Remove item do cardápio

### Settings
- `GET /api/settings` - Busca configurações
- `PUT /api/settings` - Atualiza configurações

### Health Check
- `GET /api/health` - Verifica se a API está funcionando

## Deploy em Produção

### Opção 1: VPS (Servidor Próprio)
1. Configure Node.js no servidor
2. Clone o repositório
3. Configure as variáveis de ambiente
4. Use PM2 para gerenciar o processo:
```bash
npm install -g pm2
pm2 start src/server.js --name "pedidos-api"
pm2 save
pm2 startup
```

### Opção 2: Railway / Render
1. Conecte seu repositório Git
2. Configure as variáveis de ambiente
3. O deploy será automático

### Opção 3: Heroku
```bash
heroku create nome-da-api
git push heroku main
```

## Importante

⚠️ **Segurança**: Para produção, adicione:
- Autenticação JWT para rotas admin
- Rate limiting
- Validação de dados com biblioteca como `joi` ou `zod`
- HTTPS/SSL
- Backup automático do arquivo database.sqlite

⚠️ **CORS**: Configure o CORS adequadamente para permitir apenas o domínio do frontend.
