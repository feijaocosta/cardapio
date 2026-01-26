-- 005_remove_menu_id_from_items.sql - Remover coluna menu_id da tabela items

-- SQLite não suporta DROP COLUMN direto, então usamos a estratégia de recriação
CREATE TABLE items_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Copiar dados da tabela antiga (sem a coluna menu_id)
INSERT INTO items_new (id, name, price, description, created_at, updated_at)
SELECT id, name, price, description, created_at, updated_at FROM items;

-- Remover tabela antiga
DROP TABLE items;

-- Renomear nova tabela
ALTER TABLE items_new RENAME TO items;

-- Recriar índices
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
