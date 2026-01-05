import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite'; // Certifique-se de que 'sqlite' está instalado
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const migrationsPath = path.resolve(__dirname, '../../migrations');

export async function getDatabase(): Promise<Database> {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

async function applyMigrations(db: Database): Promise<void> {
  // Ensure the migrations table exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure the migrations directory exists
  if (!fs.existsSync(migrationsPath)) {
    fs.mkdirSync(migrationsPath);
    console.log(`Created migrations directory at: ${migrationsPath}`);
  }

  // Get the list of applied migrations
  const appliedMigrations = await db.all<{ name: string }[]>(
    'SELECT name FROM migrations'
  );
  const appliedMigrationNames = new Set(appliedMigrations.map((m) => m.name));

  // Read migration files
  const migrationFiles = fs.readdirSync(migrationsPath).filter((file) => file.endsWith('.sql'));

  // Apply pending migrations
  for (const file of migrationFiles) {
    if (!appliedMigrationNames.has(file)) {
      const migrationSQL = fs.readFileSync(path.join(migrationsPath, file), 'utf-8');
      await db.exec(migrationSQL);
      await db.run('INSERT INTO migrations (name) VALUES (?)', file);
      console.log(`Applied migration: ${file}`);
    }
  }
}

export async function initializeDatabase(): Promise<Database> {
  const db = await getDatabase();
  await applyMigrations(db);
  return db;
}