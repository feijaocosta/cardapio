import { OrderService } from '../../../domain/orders/OrderService';
import { OrderStatistics } from '../../aggregations';

export interface GetOrderStatisticsInput {
  period?: 'today' | 'week' | 'month' | 'year' | 'all';
}

export class GetOrderStatisticsUseCase {
  constructor(private orderService: OrderService) {}

  async execute(input: GetOrderStatisticsInput): Promise<OrderStatistics> {
    const allOrders = await this.orderService.getAllOrders();
    const period = input.period || 'all';

    const filtered = this.filterByPeriod(allOrders, period);
    return OrderStatistics.from(filtered);
  }

  private filterByPeriod(orders: any[], period: string): any[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt || new Date());
      const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());

      switch (period) {
        case 'today':
          return orderDateOnly.getTime() === today.getTime();
        case 'week':
          return orderDate >= startOfWeek;
        case 'month':
          return orderDate >= startOfMonth;
        case 'year':
          return orderDate >= startOfYear;
        case 'all':
        default:
          return true;
      }
    });
  }
}
