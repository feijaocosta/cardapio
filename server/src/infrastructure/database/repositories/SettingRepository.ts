import { Database } from 'sqlite';
import { Setting } from '../../../domain/settings/Setting';
import { ISettingRepository } from '../../../domain/settings/SettingRepository';

export class SettingRepository implements ISettingRepository {
  constructor(private db: Database) {}

  async save(setting: Setting): Promise<Setting> {
    const existing = await this.findByKey(setting.key);
    
    if (existing) {
      // Update
      await this.db.run(
        `UPDATE settings SET value = ?, type = ? WHERE key = ?`,
        [setting.value, setting.type, setting.key]
      );
    } else {
      // Insert
      await this.db.run(
        `INSERT INTO settings (key, value, type) VALUES (?, ?, ?)`,
        [setting.key, setting.value, setting.type]
      );
    }
    
    return setting;
  }

  async findByKey(key: string): Promise<Setting | null> {
    const row = await this.db.get<any>(
      'SELECT * FROM settings WHERE key = ?',
      key
    );
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<Setting[]> {
    const rows = await this.db.all<any[]>('SELECT * FROM settings ORDER BY key');
    return rows.map(row => this.toDomain(row));
  }

  async delete(key: string): Promise<void> {
    await this.db.run('DELETE FROM settings WHERE key = ?', key);
  }

  private toDomain(row: any): Setting {
    return new Setting(
      row.key,
      row.value,
      row.type || 'string'
    );
  }
}
