import { Router, Request, Response } from 'express';
import { Container } from '../../../container/Container';
import { MenuController } from '../controllers/MenuController';
import { asyncHandler } from '../middleware/asyncHandler';
import { upload } from '../../../middleware/upload';

export function createMenuRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<MenuController>('MenuController');

  router.get('/', asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
  router.get('/:id', asyncHandler((req: Request, res: Response) => controller.getById(req, res)));
  router.post('/', asyncHandler((req: Request, res: Response) => controller.create(req, res)));
  router.put('/:id', asyncHandler((req: Request, res: Response) => controller.update(req, res)));
  router.delete('/:id', asyncHandler((req: Request, res: Response) => controller.delete(req, res)));
  
  router.post('/:id/logo', upload.single('logo'), asyncHandler((req: Request, res: Response) => controller.uploadLogo(req, res)));
  router.get('/:id/logo', asyncHandler((req: Request, res: Response) => controller.getMenuLogo(req, res)));

  return router;
}
