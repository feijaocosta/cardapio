import express from 'express';
import { getDatabase } from '../db/database';

const router = express.Router();

// Listar todos os itens
router.get('/', async (req, res) => {
  const db = await getDatabase();
  const items = await db.all('SELECT * FROM menu_items');
  res.json(items);
});

// Criar um novo item
router.post('/', async (req, res) => {
  const db = await getDatabase();
  const { name, price, description } = req.body;

  const result = await db.run(
    'INSERT INTO menu_items (name, price, description) VALUES (?, ?, ?)',
    name,
    price,
    description
  );
  res.status(201).json({ itemId: result.lastID });
});

// Update an item
router.put('/:id', async (req, res) => {
  const db = await getDatabase();
  const { id } = req.params;
  const { name, price, description } = req.body;

  await db.run(
    'UPDATE menu_items SET name = ?, price = ?, description = ? WHERE id = ?',
    name,
    price,
    description,
    id
  );

  res.status(200).json({ message: 'Item updated successfully' });
});

// Delete an item
router.delete('/:id', async (req, res) => {
  const db = await getDatabase();
  const { id } = req.params;

  await db.run('DELETE FROM menu_items WHERE id = ?', id);

  res.status(200).json({ message: 'Item deleted successfully' });
});

export default router;