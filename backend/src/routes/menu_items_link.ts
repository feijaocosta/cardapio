import { FastifyInstance } from 'fastify';
import { db } from '../db';

export async function menuItemsLinkRoutes(app: FastifyInstance) {
  // GET /api/menu-items-link/:menuId - Retorna todos os itens de um menu
  app.get('/:menuId', (req) => {
    const { menuId } = req.params as any;
    
    return db.prepare(`
      SELECT mi.id, mi.name, mi.price, mi.description
      FROM menu_items mi
      INNER JOIN menu_menu_items mmi ON mi.id = mmi.menu_item_id
      WHERE mmi.menu_id = ?
      ORDER BY mi.id
    `).all(menuId);
  });

  // POST /api/menu-items-link - Adiciona um item a um menu (link)
  app.post('/', (req) => {
    const { menuId, itemId } = req.body as any;
    
    const existing = db.prepare(
      'SELECT 1 FROM menu_menu_items WHERE menu_id = ? AND menu_item_id = ?'
    ).get(menuId, itemId);

    if (!existing) {
      db.prepare(
        'INSERT INTO menu_menu_items (menu_id, menu_item_id) VALUES (?, ?)'
      ).run(menuId, itemId);
    }
    
    return { success: true };
  });

  // DELETE /api/menu-items-link - Remove um item de um menu (unlink)
  app.delete('/', (req) => {
    const { menuId, itemId } = req.body as any;
    
    db.prepare(
      'DELETE FROM menu_menu_items WHERE menu_id = ? AND menu_item_id = ?'
    ).run(menuId, itemId);
    
    return { success: true };
  });
}