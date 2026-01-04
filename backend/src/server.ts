import Fastify from 'fastify';
import cors from '@fastify/cors';

import { menusRoutes } from './routes/menus';
import { itemsRoutes } from './routes/items';
import { ordersRoutes } from './routes/orders';
import { settingsRoutes } from './routes/settings';
import { menuItemsLinkRoutes } from './routes/menu_items_link'; // Importação da nova rota

const app = Fastify();

// Permite que o frontend (em outra porta) se comunique com o backend
await app.register(cors, { origin: true });

// Registro das rotas com prefixo /api
await app.register(menusRoutes, { prefix: '/api/menus' });
await app.register(itemsRoutes, { prefix: '/api/items' });
await app.register(ordersRoutes, { prefix: '/api/orders' });
await app.register(settingsRoutes, { prefix: '/api/settings' });
await app.register(menuItemsLinkRoutes, { prefix: '/api/menu-items-link' }); 

// Rota de saúde para verificar se o servidor está ativo
app.get('/health', async () => ({ status: 'ok' }));

// Inicia o servidor na porta 3333
app.listen({ port: 3333, host: '0.0.0.0' })
  .then(() => console.log('API rodando em http://localhost:3333' ));