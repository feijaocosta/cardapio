import { ItemService } from '../../../domain/menus/ItemService';
import { PaginationDTO } from '../../queries';
import { ItemResponseDTO } from '../../dtos/item';

export interface ListItemsByMenuInput {
  menuId: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export class ListItemsByMenuUseCase {
  constructor(private itemService: ItemService) {}

  async execute(input: ListItemsByMenuInput): Promise<PaginationDTO<ItemResponseDTO>> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const items = await this.itemService.getItemsByMenuId(input.menuId);

    // Aplicar ordenação
    if (input.sortBy) {
      items.sort((a, b) => {
        const aVal = (a as any)[input.sortBy!];
        const bVal = (b as any)[input.sortBy!];

        if (aVal < bVal) return input.sortDirection === 'DESC' ? 1 : -1;
        if (aVal > bVal) return input.sortDirection === 'DESC' ? -1 : 1;
        return 0;
      });
    }

    const total = items.length;
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    const dtos = paginatedItems.map(i => ItemResponseDTO.from(i));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
