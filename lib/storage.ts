export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: string;
}

const MENU_KEY = 'menu_items';
const ORDERS_KEY = 'orders';

// Menu Items
export const getMenuItems = (): MenuItem[] => {
  if (typeof window === 'undefined') return [];
  const items = localStorage.getItem(MENU_KEY);
  if (!items) {
    // Initial menu items
    const initialMenu: MenuItem[] = [
      { id: '1', name: 'Pizza Margherita', price: 35.90, description: 'Molho, mussarela e manjericão' },
      { id: '2', name: 'Hambúrguer Artesanal', price: 28.50, description: 'Pão, carne, queijo e salada' },
      { id: '3', name: 'Refrigerante', price: 6.00, description: 'Lata 350ml' },
      { id: '4', name: 'Batata Frita', price: 15.00, description: 'Porção 400g' },
    ];
    localStorage.setItem(MENU_KEY, JSON.stringify(initialMenu));
    return initialMenu;
  }
  return JSON.parse(items);
};

export const addMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
  const items = getMenuItems();
  const newItem: MenuItem = {
    ...item,
    id: Date.now().toString(),
  };
  items.push(newItem);
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
  return newItem;
};

export const removeMenuItem = (id: string): void => {
  const items = getMenuItems().filter(item => item.id !== id);
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
};

// Orders
export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

export const addOrder = (order: Omit<Order, 'id' | 'date'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  orders.unshift(newOrder); // Add to beginning for most recent first
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
};
