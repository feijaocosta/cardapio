// lib/storage.ts (Refatorado para usar a API do Servidor)

// URL base da sua nova API. Mantenha 'http://localhost:3333' para desenvolvimento.
const API_BASE_URL = 'http://localhost:3333/api';

// --- Interfaces (Atualizadas para usar ID como number ) ---

export interface MenuItem {
  id: number; // Mudança: Agora é number (do banco de dados)
  name: string;
  price: number;
  description?: string;
}

export interface OrderItem {
  menuItemId: number; // Mudança: Agora é number
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number; // Mudança: Agora é number
  customer_name: string; // O backend usa snake_case
  items: OrderItem[];
  total: number;
  date: string;
}

// --- Funções Auxiliares para Comunicação HTTP ---

async function postData(endpoint: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Falha na chamada POST para ${endpoint}: ${response.statusText}`);
  }
  return response.json();
}

async function fetchData(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Falha na chamada GET para ${endpoint}: ${response.statusText}`);
  }
  return response.json();
}

async function deleteData(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Falha na chamada DELETE para ${endpoint}: ${response.statusText}`);
  }
  return response.json();
}

// --- Funções de Acesso a Dados (Substituindo localStorage) ---

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  // Chama GET /api/items
  const items = await fetchData('items');
  // Remove a lógica de inicialização de dados, que agora é responsabilidade do Backend (schema.sql)
  return items as MenuItem[];
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  // Chama POST /api/items
  const result = await postData('items', item);
  // Retorna o item completo com o ID gerado pelo servidor
  return { ...item, id: result.id };
};

export const removeMenuItem = async (id: number): Promise<void> => {
  // Chama DELETE /api/items/:id
  await deleteData(`items/${id}`);
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
  // Chama GET /api/orders
  const orders = await fetchData('orders');
  return orders as Order[];
};

export const addOrder = async (order: Omit<Order, 'id' | 'date'>): Promise<Order> => {
  // O Backend espera 'customerName' e 'menuItemId' em camelCase
  const orderData = {
    customerName: order.customer_name,
    items: order.items.map(item => ({
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    total: order.total,
  };

  // Chama POST /api/orders
  await postData('orders', orderData);
  // Como o Backend não retorna o objeto Order completo, apenas um sucesso,
  // você pode retornar um objeto mock ou adaptar o Backend para retornar o objeto criado.
  // Por simplicidade, retornamos um objeto parcial.
  return {
    ...order,
    id: 0, // ID temporário, pois o Frontend não precisa do ID para esta operação
    date: new Date().toISOString(),
  };
};