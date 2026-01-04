import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Define o caminho para a pasta 'data'
const dataDir = path.resolve('data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Conecta ao banco de dados. O arquivo será criado em 'data/database.sqlite'
export const db = new Database(path.join(dataDir, 'database.sqlite'));

// Lê o esquema SQL e o executa para criar as tabelas
const schema = fs.readFileSync(
  path.resolve('src/schema.sql'),
  'utf-8'
);

db.exec(schema);