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

// ✅ NOVO: Layout/Tema é agora um layout completo, não apenas cores
export interface LayoutTheme {
  id: 'default' | 'modern' | 'image-based'; // ID do layout que vai ser usado
  name: string;
  description: string;
}

export const AVAILABLE_LAYOUTS: LayoutTheme[] = [
  {
    id: 'default',
    name: 'Padrão',
    description: 'Design clássico com tema laranja',
  },
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Dark theme com sidebar do carrinho',
  },
  {
    id: 'image-based',
    name: 'Instituto Atos',
    description: 'Design premium e elegante com paleta neutra e dourada',
  },
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

export type OrderStatus = 'Pendente' | 'Em preparação' | 'Pronto' | 'Entregue' | 'Cancelado';

export async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  return fetchAPI<Order>(`/api/orders/${orderId}/status`, {
    method: 'POST',
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

export interface Setting {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
}

export async function getSetting(key: string): Promise<Setting> {
  return fetchAPI<Setting>(`/api/settings/${key}`);
}

export async function getAllSettings(): Promise<Setting[]> {
  return fetchAPI<Setting[]>('/api/settings');
}

export async function updateSetting(key: string, value: string): Promise<Setting> {
  return fetchAPI<Setting>(`/api/settings/${key}`, {
    method: 'POST',
    body: JSON.stringify({ value }),
  });
}

// Helpers para configurações específicas
export async function getShowPrice(): Promise<boolean> {
  try {
    const setting = await getSetting('show_price');
    return setting.value === 'true';
  } catch {
    return false; // Padrão: preço oculto
  }
}

export async function setShowPrice(show: boolean): Promise<void> {
  await updateSetting('show_price', show ? 'true' : 'false');
}

export async function getLayoutModel(): Promise<'grid' | 'list' | 'carousel'> {
  try {
    const setting = await getSetting('layout_model');
    const value = setting.value as 'grid' | 'list' | 'carousel';
    return ['grid', 'list', 'carousel'].includes(value) ? value : 'grid';
  } catch {
    return 'grid'; // Padrão: grid
  }
}

export async function setLayoutModel(layout: 'grid' | 'list' | 'carousel'): Promise<void> {
  await updateSetting('layout_model', layout);
}

// ==================== Tema/Layout ====================

// ✅ NOVO: Obter o tema/layout que o admin escolheu
export async function getTheme(): Promise<'default' | 'modern' | 'image-based'> {
  try {
    const setting = await getSetting('theme');
    const value = setting.value as string;
    // Validar se o tema existe na lista de layouts disponíveis
    const isValid = AVAILABLE_LAYOUTS.find(t => t.id === value);
    return isValid ? (value as 'default' | 'modern' | 'image-based') : 'default';
  } catch {
    return 'default'; // Padrão: layout default
  }
}

// ✅ NOVO: Salvar o tema/layout escolhido
export async function setTheme(themeId: 'default' | 'modern' | 'image-based'): Promise<void> {
  // Validar se o tema existe
  const themeExists = AVAILABLE_LAYOUTS.find(t => t.id === themeId);
  if (!themeExists) {
    throw new Error(`Tema inválido: ${themeId}`);
  }
  await updateSetting('theme', themeId);
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
