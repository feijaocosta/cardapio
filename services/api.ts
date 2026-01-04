// Tipos de dados
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
  menuId?: number;
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

// Configuração da URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para fazer requisições
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ==================== Menu Items ====================

export async function getMenuItems(): Promise<MenuItem[]> {
  return fetchAPI<MenuItem[]>('/menu-items');
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  return fetchAPI<MenuItem>('/menu-items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function updateMenuItem(id: number, item: Partial<Omit<MenuItem, 'id'>>): Promise<void> {
  await fetchAPI(`/menu-items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
}

export async function removeMenuItem(id: number): Promise<void> {
  await fetchAPI(`/menu-items/${id}`, {
    method: 'DELETE',
  });
}

// ==================== Orders ====================

export async function getOrders(): Promise<Order[]> {
  return fetchAPI<Order[]>('/orders');
}

export async function addOrder(order: Omit<Order, 'id' | 'date'>): Promise<Order> {
  return fetchAPI<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

// ==================== Menus ====================

export async function getMenus(): Promise<Menu[]> {
  return fetchAPI<Menu[]>('/menus');
}

export async function getActiveMenus(): Promise<Menu[]> {
  return fetchAPI<Menu[]>('/menus?active=true');
}

export async function addMenu(menu: Omit<Menu, 'id'>): Promise<Menu> {
  return fetchAPI<Menu>('/menus', {
    method: 'POST',
    body: JSON.stringify(menu),
  });
}

export async function updateMenu(id: number, menu: Partial<Omit<Menu, 'id'>>): Promise<void> {
  await fetchAPI(`/menus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menu),
  });
}

export async function removeMenu(id: number): Promise<void> {
  await fetchAPI(`/menus/${id}`, {
    method: 'DELETE',
  });
}

export async function getMenuItemsByMenuId(menuId: number): Promise<MenuItem[]> {
  return fetchAPI<MenuItem[]>(`/menus/${menuId}/items`);
}

export async function addItemToMenu(menuId: number, itemId: number): Promise<void> {
  await fetchAPI(`/menus/${menuId}/items`, {
    method: 'POST',
    body: JSON.stringify({ itemId }),
  });
}

export async function removeItemFromMenu(menuId: number, itemId: number): Promise<void> {
  await fetchAPI(`/menus/${menuId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

// ==================== Settings ====================

export async function getSettings(): Promise<Settings> {
  return fetchAPI<Settings>('/settings');
}

export async function updateSettings(settings: Partial<Settings>): Promise<void> {
  await fetchAPI('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// ==================== Inicialização ====================

// Função de inicialização que pode ser chamada ao carregar o app
// (não faz nada no frontend, mas mantém compatibilidade com código existente)
export async function initDatabase(): Promise<void> {
  // Verifica se a API está acessível
  try {
    await fetchAPI('/health');
  } catch (error) {
    console.error('Falha ao conectar com a API:', error);
    throw new Error('Backend não está acessível. Certifique-se de que o servidor está rodando.');
  }
}
