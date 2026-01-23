import dotenv from 'dotenv';
import { initializeDatabase } from './db/database';
import { setupContainer } from './container/setup';
import { createApp } from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    console.log('🚀 Iniciando servidor Cardápio...\n');

    // 1. Inicializar banco de dados
    console.log('📊 Inicializando banco de dados...');
    const db = await initializeDatabase();

    // 2. Configurar container de DI
    console.log('🔧 Configurando injeção de dependências...');
    const container = setupContainer(db);

    // 3. Criar aplicação Express
    console.log('🏗️  Criando aplicação Express...');
    const app = createApp(container);

    // 4. Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n✨ Servidor rodando em http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base: http://localhost:${PORT}/api\n`);
    });
  } catch (error: any) {
    console.error('❌ Falha ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

start();