// Tipos de dados
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface OrderItem {
  itemId: number;
  name?: string;
  quantity: number;
  unitPrice: number;
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
  logo_filename?: string;
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
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

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

// ==================== Itens do Cardápio ====================

export async function getMenuItems(): Promise<MenuItem[]> {
  return fetchAPI<MenuItem[]>('/api/items');
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  return fetchAPI<MenuItem>('/api/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function updateMenuItem(id: number, item: Partial<Omit<MenuItem, 'id'>>): Promise<void> {
  await fetchAPI(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
}

export async function removeMenuItem(id: number): Promise<void> {
  await fetchAPI(`/api/items/${id}`, {
    method: 'DELETE',
  });
}

// ==================== Pedidos ====================

export async function getOrders(): Promise<Order[]> {
  return fetchAPI<Order[]>('/api/orders');
}

export async function addOrder(order: Omit<Order, 'id' | 'date'>): Promise<Order> {
  return fetchAPI<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  await fetchAPI(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ==================== Cardápios ====================

export async function getMenus(): Promise<Menu[]> {
  return fetchAPI<Menu[]>('/api/menus');
}

export async function getActiveMenus(): Promise<Menu[]> {
  return fetchAPI<Menu[]>('/api/menus?active=true');
}

export async function addMenu(menu: Omit<Menu, 'id'>): Promise<Menu> {
  return fetchAPI<Menu>('/api/menus', {
    method: 'POST',
    body: JSON.stringify(menu),
  });
}

export async function addMenuWithLogo(
  name: string,
  description: string | undefined,
  active: boolean,
  logoFile: File | null
): Promise<Menu> {
  const formData = new FormData();
  formData.append('name', name);
  if (description) {
    formData.append('description', description);
  }
  formData.append('active', String(active));
  if (logoFile) {
    formData.append('logo', logoFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/menus`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function updateMenu(
  id: number,
  name?: string,
  description?: string,
  active?: boolean,
  logoFile?: File | null
): Promise<Menu> {
  const formData = new FormData();
  if (name !== undefined) {
    formData.append('name', name);
  }
  if (description !== undefined) {
    formData.append('description', description);
  }
  if (active !== undefined) {
    formData.append('active', String(active));
  }
  if (logoFile) {
    formData.append('logo', logoFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/menus/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function removeMenu(id: number): Promise<void> {
  await fetchAPI(`/api/menus/${id}`, {
    method: 'DELETE',
  });
}

export async function getMenuItemsByMenuId(menuId: number): Promise<MenuItem[]> {
  return fetchAPI<MenuItem[]>(`/api/items/menu/${menuId}`);
}

export async function addItemToMenu(itemId: number, menuId: number): Promise<void> {
  await fetchAPI(`/api/items/${itemId}/menus`, {
    method: 'POST',
    body: JSON.stringify({ menuId }),
  });
}

export async function removeItemFromMenu(menuId: number, itemId: number): Promise<void> {
  await fetchAPI(`/api/items/${itemId}/menus/${menuId}`, {
    method: 'DELETE',
  });
}

// ==================== Configurações ====================

export async function getSettings(): Promise<Settings> {
  return fetchAPI<Settings>('/api/settings');
}

export async function updateSettings(settings: Partial<Settings>): Promise<void> {
  await fetchAPI('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// ==================== Inicialização ====================

export async function initDatabase(): Promise<void> {
  // Verifica se a API está acessível
  try {
    await fetchAPI('/health');
  } catch (error) {
    console.error('Falha ao conectar com a API:', error);
    throw new Error('Backend não está acessível. Certifique-se de que o servidor está rodando.');
  }
}
