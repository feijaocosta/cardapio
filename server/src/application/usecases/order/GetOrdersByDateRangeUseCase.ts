import { OrderService } from '../../../domain/orders/OrderService';
import { PaginationDTO } from '../../queries';
import { OrderResponseDTO } from '../../dtos/order';

export interface GetOrdersByDateRangeInput {
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
}

export class GetOrdersByDateRangeUseCase {
  constructor(private orderService: OrderService) {}

  async execute(input: GetOrdersByDateRangeInput): Promise<PaginationDTO<OrderResponseDTO>> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    try {
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      if (startDate > endDate) {
        return PaginationDTO.empty(page, limit);
      }

      const allOrders = await this.orderService.getAllOrders();

      const filtered = allOrders.filter(o => {
        const orderDate = new Date(o.createdAt || new Date());
        return orderDate >= startDate && orderDate <= endDate;
      });

      const total = filtered.length;
      const offset = (page - 1) * limit;
      const paginatedOrders = filtered.slice(offset, offset + limit);

      const dtos = paginatedOrders.map(o => OrderResponseDTO.from(o));
      return new PaginationDTO(dtos, page, limit, total);
    } catch {
      return PaginationDTO.empty(page, limit);
    }
  }
}
