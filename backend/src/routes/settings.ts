import { FastifyInstance } from 'fastify';
import { db } from '../db';

export async function settingsRoutes(app: FastifyInstance) {
  // GET /api/settings
  app.get('/', () => {
    const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string, value: string }[];
    const settings: Record<string, any> = {};
    
    rows.forEach(r => {
      if (r.key === 'showPrices') {
        settings.showPrices = r.value === 'true';
      } else if (r.key === 'theme') {
        settings.theme = r.value;
      } else {
        settings[r.key] = r.value;
      }
    });

    return {
      showPrices: settings.showPrices ?? true,
      theme: settings.theme ?? 'orange'
    };
  });

  // POST /api/settings - Atualiza as configurações
  app.post('/', (req) => {
    const settings = req.body as any;

    if (settings.showPrices !== undefined) {
      db.prepare(`
        INSERT OR REPLACE INTO settings (key, value)
        VALUES (?, ?)
      `).run('showPrices', settings.showPrices ? 'true' : 'false');
    }
    
    if (settings.theme !== undefined) {
      db.prepare(`
        INSERT OR REPLACE INTO settings (key, value)
        VALUES (?, ?)
      `).run('theme', settings.theme);
    }

    return { success: true };
  });
}