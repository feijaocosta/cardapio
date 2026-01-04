import { FastifyInstance } from 'fastify';
import { db } from '../db';

export async function menusRoutes(app: FastifyInstance) {
  // GET /api/menus - Retorna todos os menus
  app.get('/', () =>
    db.prepare('SELECT * FROM menus ORDER BY id').all()
  );

  // GET /api/menus/active - Retorna apenas os menus ativos
  app.get('/active', () =>
    db.prepare('SELECT * FROM menus WHERE active = 1 ORDER BY id').all()
  );

  // POST /api/menus - Adiciona um novo menu
  app.post('/', (req) => {
    const { name, description, logo, active } = req.body as any;
    const result = db.prepare(`
      INSERT INTO menus (name, description, logo, active)
      VALUES (?, ?, ?, ?)
    `).run(name, description || null, logo || null, active ? 1 : 0);
    return { id: result.lastInsertRowid };
  });

  // PUT /api/menus/:id - Atualiza um menu existente
  app.put('/:id', (req) => {
    const { id } = req.params as any;
    const menu = req.body as any;

    const updates: string[] = [];
    const values: any[] = [];

    if (menu.name !== undefined) { updates.push('name = ?'); values.push(menu.name); }
    if (menu.description !== undefined) { updates.push('description = ?'); values.push(menu.description || null); }
    if (menu.logo !== undefined) { updates.push('logo = ?'); values.push(menu.logo || null); }
    if (menu.active !== undefined) { updates.push('active = ?'); values.push(menu.active ? 1 : 0); }

    if (updates.length > 0) {
      values.push(id);
      db.prepare(`UPDATE menus SET ${updates.join(', ')} WHERE id = ?`).run(...values);
      return { success: true };
    }
    return { success: false, message: 'Nenhum campo para atualizar' };
  });

  // DELETE /api/menus/:id - Remove um menu
  app.delete('/:id', (req) => {
    const { id } = req.params as any;
    db.prepare('DELETE FROM menu_menu_items WHERE menu_id = ?').run(id);
    db.prepare('DELETE FROM menus WHERE id = ?').run(id);
    return { success: true };
  });
}