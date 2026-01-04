// lib/api.ts (Substitui a lógica de acesso a dados local por chamadas à API do Servidor)

// URL base da sua nova API. Mantenha 'http://localhost:3333' para desenvolvimento.
const API_BASE_URL = 'http://localhost:3333/api';

// --- Interfaces (Baseadas no database.ts original ) ---

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: string;
}

export interface Menu {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  active: boolean;
}

export interface Settings {
  showPrices: boolean;
  theme: string;
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

async function putData(endpoint: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Falha na chamada PUT para ${endpoint}: ${response.statusText}`);
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

// --- Funções de Acesso a Dados (Substituindo database.ts) ---

// Menu Items (Itens da Biblioteca)
export async function getMenuItems(): Promise<MenuItem[]> {
  return fetchData('items') as Promise<MenuItem[]>;
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  const result = await postData('items', item);
  return { ...item, id: result.id };
}

export async function removeMenuItem(id: number): Promise<void> {
  await deleteData(`items/${id}`);
}

// Orders (Pedidos)
export async function getOrders(): Promise<Order[]> {
  const orders = await fetchData('orders') as any[];
  // Converte customer_name de snake_case (Backend) para camelCase (Frontend)
  return orders.map(order => ({
    ...order,
    customerName: order.customer_name,
  })) as Order[];
}

export async function addOrder(order: Omit<Order, 'id' | 'date'>): Promise<Order> {
  // O Backend espera 'customerName' e 'menuItemId' em camelCase
  const orderData = {
    customerName: order.customerName,
    items: order.items.map(item => ({
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    total: order.total,
  };

  await postData('orders', orderData);
  
  // Retorna um objeto Order completo (com ID e data) para simular o comportamento do database.ts
  return {
    ...order,
    id: 0, // ID temporário, pois o Frontend não precisa do ID para esta operação
    date: new Date().toISOString(),
  };
}

// Menus (Cardápios)
export async function getMenus(): Promise<Menu[]> {
  return fetchData('menus') as Promise<Menu[]>;
}

export async function getActiveMenus(): Promise<Menu[]> {
  return fetchData('menus/active') as Promise<Menu[]>;
}

export async function addMenu(menu: Omit<Menu, 'id'>): Promise<Menu> {
  const result = await postData('menus', menu);
  return { ...menu, id: result.id };
}

export async function updateMenu(id: number, menu: Partial<Omit<Menu, 'id'>>): Promise<void> {
  await putData(`menus/${id}`, menu);
}

export async function removeMenu(id: number): Promise<void> {
  await deleteData(`menus/${id}`);
}

// Menu Item Relationships (Itens por Cardápio)
export async function getMenuItemsByMenuId(menuId: number): Promise<MenuItem[]> {
  return fetchData(`menu-items-link/${menuId}`) as Promise<MenuItem[]>;
}

export async function addItemToMenu(menuId: number, itemId: number): Promise<void> {
  await postData('menu-items-link', { menuId, itemId });
}

export async function removeItemFromMenu(menuId: number, itemId: number): Promise<void> {
  // O Backend usa DELETE com corpo, mas o fetch não suporta. Usamos POST para o unlink.
  // Se o Backend for alterado para DELETE /api/menu-items-link?menuId=X&itemId=Y, use deleteData.
  await deleteData(`menu-items-link?menuId=${menuId}&itemId=${itemId}`);
}

// Settings (Configurações)
export async function getSettings(): Promise<Settings> {
  return fetchData('settings') as Promise<Settings>;
}

export async function updateSettings(settings: Partial<Settings>): Promise<void> {
  await postData('settings', settings);
}

// --- Constantes Estáticas (Não precisam de Backend) ---

export interface Theme {
    id: string;
    name: string;
    primary: string;
    primaryHover: string;
    gradient: string;
    textPrimary: string;
  }
  
  export const AVAILABLE_THEMES: Theme[] = [
    {
        id: 'orange',
        name: 'Laranja',
        primary: 'bg-orange-500',
        primaryHover: 'hover:bg-orange-600',
        gradient: 'from-orange-50 to-red-50',
        textPrimary: 'text-orange-600'
      },
      {
        id: 'blue',
        name: 'Azul',
        primary: 'bg-blue-500',
        primaryHover: 'hover:bg-blue-600',
        gradient: 'from-blue-50 to-indigo-50',
        textPrimary: 'text-blue-600'
      },
      {
        id: 'green',
        name: 'Verde',
        primary: 'bg-green-500',
        primaryHover: 'hover:bg-green-600',
        gradient: 'from-green-50 to-emerald-50',
        textPrimary: 'text-green-600'
      },
      {
        id: 'purple',
        name: 'Roxo',
        primary: 'bg-purple-500',
        primaryHover: 'hover:bg-purple-600',
        gradient: 'from-purple-50 to-pink-50',
        textPrimary: 'text-purple-600'
      },
      {
        id: 'red',
        name: 'Vermelho',
        primary: 'bg-red-500',
        primaryHover: 'hover:bg-red-600',
        gradient: 'from-red-50 to-rose-50',
        textPrimary: 'text-red-600'
      }
    ];
// A função initDatabase e saveDatabase não são mais necessárias no Frontend.
// A lógica de inicialização e persistência agora está no Backend.
// As constantes AVAILABLE_THEMES podem permanecer no Frontend, pois são dados estáticos.