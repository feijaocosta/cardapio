import express from 'express';
import { getDatabase } from '../db/database';

const router = express.Router();

// Listar todos os cardápios
router.get('/', async (req, res) => {
  const db = await getDatabase();
  const menus = await db.all('SELECT * FROM menus');
  res.json(menus);
});

// Criar um novo cardápio
router.post('/', async (req, res) => {
  const db = await getDatabase();
  const { name } = req.body;

  const result = await db.run('INSERT INTO menus (name) VALUES (?)', name);
  res.status(201).json({ menuId: result.lastID });
});

// Update a menu
router.put('/:id', async (req, res) => {
  const db = await getDatabase();
  const { id } = req.params;
  const { name, description, active } = req.body;

  await db.run(
    'UPDATE menus SET name = ?, description = ?, active = ? WHERE id = ?',
    name,
    description,
    active,
    id
  );

  res.status(200).json({ message: 'Menu updated successfully' });
});

// Delete a menu
router.delete('/:id', async (req, res) => {
  const db = await getDatabase();
  const { id } = req.params;

  await db.run('DELETE FROM menus WHERE id = ?', id);

  res.status(200).json({ message: 'Menu deleted successfully' });
});

export default router;