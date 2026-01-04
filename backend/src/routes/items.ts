// backend/src/routes/items.ts
import { FastifyInstance } from 'fastify';
import { db } from '../db';

export async function itemsRoutes(app: FastifyInstance) {
  // GET /api/items
  app.get('/', () =>
    db.prepare('SELECT * FROM menu_items').all()
  );

  // POST /api/items
  app.post('/', (req) => {
    const { name, price, description } = req.body as any;
    const result = db.prepare(`
      INSERT INTO menu_items (name, price, description)
      VALUES (?, ?, ?)
    `).run(name, price, description);
    return { id: result.lastInsertRowid };
  });

  // NOVO: DELETE /api/items/:id
  app.delete('/:id', (req) => {
    const { id } = req.params as any;
    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    return { success: true };
  });
}