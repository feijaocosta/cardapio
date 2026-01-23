import { Request, Response } from 'express';
import { OrderService } from '../../../domain/orders/OrderService';
import { CreateOrderDTO, UpdateOrderDTO } from '../../../application/dtos/order';
import { OrderStatus } from '../../../domain/orders/Order';

export class OrderController {
  constructor(private orderService: OrderService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const orders = await this.orderService.getAllOrders();
    res.json(orders);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const order = await this.orderService.getOrderById(Number(id));
    res.json(order);
  }

  async create(req: Request, res: Response): Promise<void> {
    const dto = new CreateOrderDTO(req.body);
    const order = await this.orderService.createOrder(dto);
    res.status(201).json(order);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = new UpdateOrderDTO(req.body);
    const order = await this.orderService.updateOrder(Number(id), dto);
    res.json(order);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.orderService.deleteOrder(Number(id));
    res.status(204).send();
  }

  async changeStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      res.status(400).json({ message: 'Status é obrigatório' });
      return;
    }

    const validStatuses: OrderStatus[] = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Status inválido' });
      return;
    }

    const order = await this.orderService.changeOrderStatus(Number(id), status);
    res.json(order);
  }
}
