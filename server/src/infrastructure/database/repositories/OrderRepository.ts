import { Database } from 'sqlite';
import { Order, OrderItem, OrderStatus } from '../../../domain/orders/Order';
import { IOrderRepository } from '../../../domain/orders/OrderRepository';
import { NotFoundError, ValidationError } from '../../../core/errors/AppError';

export class OrderRepository implements IOrderRepository {
  constructor(private db: Database) {}

  async save(order: Order): Promise<Order> {
    if (order.id) {
      // Update order
      await this.db.run(
        `UPDATE orders SET customer_name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [order.customerName, order.status, order.id]
      );

      // Delete and recreate order items
      await this.db.run('DELETE FROM order_items WHERE order_id = ?', order.id);
      
      for (const item of order.items) {
        await this.db.run(
          `INSERT INTO order_items (order_id, item_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
          [order.id, item.itemId, item.quantity, item.unitPrice]
        );
      }

      return order;
    } else {
      // Insert new order
      const result = await this.db.run(
        `INSERT INTO orders (customer_name, status, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [order.customerName, order.status]
      );

      const orderId = result.lastID as number;

      // Insert order items
      for (const item of order.items) {
        await this.db.run(
          `INSERT INTO order_items (order_id, item_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
          [orderId, item.itemId, item.quantity, item.unitPrice]
        );
      }

      return new Order(
        orderId,
        order.customerName,
        order.status,
        order.items,
        order.createdAt,
        order.updatedAt
      );
    }
  }

  async findById(id: number): Promise<Order | null> {
    const row = await this.db.get<any>(
      'SELECT * FROM orders WHERE id = ?',
      id
    );

    if (!row) return null;

    const items = await this.db.all<any[]>(
      'SELECT * FROM order_items WHERE order_id = ?',
      id
    );

    const orderItems = items.map(item => 
      new OrderItem(item.id, item.order_id, item.item_id, item.quantity, item.unit_price)
    );

    return this.toDomain(row, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const rows = await this.db.all<any[]>('SELECT * FROM orders ORDER BY id DESC');
    
    const orders: Order[] = [];
    for (const row of rows) {
      try {
        const items = await this.db.all<any[]>(
          'SELECT * FROM order_items WHERE order_id = ?',
          row.id
        );

        const orderItems = items.map(item =>
          new OrderItem(item.id, item.order_id, item.item_id, item.quantity, item.unit_price)
        );

        // Verificar se há items antes de tentar criar a Order
        if (orderItems.length === 0) {
          console.warn(`⚠️  Pedido ${row.id} sem items - será deletado automaticamente`);
          // Deletar pedido corrompido
          await this.db.run('DELETE FROM orders WHERE id = ?', row.id);
          continue;
        }

        const order = this.toDomain(row, orderItems);
        orders.push(order);
      } catch (error) {
        if (error instanceof ValidationError) {
          console.warn(`⚠️  Pedido ${row.id} inválido (${error.message}) - será deletado automaticamente`);
          // Deletar pedido corrompido
          await this.db.run('DELETE FROM order_items WHERE order_id = ?', row.id);
          await this.db.run('DELETE FROM orders WHERE id = ?', row.id);
          continue;
        }
        // Re-lançar outros tipos de erro
        throw error;
      }
    }

    return orders;
  }

  async delete(id: number): Promise<void> {
    const order = await this.findById(id);
    if (!order) {
      throw new NotFoundError('Pedido', id);
    }
    
    await this.db.run('DELETE FROM order_items WHERE order_id = ?', id);
    await this.db.run('DELETE FROM orders WHERE id = ?', id);
  }

  private toDomain(row: any, items: OrderItem[]): Order {
    return new Order(
      row.id,
      row.customer_name,
      row.status as OrderStatus,
      items,
      row.created_at ? new Date(row.created_at) : new Date(),
      row.updated_at ? new Date(row.updated_at) : new Date()
    );
  }
}
