import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const migrationsPath = path.resolve(__dirname, '../../migrations');

let dbInstance: Database | null = null;

// Singleton - retorna a mesma conexão
export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  return dbInstance;
}

async function applyMigrations(db: Database): Promise<void> {
  try {
    // 1. Criar tabela de migrations com UNIQUE constraint
    await db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Garantir que migrations/ existe
    if (!fs.existsSync(migrationsPath)) {
      fs.mkdirSync(migrationsPath, { recursive: true });
      console.log(`📁 Diretório migrations criado: ${migrationsPath}`);
    }

    // 3. Obter migrations já aplicadas
    const appliedMigrations = await db.all<{ name: string }[]>(
      'SELECT name FROM migrations ORDER BY name'
    );
    const appliedNames = new Set(appliedMigrations.map(m => m.name));

    // 4. Ler arquivos de migrations em ordem alfabética
    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`\n📋 Migrations encontradas: ${migrationFiles.join(', ') || 'nenhuma'}`);
    
    if (appliedNames.size > 0) {
      console.log(`✓ Migrations já aplicadas: ${Array.from(appliedNames).join(', ')}`);
    }

    if (migrationFiles.length === 0) {
      console.log('⚠️  Nenhuma migration encontrada em server/migrations/');
      return;
    }

    // 5. Aplicar migrations pendentes
    let appliedCount = 0;
    for (const file of migrationFiles) {
      if (!appliedNames.has(file)) {
        console.log(`\n🔄 Aplicando migration: ${file}`);
        
        const sqlPath = path.join(migrationsPath, file);
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        
        try {
          await db.exec(sql);
          await db.run('INSERT INTO migrations (name) VALUES (?)', [file]);
          console.log(`✅ Migration aplicada com sucesso: ${file}`);
          appliedCount++;
        } catch (error: any) {
          console.error(`❌ Erro ao aplicar migration ${file}:`, error.message);
          throw new Error(`Falha ao aplicar migration ${file}: ${error.message}`);
        }
      } else {
        console.log(`⏭️  Migration já aplicada: ${file}`);
      }
    }

    if (appliedCount > 0) {
      console.log(`\n✨ ${appliedCount} nova(s) migration(ões) aplicada(s)`);
    }

  } catch (error: any) {
    console.error('\n❌ Erro crítico ao aplicar migrations:', error.message);
    throw error;
  }
}

// Inicializar banco (chamado ao iniciar servidor)
export async function initializeDatabase(): Promise<Database> {
  try {
    console.log('\n🔧 Inicializando banco de dados...');
    const db = await getDatabase();
    await applyMigrations(db);
    console.log('✅ Banco de dados pronto!\n');
    return db;
  } catch (error: any) {
    console.error('❌ Falha ao inicializar banco de dados:', error.message);
    throw error;
  }
}