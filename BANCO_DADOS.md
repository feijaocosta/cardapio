# 💾 Banco de Dados - Schema e Migrations

## 📌 Visão Geral

SQLite com sistema automático de migrations. Dados persistidos no arquivo `server/database.sqlite`.

---

## 🏗️ Schema Completo

### Tabelas

```sql
-- 1. Cardápios
CREATE TABLE menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  active BOOLEAN DEFAULT 1
);

-- 2. Itens do Cardápio
CREATE TABLE menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT
);

-- 3. Relacionamento M2M (Cardápio ↔ Item)
CREATE TABLE menu_menu_items (
  menu_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  PRIMARY KEY (menu_id, menu_item_id),
  FOREIGN KEY (menu_id) REFERENCES menus(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- 4. Pedidos
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'Pendente'
);

-- 5. Itens dos Pedidos
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (item_id) REFERENCES menu_items(id)
);

-- 6. Configurações
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL
);

-- 7. Controle de Migrations
CREATE TABLE migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 Relacionamentos

### Diagrama E-R

```
menus (1) ───────────────────── (M) menu_menu_items ───────────────────── (M) menu_items
  id                               menu_id                                    id
  name                             menu_item_id                               name
  description                                                                price
  logo                                                                       description
  active

orders (1) ───────────────────── (M) order_items ───────────────────── (1) menu_items
  id                               order_id                                 id
  customer_name                    item_id                                  name
  created_at                       quantity                                 price
  status                                                                    description
```

### Explicação dos Relacionamentos

**menus ↔ menu_items (M2M)**
- Um cardápio pode ter múltiplos itens
- Um item pode estar em múltiplos cardápios
- Tabela `menu_menu_items` conecta os dois

**orders ↔ order_items (1:M)**
- Um pedido pode ter múltiplos itens
- Um item do pedido pertence a um único pedido

**order_items ↔ menu_items (M:1)**
- Um item do pedido referencia um item do cardápio

---

## 📂 Migrations

### Sistema de Migrations

```
server/migrations/
├── 001_init.sql
│   └─→ Cria tabelas principais
│
└── 002_create_migrations_and_settings.sql
    └─→ Cria tabelas de controle
```

### Execução Automática

**Fluxo:**
```
1. Backend inicia
   └─→ initializeDatabase()

2. Conecta ao SQLite
   └─→ Cria database.sqlite (se não existir)

3. Aplica migrations
   ├─→ Cria tabela `migrations`
   ├─→ Lê arquivos .sql ordenados
   ├─→ Para cada arquivo:
   │   ├─→ Verifica se já foi aplicado
   │   ├─→ Se não: executa SQL
   │   ├─→ Se não: registra em `migrations`
   │   └─→ Se não: loga sucesso
   │
   └─→ Banco pronto para usar!
```

### Migration 001: init.sql

Cria todas as tabelas principais: menus, menu_items, menu_menu_items, orders, order_items

### Migration 002: create_migrations_and_settings.sql

Cria tabelas de controle: migrations, settings

---

## 📊 Exemplos de Dados

### Inserir Cardápio

```sql
INSERT INTO menus (name, description, logo, active)
VALUES ('Cardápio Kids', 'Itens para crianças', 'https://...', 1);
-- Retorna: id = 1
```

### Inserir Item

```sql
INSERT INTO menu_items (name, price, description)
VALUES ('Pizza Margherita', 35.90, 'Molho, mozzarela e manjericão');
-- Retorna: id = 1
```

### Relacionar Item ao Cardápio

```sql
INSERT INTO menu_menu_items (menu_id, menu_item_id)
VALUES (1, 1);
```

### Criar Pedido

```sql
INSERT INTO orders (customer_name, status)
VALUES ('João Silva', 'Pendente');
-- Retorna: id = 1
```

### Adicionar Item ao Pedido

```sql
INSERT INTO order_items (order_id, item_id, quantity)
VALUES (1, 1, 2);
```

---

## 🔍 Queries Principais

### Listar Cardápios Ativos

```sql
SELECT * FROM menus WHERE active = 1;
```

### Listar Itens de um Cardápio

```sql
SELECT mi.id, mi.name, mi.price, mi.description
FROM menu_items mi
JOIN menu_menu_items mmi ON mi.id = mmi.menu_item_id
WHERE mmi.menu_id = ?
ORDER BY mi.name;
```

### Listar Pedidos (mais recentes primeiro)

```sql
SELECT * FROM orders
ORDER BY created_at DESC;
```

### Detalhes de um Pedido

```sql
SELECT 
  o.id,
  o.customer_name,
  o.created_at,
  o.status,
  oi.quantity,
  mi.name,
  mi.price,
  (oi.quantity * mi.price) as subtotal
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN menu_items mi ON oi.item_id = mi.id
WHERE o.id = ?
ORDER BY mi.name;
```

### Total de um Pedido

```sql
SELECT SUM(oi.quantity * mi.price) as total
FROM order_items oi
JOIN menu_items mi ON oi.item_id = mi.id
WHERE oi.order_id = ?;
```

### Obter Configuração

```sql
SELECT value FROM settings WHERE key = ?;
```

---

## 🔄 Transações

### Inserir Pedido com Itens (Atomicamente)

**Implementação TypeScript:**

```typescript
try {
  await db.run('BEGIN TRANSACTION');
  
  const orderResult = await db.run(
    'INSERT INTO orders (customer_name, status) VALUES (?, ?)',
    ['João', 'Pendente']
  );
  const orderId = orderResult.lastID;
  
  for (const item of items) {
    await db.run(
      'INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)',
      [orderId, item.id, item.quantity]
    );
  }
  
  await db.run('COMMIT');
} catch (error) {
  await db.run('ROLLBACK');
  throw error;
}
```

---

## 📈 Estatísticas

### Quantidade de Pedidos por Dia

```sql
SELECT 
  DATE(created_at) as day,
  COUNT(*) as count
FROM orders
GROUP BY DATE(created_at)
ORDER BY day DESC;
```

### Item Mais Vendido

```sql
SELECT 
  mi.name,
  SUM(oi.quantity) as total_quantity
FROM order_items oi
JOIN menu_items mi ON oi.item_id = mi.id
GROUP BY oi.item_id
ORDER BY total_quantity DESC
LIMIT 10;
```

### Faturamento Total

```sql
SELECT SUM(oi.quantity * mi.price) as total_revenue
FROM order_items oi
JOIN menu_items mi ON oi.item_id = mi.id;
```

---

## 🔐 Backup do Banco

### Fazer Backup

```bash
# Copiar arquivo
cp server/database.sqlite server/database.sqlite.backup

# Ou com data
cp server/database.sqlite server/database.sqlite.$(date +%Y%m%d).backup
```

### Restaurar Backup

```bash
cp server/database.sqlite.backup server/database.sqlite
npm run dev
```

### Exportar para SQL (Dump)

```bash
sqlite3 server/database.sqlite .dump > backup.sql
```

### Importar SQL

```bash
sqlite3 server/database.sqlite < backup.sql
```

---

## 🐛 Troubleshooting

### "Database is locked"

```bash
# Remover locks
cd server
rm -f database.sqlite-shm database.sqlite-wal
npm run dev
```

### "No such table"

Significa que migration não foi aplicada:
1. Verificar se arquivo .sql existe em `server/migrations/`
2. Verificar se nome está em ordem alfabética
3. Reiniciar servidor

### Dados Antigos Não Aparecem

1. Verifique `migrations` table
2. Se vazio: migrations não rodaram
3. Se tem valores: migrations foram aplicadas

---

## 📝 Adicionando Novas Tabelas

### Processo

1. **Criar arquivo de migration:**
   ```bash
   touch server/migrations/003_add_users_table.sql
   ```

2. **Escrever SQL:**
   ```sql
   CREATE TABLE users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL
   );
   ```

3. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

---

**Versão**: 2.0  
**Última Atualização**: Janeiro 2026
