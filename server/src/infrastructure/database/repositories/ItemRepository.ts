import { Database } from 'sqlite';
import { MenuItem } from '../../../domain/menus/MenuItem';
import { IItemRepository } from '../../../domain/menus/ItemRepository';
import { NotFoundError } from '../../../core/errors/AppError';

export class ItemRepository implements IItemRepository {
  constructor(private db: Database) {}

  async save(item: MenuItem): Promise<MenuItem> {
    if (item.id) {
      // Update
      await this.db.run(
        `UPDATE items SET name = ?, price = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [item.name, item.price, item.description, item.id]
      );
      return item;
    } else {
      // Insert
      const result = await this.db.run(
        `INSERT INTO items (name, price, description, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [item.name, item.price, item.description]
      );
      return new MenuItem(
        result.lastID as number,
        item.name,
        item.price,
        item.description
      );
    }
  }

  async findById(id: number): Promise<MenuItem | null> {
    const row = await this.db.get<any>(
      'SELECT * FROM items WHERE id = ?',
      id
    );
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<MenuItem[]> {
    const rows = await this.db.all<any[]>('SELECT * FROM items ORDER BY id DESC');
    return rows.map(row => this.toDomain(row));
  }

  async delete(id: number): Promise<void> {
    const item = await this.findById(id);
    if (!item) {
      throw new NotFoundError('Item', id);
    }
    await this.db.run('DELETE FROM items WHERE id = ?', id);
  }

  // Métodos para relacionamento N:N
  async addItemToMenu(menuId: number, itemId: number): Promise<void> {
    await this.db.run(
      `INSERT INTO menu_items (menu_id, item_id, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [menuId, itemId]
    );
  }

  async removeItemFromMenu(menuId: number, itemId: number): Promise<void> {
    await this.db.run(
      `DELETE FROM menu_items WHERE menu_id = ? AND item_id = ?`,
      [menuId, itemId]
    );
  }

  async getItemsByMenuId(menuId: number): Promise<MenuItem[]> {
    const rows = await this.db.all<any[]>(
      `SELECT i.* FROM items i 
       INNER JOIN menu_items mi ON i.id = mi.item_id 
       WHERE mi.menu_id = ? 
       ORDER BY i.id DESC`,
      menuId
    );
    return rows.map(row => this.toDomain(row));
  }

  async getMenusByItemId(itemId: number): Promise<number[]> {
    const rows = await this.db.all<any[]>(
      `SELECT menu_id FROM menu_items WHERE item_id = ? ORDER BY menu_id`,
      itemId
    );
    return rows.map(row => row.menu_id);
  }

  private toDomain(row: any): MenuItem {
    return new MenuItem(
      row.id,
      row.name,
      row.price,
      row.description || undefined
    );
  }
}
