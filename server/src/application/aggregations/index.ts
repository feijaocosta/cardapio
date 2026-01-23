export class MenuStatistics {
  totalItems: number = 0;
  avgPrice: number = 0;
  minPrice: number = 0;
  maxPrice: number = 0;
  activeItemsCount: number = 0;

  constructor(data?: Partial<MenuStatistics>) {
    if (data) {
      this.totalItems = data.totalItems ?? 0;
      this.avgPrice = data.avgPrice ?? 0;
      this.minPrice = data.minPrice ?? 0;
      this.maxPrice = data.maxPrice ?? 0;
      this.activeItemsCount = data.activeItemsCount ?? 0;
    }
  }

  static from(items: any[]): MenuStatistics {
    const stats = new MenuStatistics();
    
    if (items.length === 0) return stats;

    stats.totalItems = items.length;
    stats.activeItemsCount = items.filter(i => i.active !== false).length;

    const prices = items.map(i => i.price || 0).filter(p => p > 0);
    if (prices.length > 0) {
      stats.avgPrice = Number((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2));
      stats.minPrice = Number(Math.min(...prices).toFixed(2));
      stats.maxPrice = Number(Math.max(...prices).toFixed(2));
    }

    return stats;
  }
}

export class OrderStatistics {
  totalOrders: number = 0;
  totalRevenue: number = 0;
  avgOrderValue: number = 0;
  ordersByStatus: Record<string, number> = {};
  topCustomers: Array<{ name: string; count: number; total: number }> = [];

  constructor(data?: Partial<OrderStatistics>) {
    if (data) {
      this.totalOrders = data.totalOrders ?? 0;
      this.totalRevenue = data.totalRevenue ?? 0;
      this.avgOrderValue = data.avgOrderValue ?? 0;
      this.ordersByStatus = data.ordersByStatus ?? {};
      this.topCustomers = data.topCustomers ?? [];
    }
  }

  static from(orders: any[]): OrderStatistics {
    const stats = new OrderStatistics();

    if (orders.length === 0) return stats;

    stats.totalOrders = orders.length;

    // Calcular revenue
    const revenues = orders.map(o => {
      const total = (o.items || []).reduce((sum: number, item: any) => {
        return sum + ((item.unitPrice || 0) * (item.quantity || 1));
      }, 0);
      return total;
    });

    stats.totalRevenue = Number(revenues.reduce((a, b) => a + b, 0).toFixed(2));
    stats.avgOrderValue = Number((stats.totalRevenue / orders.length).toFixed(2));

    // Breakdown por status
    orders.forEach(order => {
      const status = order.status || 'Pendente';
      stats.ordersByStatus[status] = (stats.ordersByStatus[status] || 0) + 1;
    });

    // Top customers
    const customerMap = new Map<string, { count: number; total: number }>();
    orders.forEach(order => {
      const customer = order.customerName || 'Desconhecido';
      const total = revenues[orders.indexOf(order)];

      if (!customerMap.has(customer)) {
        customerMap.set(customer, { count: 0, total: 0 });
      }

      const current = customerMap.get(customer)!;
      current.count += 1;
      current.total += total;
    });

    stats.topCustomers = Array.from(customerMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        total: Number(data.total.toFixed(2))
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return stats;
  }
}

export class SystemStatistics {
  totalMenus: number = 0;
  totalItems: number = 0;
  totalOrders: number = 0;
  totalRevenue: number = 0;
  avgOrderValue: number = 0;
  topMenu: { name: string; itemCount: number } | null = null;

  constructor(data?: Partial<SystemStatistics>) {
    if (data) {
      this.totalMenus = data.totalMenus ?? 0;
      this.totalItems = data.totalItems ?? 0;
      this.totalOrders = data.totalOrders ?? 0;
      this.totalRevenue = data.totalRevenue ?? 0;
      this.avgOrderValue = data.avgOrderValue ?? 0;
      this.topMenu = data.topMenu ?? null;
    }
  }

  static from(menus: any[], items: any[], orders: any[]): SystemStatistics {
    const stats = new SystemStatistics();

    stats.totalMenus = menus.length;
    stats.totalItems = items.length;
    stats.totalOrders = orders.length;

    // Calculate revenue
    const revenues = orders.map(o => {
      return (o.items || []).reduce((sum: number, item: any) => {
        return sum + ((item.unitPrice || 0) * (item.quantity || 1));
      }, 0);
    });

    stats.totalRevenue = Number(revenues.reduce((a, b) => a + b, 0).toFixed(2));
    stats.avgOrderValue = stats.totalOrders > 0 
      ? Number((stats.totalRevenue / stats.totalOrders).toFixed(2))
      : 0;

    // Find top menu
    if (menus.length > 0) {
      const menuItemCounts = menus.map(m => ({
        name: m.name,
        itemCount: items.filter(i => i.menuId === m.id).length
      }));

      stats.topMenu = menuItemCounts.reduce((prev, current) =>
        current.itemCount > prev.itemCount ? current : prev
      ) || null;
    }

    return stats;
  }
}
