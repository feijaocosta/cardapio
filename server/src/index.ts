import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import menusRouter from './routes/menus';
import ordersRouter from './routes/orders';
import itemsRouter from './routes/items';
import healthRouter from './routes/health';
import settingsRouter from './routes/settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/menus', menusRouter);
app.use('/orders', ordersRouter);
app.use('/items', itemsRouter);
app.use('/health', healthRouter);
app.use('/settings', settingsRouter);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});