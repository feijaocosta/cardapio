import express from 'express';
import { getDatabase } from '../db/database';

const router = express.Router();

// GET /settings - Fetch system settings
router.get('/', async (req, res) => {
  const db = await getDatabase();
  const rows = await db.all('SELECT key, value FROM settings');

  const settings = rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  res.json(settings);
});

// PUT /settings - Update system settings
router.put('/', async (req, res) => {
  const db = await getDatabase();
  const updates = req.body;

  const stmt = await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

  for (const [key, value] of Object.entries(updates)) {
    await stmt.run(key, value);
  }

  res.status(200).json({ message: 'Settings updated successfully' });
});

export default router;