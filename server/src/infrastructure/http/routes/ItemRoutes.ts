import { Router, Request, Response } from 'express';
import { Container } from '../../../container/Container';
import { ItemController } from '../controllers/ItemController';
import { asyncHandler } from '../middleware/asyncHandler';

export function createItemRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<ItemController>('ItemController');

  // Rotas mais específicas ANTES das genéricas
  router.get('/menu/:menuId', asyncHandler((req: Request, res: Response) => controller.getByMenuId(req, res)));
  
  // Rotas para relacionamento N:N (ANTES das rotas genéricas de ID)
  router.post('/:id/menus', asyncHandler((req: Request, res: Response) => controller.addItemToMenu(req, res)));
  router.delete('/:id/menus/:menuId', asyncHandler((req: Request, res: Response) => controller.removeItemFromMenu(req, res)));

  // Rotas genéricas (DEPOIS das específicas)
  router.get('/', asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
  router.get('/:id', asyncHandler((req: Request, res: Response) => controller.getById(req, res)));
  router.post('/', asyncHandler((req: Request, res: Response) => controller.create(req, res)));
  router.put('/:id', asyncHandler((req: Request, res: Response) => controller.update(req, res)));
  router.delete('/:id', asyncHandler((req: Request, res: Response) => controller.delete(req, res)));

  return router;
}
