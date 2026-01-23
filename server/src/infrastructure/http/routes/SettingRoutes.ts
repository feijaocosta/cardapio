import { Router, Request, Response } from 'express';
import { Container } from '../../../container/Container';
import { SettingController } from '../controllers/SettingController';
import { asyncHandler } from '../middleware/asyncHandler';

export function createSettingRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<SettingController>('SettingController');

  router.get('/', asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
  router.get('/:key', asyncHandler((req: Request, res: Response) => controller.getByKey(req, res)));
  router.put('/:key', asyncHandler((req: Request, res: Response) => controller.update(req, res)));
  router.post('/:key', asyncHandler((req: Request, res: Response) => controller.createOrUpdate(req, res)));
  router.delete('/:key', asyncHandler((req: Request, res: Response) => controller.delete(req, res)));

  return router;
}
