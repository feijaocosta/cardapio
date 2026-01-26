import { Router, Request, Response } from 'express';
import { Container } from '../../../container/Container';
import { MenuController } from '../controllers/MenuController';
import { asyncHandler } from '../middleware/asyncHandler';
import { upload } from '../../../middleware/upload';

export function createMenuRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<MenuController>('MenuController');
  const uploadMiddleware = container.get<any>('uploadMiddleware');

  // Rotas genéricas
  router.get('/', asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
  router.get('/:id', asyncHandler((req: Request, res: Response) => controller.getById(req, res)));
  router.post('/', asyncHandler((req: Request, res: Response) => controller.create(req, res)));
  router.put('/:id', asyncHandler((req: Request, res: Response) => controller.update(req, res)));
  router.delete('/:id', asyncHandler((req: Request, res: Response) => controller.delete(req, res)));

  // Rotas para logo
  router.post('/:id/logo', uploadMiddleware.single('logo'), asyncHandler((req: Request, res: Response) => controller.uploadLogo(req, res)));
  router.get('/:id/logo', asyncHandler((req: Request, res: Response) => controller.getMenuLogo(req, res)));

  // Rotas para items do menu
  router.get('/:id/items', asyncHandler((req: Request, res: Response) => controller.getMenuItems(req, res)));
  router.post('/:id/items', asyncHandler((req: Request, res: Response) => controller.addItemToMenu(req, res)));
  router.delete('/:id/items/:itemId', asyncHandler((req: Request, res: Response) => controller.removeItemFromMenu(req, res)));

  return router;
}
