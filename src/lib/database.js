import { API_URL } from './api';

export async function getMenus() {
  const response = await fetch(`${API_URL}/menus`);
  if (!response.ok) {
    throw new Error('Erro ao buscar cardápios');
  }
  return response.json();
}

export async function getMenuItems() {
  const response = await fetch(`${API_URL}/items`);
  if (!response.ok) {
    throw new Error('Erro ao buscar itens do cardápio');
  }
  return response.json();
}

export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`);
  if (!response.ok) {
    throw new Error('Erro ao buscar pedidos');
  }
  return response.json();
}

export async function createOrder(order) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar pedido');
  }
  return response.json();
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar status do pedido');
  }
  return response.json();
}