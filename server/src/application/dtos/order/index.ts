import { ValidationError } from '../../../core/errors/AppError';
import { OrderStatus } from '../../../domain/orders/Order';

export class CreateOrderDTO {
  customerName: string;
  items: Array<{
    itemId: number;
    quantity: number;
    unitPrice: number;
  }>;

  constructor(data: any) {
    const rawName = data?.customerName;
    this.customerName = typeof rawName === 'string' ? rawName.trim() : '';
    this.items = (data?.items || []).map((item: any) => ({
      itemId: Number(item.itemId),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    }));

    this.validate();
  }

  private validate(): void {
    if (!this.customerName) {
      throw new ValidationError('Nome do cliente é obrigatório');
    }
    if (!Array.isArray(this.items) || this.items.length === 0) {
      throw new ValidationError('Pedido deve conter pelo menos um item');
    }
  }
}

export class UpdateOrderDTO {
  status?: OrderStatus;
  customerName?: string;

  constructor(data: any) {
    this.status = data?.status || undefined;
    this.customerName = data?.customerName?.trim() || undefined;
  }
}

export class OrderResponseDTO {
  id: number;
  customerName: string;
  status: OrderStatus;
  items: Array<{
    id: number | null;
    itemId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<OrderResponseDTO>) {
    this.id = data.id!;
    this.customerName = data.customerName!;
    this.status = data.status!;
    this.items = data.items || [];
    this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(entity: any): OrderResponseDTO {
    return new OrderResponseDTO({
      id: entity.id,
      customerName: entity.customerName,
      status: entity.status,
      items: entity.items.map((item: any) => ({
        id: item.id,
        itemId: item.itemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.getSubtotal(),
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
