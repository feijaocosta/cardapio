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

export interface Menu {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  active: boolean;
}

export interface Settings {
  showPrices: boolean;
  theme: string;
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  gradient: string;
  textPrimary: string;
}

export const AVAILABLE_THEMES: Theme[] = [
  {
    id: 'orange',
    name: 'Laranja',
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    gradient: 'from-orange-50 to-red-50',
    textPrimary: 'text-orange-600'
  },
  {
    id: 'blue',
    name: 'Azul',
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    gradient: 'from-blue-50 to-indigo-50',
    textPrimary: 'text-blue-600'
  },
  {
    id: 'green',
    name: 'Verde',
    primary: 'bg-green-500',
    primaryHover: 'hover:bg-green-600',
    gradient: 'from-green-50 to-emerald-50',
    textPrimary: 'text-green-600'
  },
  {
    id: 'purple',
    name: 'Roxo',
    primary: 'bg-purple-500',
    primaryHover: 'hover:bg-purple-600',
    gradient: 'from-purple-50 to-pink-50',
    textPrimary: 'text-purple-600'
  },
  {
    id: 'red',
    name: 'Vermelho',
    primary: 'bg-red-500',
    primaryHover: 'hover:bg-red-600',
    gradient: 'from-red-50 to-rose-50',
    textPrimary: 'text-red-600'
  }
];

// Inicializa o banco de dados
export async function initDatabase(): Promise<void> {
  if (db) return;

  const SQL = await initSqlJs({
    locateFile: (file) => {
      // Em produção (build), os arquivos estarão em /assets/
      // Em desenvolvimento, usa o CDN
      if (import.meta.env.PROD) {
        return `/assets/${file}`;
      }
      return `https://sql.js.org/dist/${file}`;
    }
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
        date TEXT NOT NULL,
        menu_id INTEGER,
        FOREIGN KEY (menu_id) REFERENCES menus(id)
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

    db.run(`
      CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        logo TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS menu_menu_items (
        menu_id INTEGER NOT NULL,
        menu_item_id INTEGER NOT NULL,
        PRIMARY KEY (menu_id, menu_item_id),
        FOREIGN KEY (menu_id) REFERENCES menus(id),
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
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

    // Cria cardápio padrão
    db.run(
      'INSERT INTO menus (name, description, active) VALUES (?, ?, ?)',
      ['Cardápio Geral', 'Cardápio principal com todos os itens', 1]
    );

    // Associa todos os itens ao cardápio padrão
    for (let i = 1; i <= initialItems.length; i++) {
      db.run(
        'INSERT INTO menu_menu_items (menu_id, menu_item_id) VALUES (?, ?)',
        [1, i]
      );
    }

    // Configurações padrão
    db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['showPrices', 'true']);
    db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['theme', 'orange']);

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

// Menus
export function getMenus(): Menu[] {
  if (!db) return [];
  
  const result = db.exec('SELECT * FROM menus ORDER BY id');
  if (result.length === 0) return [];

  return result[0].values.map(row => ({
    id: row[0] as number,
    name: row[1] as string,
    description: row[2] as string | undefined,
    logo: row[3] as string | undefined,
    active: Boolean(row[4]),
  }));
}

export function getActiveMenus(): Menu[] {
  if (!db) return [];
  
  const result = db.exec('SELECT * FROM menus WHERE active = 1 ORDER BY id');
  if (result.length === 0) return [];

  return result[0].values.map(row => ({
    id: row[0] as number,
    name: row[1] as string,
    description: row[2] as string | undefined,
    logo: row[3] as string | undefined,
    active: Boolean(row[4]),
  }));
}

export function addMenu(menu: Omit<Menu, 'id'>): Menu {
  if (!db) throw new Error('Database not initialized');

  db.run(
    'INSERT INTO menus (name, description, logo, active) VALUES (?, ?, ?, ?)',
    [menu.name, menu.description || null, menu.logo || null, menu.active ? 1 : 0]
  );

  const result = db.exec('SELECT last_insert_rowid()');
  const id = result[0].values[0][0] as number;

  saveDatabase();

  return { ...menu, id };
}

export function updateMenu(id: number, menu: Partial<Omit<Menu, 'id'>>): void {
  if (!db) return;

  const updates: string[] = [];
  const values: any[] = [];

  if (menu.name !== undefined) {
    updates.push('name = ?');
    values.push(menu.name);
  }
  if (menu.description !== undefined) {
    updates.push('description = ?');
    values.push(menu.description || null);
  }
  if (menu.logo !== undefined) {
    updates.push('logo = ?');
    values.push(menu.logo || null);
  }
  if (menu.active !== undefined) {
    updates.push('active = ?');
    values.push(menu.active ? 1 : 0);
  }

  if (updates.length > 0) {
    values.push(id);
    db.run(`UPDATE menus SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDatabase();
  }
}

export function removeMenu(id: number): void {
  if (!db) return;
  db.run('DELETE FROM menu_menu_items WHERE menu_id = ?', [id]);
  db.run('DELETE FROM menus WHERE id = ?', [id]);
  saveDatabase();
}

export function getMenuItemsByMenuId(menuId: number): MenuItem[] {
  if (!db) return [];
  
  const result = db.exec(`
    SELECT mi.id, mi.name, mi.price, mi.description
    FROM menu_items mi
    INNER JOIN menu_menu_items mmi ON mi.id = mmi.menu_item_id
    WHERE mmi.menu_id = ?
    ORDER BY mi.id
  `, [menuId]);

  if (result.length === 0) return [];

  return result[0].values.map(row => ({
    id: row[0] as number,
    name: row[1] as string,
    price: row[2] as number,
    description: row[3] as string | undefined,
  }));
}

export function addItemToMenu(menuId: number, itemId: number): void {
  if (!db) return;
  
  // Verifica se já existe
  const result = db.exec(
    'SELECT 1 FROM menu_menu_items WHERE menu_id = ? AND menu_item_id = ?',
    [menuId, itemId]
  );
  
  if (result.length === 0) {
    db.run(
      'INSERT INTO menu_menu_items (menu_id, menu_item_id) VALUES (?, ?)',
      [menuId, itemId]
    );
    saveDatabase();
  }
}

export function removeItemFromMenu(menuId: number, itemId: number): void {
  if (!db) return;
  db.run(
    'DELETE FROM menu_menu_items WHERE menu_id = ? AND menu_item_id = ?',
    [menuId, itemId]
  );
  saveDatabase();
}

// Settings
export function getSettings(): Settings {
  if (!db) return { showPrices: true, theme: 'orange' };
  
  const result = db.exec('SELECT key, value FROM settings');
  if (result.length === 0) return { showPrices: true, theme: 'orange' };

  const settings: any = {};
  result[0].values.forEach(row => {
    const key = row[0] as string;
    const value = row[1] as string;
    
    if (key === 'showPrices') {
      settings.showPrices = value === 'true';
    } else if (key === 'theme') {
      settings.theme = value;
    }
  });

  return {
    showPrices: settings.showPrices ?? true,
    theme: settings.theme ?? 'orange'
  };
}

export function updateSettings(settings: Partial<Settings>): void {
  if (!db) return;

  if (settings.showPrices !== undefined) {
    db.run(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['showPrices', settings.showPrices ? 'true' : 'false']
    );
  }
  
  if (settings.theme !== undefined) {
    db.run(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['theme', settings.theme]
    );
  }

  saveDatabase();
}