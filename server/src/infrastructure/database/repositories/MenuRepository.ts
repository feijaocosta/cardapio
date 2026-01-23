import { Database } from 'sqlite';
import { Menu } from '../../../domain/menus/Menu';
import { IMenuRepository } from '../../../domain/menus/MenuRepository';
import { NotFoundError } from '../../../core/errors/AppError';

export class MenuRepository implements IMenuRepository {
  constructor(private db: Database) {}

  async save(menu: Menu): Promise<Menu> {
    if (menu.id) {
      // Update
      await this.db.run(
        `UPDATE menus SET name = ?, description = ?, logo_filename = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [menu.name, menu.description, menu.logoFilename, menu.active ? 1 : 0, menu.id]
      );
      return menu;
    } else {
      // Insert
      const result = await this.db.run(
        `INSERT INTO menus (name, description, active, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [menu.name, menu.description, menu.active ? 1 : 0]
      );
      return new Menu(
        result.lastID as number,
        menu.name,
        menu.description,
        menu.logoFilename,
        menu.active,
        menu.createdAt,
        menu.updatedAt
      );
    }
  }

  async findById(id: number): Promise<Menu | null> {
    const row = await this.db.get<any>(
      'SELECT * FROM menus WHERE id = ?',
      id
    );
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<Menu[]> {
    const rows = await this.db.all<any[]>('SELECT * FROM menus ORDER BY id DESC');
    return rows.map(row => this.toDomain(row));
  }

  async delete(id: number): Promise<void> {
    const menu = await this.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu', id);
    }
    await this.db.run('DELETE FROM menus WHERE id = ?', id);
  }

  private toDomain(row: any): Menu {
    return new Menu(
      row.id,
      row.name,
      row.description || null,
      row.logo_filename || null,
      row.active === 1,
      row.created_at ? new Date(row.created_at) : new Date(),
      row.updated_at ? new Date(row.updated_at) : new Date()
    );
  }
}
