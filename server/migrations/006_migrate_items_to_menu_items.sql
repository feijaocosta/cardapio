-- 006_migrate_items_to_menu_items.sql - Migrar items existentes para relacionamento N:N

-- Inserir todos os items na tabela menu_items
-- Isso cria o relacionamento entre menus e items
INSERT INTO menu_items (menu_id, item_id, created_at, updated_at)
SELECT DISTINCT
  m.id as menu_id,
  i.id as item_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM menus m
CROSS JOIN items i
WHERE NOT EXISTS (
  SELECT 1 FROM menu_items 
  WHERE menu_id = m.id AND item_id = i.id
);
