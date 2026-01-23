import { Router, Request, Response } from 'express';
import { Container } from '../../../container/Container';
import { OrderController } from '../controllers/OrderController';
import { asyncHandler } from '../middleware/asyncHandler';

export function createOrderRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<OrderController>('OrderController');

  router.get('/', asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
  router.get('/:id', asyncHandler((req: Request, res: Response) => controller.getById(req, res)));
  router.post('/', asyncHandler((req: Request, res: Response) => controller.create(req, res)));
  router.put('/:id', asyncHandler((req: Request, res: Response) => controller.update(req, res)));
  router.delete('/:id', asyncHandler((req: Request, res: Response) => controller.delete(req, res)));
  
  router.patch('/:id/status', asyncHandler((req: Request, res: Response) => controller.changeStatus(req, res)));

  return router;
}
