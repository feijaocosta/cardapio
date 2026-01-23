import { OrderService } from '../../../domain/orders/OrderService';
import { PaginationDTO } from '../../queries';
import { OrderResponseDTO } from '../../dtos/order';

export interface SearchOrdersByCustomerInput {
  customerName: string;
  page?: number;
  limit?: number;
}

export class SearchOrdersByCustomerUseCase {
  constructor(private orderService: OrderService) {}

  async execute(input: SearchOrdersByCustomerInput): Promise<PaginationDTO<OrderResponseDTO>> {
    if (!input.customerName || input.customerName.trim().length === 0) {
      return PaginationDTO.empty(input.page || 1, input.limit || 10);
    }

    const page = input.page || 1;
    const limit = input.limit || 10;

    const allOrders = await this.orderService.getAllOrders();

    const term = input.customerName.toLowerCase();
    const filtered = allOrders.filter(o =>
      o.customerName.toLowerCase().includes(term)
    );

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginatedOrders = filtered.slice(offset, offset + limit);

    const dtos = paginatedOrders.map(o => OrderResponseDTO.from(o));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
