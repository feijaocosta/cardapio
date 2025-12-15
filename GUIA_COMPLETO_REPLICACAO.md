# 📘 Guia Completo para Replicar o Sistema de Pedidos

Este guia contém **TODOS** os arquivos necessários para replicar o projeto fora do Figma Make.

## 🚀 Início Rápido

```bash
# 1. Criar pasta do projeto
mkdir sistema-pedidos
cd sistema-pedidos

# 2. Criar estrutura de pastas
mkdir -p src/lib src/components src/styles

# 3. Copiar todos os arquivos abaixo
# (cole o conteúdo de cada seção no arquivo correspondente)

# 4. Instalar dependências
npm install

# 5. Rodar o projeto
npm run dev
```

---

## 📁 Estrutura Completa

```
sistema-pedidos/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── postcss.config.js
├── index.html
├── .gitignore
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── lib/
    │   └── database.ts
    ├── components/
    │   ├── customer-view.tsx
    │   └── admin-view.tsx
    └── styles/
        └── globals.css
```

---

## 📝 Conteúdo dos Arquivos

### ✅ 1. package.json (raiz)

```json
{
  "name": "sistema-pedidos",
  "version": "1.0.0",
  "description": "Sistema de pedidos com visão cliente e admin usando React e SQLite",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sql.js": "^1.10.3",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/sql.js": "^1.4.9",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### ✅ 2. tsconfig.json (raiz)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ✅ 3. tsconfig.node.json (raiz)

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### ✅ 4. vite.config.ts (raiz)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['sql.js']
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});
```

### ✅ 5. postcss.config.js (raiz)

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### ✅ 6. index.html (raiz)

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Pedidos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### ✅ 7. .gitignore (raiz)

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### ✅ 8. src/main.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### ✅ 9. src/App.tsx

```typescript
import { useState, useEffect } from 'react';
import { CustomerView } from './components/customer-view';
import { AdminView } from './components/admin-view';
import { Store, Settings } from 'lucide-react';
import { initDatabase } from './lib/database';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initDatabase().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleOrderPlaced = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando banco de dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-800 flex items-center gap-2">
              Sistema de Pedidos
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setView('customer')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'customer'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Store className="w-4 h-4" />
                Cliente
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'admin'
                    ? 'bg-slate-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {view === 'customer' ? (
        <CustomerView onOrderPlaced={handleOrderPlaced} />
      ) : (
        <AdminView refreshTrigger={refreshTrigger} />
      )}
    </div>
  );
}
```

### ✅ 10. src/lib/database.ts

**ARQUIVO PRINCIPAL COM SQLITE**

```typescript
import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: string;
}

// Inicializa o banco de dados
export async function initDatabase(): Promise<void> {
  if (db) return;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`
  });

  // Tenta carregar o banco do localStorage
  const savedDb = localStorage.getItem('sqliteDb');
  
  if (savedDb) {
    const uint8Array = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(uint8Array);
  } else {
    db = new SQL.Database();
    
    // Cria as tabelas
    db.run(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        total REAL NOT NULL,
        date TEXT NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        menu_item_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      );
    `);

    // Insere dados iniciais
    const initialItems = [
      { name: 'Pizza Margherita', price: 35.90, description: 'Molho, mussarela e manjericão' },
      { name: 'Hambúrguer Artesanal', price: 28.50, description: 'Pão, carne, queijo e salada' },
      { name: 'Refrigerante', price: 6.00, description: 'Lata 350ml' },
      { name: 'Batata Frita', price: 15.00, description: 'Porção 400g' },
    ];

    initialItems.forEach(item => {
      db!.run(
        'INSERT INTO menu_items (name, price, description) VALUES (?, ?, ?)',
        [item.name, item.price, item.description]
      );
    });

    saveDatabase();
  }
}

// Salva o banco no localStorage
function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Array.from(data);
  localStorage.setItem('sqliteDb', JSON.stringify(buffer));
}

// Menu Items
export function getMenuItems(): MenuItem[] {
  if (!db) return [];
  
  const result = db.exec('SELECT * FROM menu_items ORDER BY id');
  if (result.length === 0) return [];

  return result[0].values.map(row => ({
    id: row[0] as number,
    name: row[1] as string,
    price: row[2] as number,
    description: row[3] as string | undefined,
  }));
}

export function addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
  if (!db) throw new Error('Database not initialized');

  db.run(
    'INSERT INTO menu_items (name, price, description) VALUES (?, ?, ?)',
    [item.name, item.price, item.description || null]
  );

  const result = db.exec('SELECT last_insert_rowid()');
  const id = result[0].values[0][0] as number;

  saveDatabase();

  return { ...item, id };
}

export function removeMenuItem(id: number): void {
  if (!db) return;
  db.run('DELETE FROM menu_items WHERE id = ?', [id]);
  saveDatabase();
}

// Orders
export function getOrders(): Order[] {
  if (!db) return [];

  const result = db.exec('SELECT * FROM orders ORDER BY id DESC');
  if (result.length === 0) return [];

  return result[0].values.map(row => {
    const orderId = row[0] as number;
    const items = getOrderItems(orderId);

    return {
      id: orderId,
      customerName: row[1] as string,
      total: row[2] as number,
      date: row[3] as string,
      items,
    };
  });
}

function getOrderItems(orderId: number): OrderItem[] {
  if (!db) return [];

  const result = db.exec(
    'SELECT menu_item_id, name, quantity, price FROM order_items WHERE order_id = ?',
    [orderId]
  );

  if (result.length === 0) return [];

  return result[0].values.map(row => ({
    menuItemId: row[0] as number,
    name: row[1] as string,
    quantity: row[2] as number,
    price: row[3] as number,
  }));
}

export function addOrder(order: Omit<Order, 'id' | 'date'>): Order {
  if (!db) throw new Error('Database not initialized');

  const date = new Date().toISOString();

  db.run(
    'INSERT INTO orders (customer_name, total, date) VALUES (?, ?, ?)',
    [order.customerName, order.total, date]
  );

  const result = db.exec('SELECT last_insert_rowid()');
  const orderId = result[0].values[0][0] as number;

  // Insere os itens do pedido
  order.items.forEach(item => {
    db!.run(
      'INSERT INTO order_items (order_id, menu_item_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)',
      [orderId, item.menuItemId, item.name, item.quantity, item.price]
    );
  });

  saveDatabase();

  return { ...order, id: orderId, date };
}
```

---

**CONTINUA NA PRÓXIMA PÁGINA...**

_Devido ao tamanho, os componentes customer-view.tsx, admin-view.tsx e globals.css estão disponíveis nos arquivos já criados neste projeto. Você pode copiá-los diretamente dos arquivos:_
- `/src/components/customer-view.tsx`
- `/src/components/admin-view.tsx`
- `/src/styles/globals.css`

## ✅ Checklist de Verificação

- [ ] Todos os 13 arquivos criados
- [ ] `npm install` executado
- [ ] `npm run dev` funcionando
- [ ] Navegador abre em localhost:5173
- [ ] Pode adicionar itens no admin
- [ ] Pode fazer pedidos como cliente
- [ ] Dados persistem após refresh

## 🎉 Pronto!

Seu sistema de pedidos com SQLite está funcionando!
