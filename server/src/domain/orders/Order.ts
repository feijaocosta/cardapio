import { ValidationError } from '../../core/errors/AppError';

export type OrderStatus = 'Pendente' | 'Em preparação' | 'Pronto' | 'Entregue' | 'Cancelado';

export class Order {
  constructor(
    readonly id: number | null,
    readonly customerName: string,
    readonly status: OrderStatus,
    readonly items: OrderItem[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.customerName || !this.customerName.trim()) {
      throw new ValidationError('Nome do cliente é obrigatório');
    }

    const validStatuses: OrderStatus[] = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];
    if (!validStatuses.includes(this.status)) {
      throw new ValidationError('Status do pedido inválido');
    }

    if (!Array.isArray(this.items) || this.items.length === 0) {
      throw new ValidationError('Pedido deve conter pelo menos um item');
    }
  }

  static create(customerName: string, items: OrderItem[]): Order {
    return new Order(
      null,
      customerName,
      'Pendente',
      items,
      new Date(),
      new Date()
    );
  }

  changeStatus(newStatus: OrderStatus): Order {
    return new Order(
      this.id,
      this.customerName,
      newStatus,
      this.items,
      this.createdAt,
      new Date()
    );
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }
}

export class OrderItem {
  constructor(
    readonly id: number | null,
    readonly orderId: number | null,
    readonly itemId: number,
    readonly quantity: number,
    readonly unitPrice: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!Number.isInteger(this.quantity) || this.quantity <= 0) {
      throw new ValidationError('Quantidade deve ser um número inteiro positivo');
    }

    if (this.unitPrice < 0) {
      throw new ValidationError('Preço unitário não pode ser negativo');
    }
  }

  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }

  static create(itemId: number, quantity: number, unitPrice: number): OrderItem {
    return new OrderItem(null, null, itemId, quantity, unitPrice);
  }
}
