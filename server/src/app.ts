import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Container } from './container/Container';
import { createMenuRoutes } from './infrastructure/http/routes/MenuRoutes';
import { createItemRoutes } from './infrastructure/http/routes/ItemRoutes';
import { createOrderRoutes } from './infrastructure/http/routes/OrderRoutes';
import { createSettingRoutes } from './infrastructure/http/routes/SettingRoutes';
import { errorHandler } from './infrastructure/http/middleware/errorHandler';

export function createApp(container: Container): Express {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Rotas
  app.use('/api/menus', createMenuRoutes(container));
  app.use('/api/items', createItemRoutes(container));
  app.use('/api/orders', createOrderRoutes(container));
  app.use('/api/settings', createSettingRoutes(container));

  // Middleware de erro (deve ser o último)
  app.use(errorHandler);

  return app;
}
