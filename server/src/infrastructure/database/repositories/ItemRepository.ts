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
        `UPDATE items SET menu_id = ?, name = ?, price = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [item.menuId, item.name, item.price, item.description, item.id]
      );
      return item;
    } else {
      // Insert
      const result = await this.db.run(
        `INSERT INTO items (menu_id, name, price, description, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [item.menuId, item.name, item.price, item.description]
      );
      return new MenuItem(
        result.lastID as number,
        item.menuId,
        item.name,
        item.price,
        item.description,
        item.createdAt,
        item.updatedAt
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

  async findByMenuId(menuId: number): Promise<MenuItem[]> {
    const rows = await this.db.all<any[]>(
      'SELECT * FROM items WHERE menu_id = ? ORDER BY id DESC',
      menuId
    );
    return rows.map(row => this.toDomain(row));
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

  private toDomain(row: any): MenuItem {
    return new MenuItem(
      row.id,
      row.menu_id,
      row.name,
      row.price,
      row.description || null,
      row.created_at ? new Date(row.created_at) : new Date(),
      row.updated_at ? new Date(row.updated_at) : new Date()
    );
  }
}
