import { FastifyInstance } from 'fastify';
import { db } from '../db';

export async function ordersRoutes(app: FastifyInstance) {
  // GET /api/orders
  app.get('/', () =>
    db.prepare('SELECT * FROM orders ORDER BY id DESC').all()
  );

  // POST /api/orders
  app.post('/', (req) => {
    const { customerName, items, total } = req.body as any;
    const date = new Date().toISOString();

    // 1. Insere o pedido principal
    const order = db.prepare(`
      INSERT INTO orders (customer_name, total, date)
      VALUES (?, ?, ?)
    `).run(customerName, total, date);

    // 2. Insere os itens do pedido
    const stmt = db.prepare(`
      INSERT INTO order_items
      (order_id, menu_item_id, name, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      stmt.run(
        order.lastInsertRowid,
        item.menuItemId,
        item.name,
        item.quantity,
        item.price
      );
    }

    return { success: true };
  });
}