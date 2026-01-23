import { OrderService } from '../../../domain/orders/OrderService';
import { PaginationDTO } from '../../queries';
import { OrderResponseDTO } from '../../dtos/order';

export interface ListOrdersByStatusInput {
  status: string;
  page?: number;
  limit?: number;
}

export class ListOrdersByStatusUseCase {
  constructor(private orderService: OrderService) {}

  async execute(input: ListOrdersByStatusInput): Promise<PaginationDTO<OrderResponseDTO>> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const allOrders = await this.orderService.getAllOrders();
    const filtered = allOrders.filter(o => o.status === input.status);

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginatedOrders = filtered.slice(offset, offset + limit);

    const dtos = paginatedOrders.map(o => OrderResponseDTO.from(o));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
