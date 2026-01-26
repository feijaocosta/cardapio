-- 004_create_menu_items_table.sql - Criar tabela de relacionamento N:N

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  menu_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(menu_id, item_id),
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_item_id ON menu_items(item_id);
