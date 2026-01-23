-- 002_create_settings.sql - Criação da tabela de configurações

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'string',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações padrão do sistema
INSERT OR IGNORE INTO settings (key, value, type) VALUES
  ('app_name', 'Cardápio', 'string'),
  ('app_description', 'Sistema de gerenciamento de cardápios', 'string'),
  ('currency', 'BRL', 'string'),
  ('max_menu_items', '100', 'number'),
  ('enable_notifications', 'true', 'boolean');
