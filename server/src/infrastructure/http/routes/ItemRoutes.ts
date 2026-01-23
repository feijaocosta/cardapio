import { Router, Request, Response } from 'express';
import { Container } from '../../../container/Container';
import { ItemController } from '../controllers/ItemController';
import { asyncHandler } from '../middleware/asyncHandler';

export function createItemRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<ItemController>('ItemController');

  router.get('/', asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
  router.get('/:id', asyncHandler((req: Request, res: Response) => controller.getById(req, res)));
  router.get('/menu/:menuId', asyncHandler((req: Request, res: Response) => controller.getByMenuId(req, res)));
  router.post('/', asyncHandler((req: Request, res: Response) => controller.create(req, res)));
  router.put('/:id', asyncHandler((req: Request, res: Response) => controller.update(req, res)));
  router.delete('/:id', asyncHandler((req: Request, res: Response) => controller.delete(req, res)));

  return router;
}
