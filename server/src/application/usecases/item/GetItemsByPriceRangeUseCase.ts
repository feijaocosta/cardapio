import { ItemService } from '../../../domain/menus/ItemService';
import { PaginationDTO } from '../../queries';
import { ItemResponseDTO } from '../../dtos/item';

export interface GetItemsByPriceRangeInput {
  minPrice: number;
  maxPrice: number;
  menuId?: number;
  page?: number;
  limit?: number;
}

export class GetItemsByPriceRangeUseCase {
  constructor(private itemService: ItemService) {}

  async execute(input: GetItemsByPriceRangeInput): Promise<PaginationDTO<ItemResponseDTO>> {
    if (input.minPrice < 0 || input.maxPrice < 0 || input.minPrice > input.maxPrice) {
      return PaginationDTO.empty(input.page || 1, input.limit || 10);
    }

    const page = input.page || 1;
    const limit = input.limit || 10;

    let items = await this.itemService.getAllItems();

    // Filtrar por menu se fornecido
    if (input.menuId) {
      items = items.filter(i => i.menuId === input.menuId);
    }

    // Filtrar por faixa de preço
    const filtered = items.filter(i =>
      i.price >= input.minPrice && i.price <= input.maxPrice
    );

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginatedItems = filtered.slice(offset, offset + limit);

    const dtos = paginatedItems.map(i => ItemResponseDTO.from(i));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
