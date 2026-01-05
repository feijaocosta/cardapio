import express from 'express';
import { getDatabase } from '../db/database';

const router = express.Router();

// Listar todos os pedidos
router.get('/', async (req, res) => {
  const db = await getDatabase();
  const orders = await db.all('SELECT * FROM orders');
  res.json(orders);
});

// Criar um novo pedido
router.post('/', async (req, res) => {
  const db = await getDatabase();
  const { customerName, items } = req.body;

  const result = await db.run(
    'INSERT INTO orders (customer_name, status) VALUES (?, ?)',
    customerName,
    'Pendente'
  );
  const orderId = result.lastID;

  for (const item of items) {
    await db.run(
      'INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)',
      orderId,
      item.id,
      item.quantity
    );
  }

  res.status(201).json({ orderId });
});

// Atualizar o status de um pedido
router.put('/:id', async (req, res) => {
  const db = await getDatabase();
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  await db.run('UPDATE orders SET status = ? WHERE id = ?', status, id);
  res.status(200).json({ message: 'Status atualizado com sucesso' });
});

export default router;