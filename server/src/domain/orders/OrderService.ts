import { Order, OrderItem, OrderStatus } from './Order';
import { IOrderRepository } from './OrderRepository';
import { NotFoundError } from '../../core/errors/AppError';
import { CreateOrderDTO, UpdateOrderDTO, OrderResponseDTO } from '../../application/dtos/order';

export class OrderService {
  constructor(private orderRepository: IOrderRepository) {}

  async getAllOrders(): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepository.findAll();
    return orders.map(order => OrderResponseDTO.from(order));
  }

  async getOrderById(id: number): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Pedido', id);
    }
    return OrderResponseDTO.from(order);
  }

  async createOrder(dto: CreateOrderDTO): Promise<OrderResponseDTO> {
    const items = dto.items.map(item =>
      OrderItem.create(item.itemId, item.quantity, item.unitPrice)
    );
    const order = Order.create(dto.customerName, items);
    const saved = await this.orderRepository.save(order);
    return OrderResponseDTO.from(saved);
  }

  async updateOrder(id: number, dto: UpdateOrderDTO): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Pedido', id);
    }

    let updated = order;
    if (dto.status !== undefined) {
      updated = updated.changeStatus(dto.status);
    }

    if (dto.customerName !== undefined) {
      updated = new Order(
        updated.id,
        dto.customerName,
        updated.status,
        updated.items,
        updated.createdAt,
        new Date()
      );
    }

    const saved = await this.orderRepository.save(updated);
    return OrderResponseDTO.from(saved);
  }

  async deleteOrder(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async changeOrderStatus(id: number, newStatus: OrderStatus): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Pedido', id);
    }

    const updated = order.changeStatus(newStatus);
    const saved = await this.orderRepository.save(updated);
    return OrderResponseDTO.from(saved);
  }
}
