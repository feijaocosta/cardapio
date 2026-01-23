import { ItemService } from '../../../domain/menus/ItemService';
import { PaginationDTO } from '../../queries';
import { ItemResponseDTO } from '../../dtos/item';

export interface SearchItemsInput {
  term: string;
  menuId?: number;
  page?: number;
  limit?: number;
}

export class SearchItemsUseCase {
  constructor(private itemService: ItemService) {}

  async execute(input: SearchItemsInput): Promise<PaginationDTO<ItemResponseDTO>> {
    if (!input.term || input.term.trim().length === 0) {
      return PaginationDTO.empty(input.page || 1, input.limit || 10);
    }

    const page = input.page || 1;
    const limit = input.limit || 10;

    let items = await this.itemService.getAllItems();

    // Filtrar por menu se fornecido
    if (input.menuId) {
      items = items.filter(i => i.menuId === input.menuId);
    }

    // Buscar em nome e descrição
    const term = input.term.toLowerCase();
    const filtered = items.filter(i =>
      i.name.toLowerCase().includes(term) ||
      (i.description?.toLowerCase().includes(term) || false)
    );

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginatedItems = filtered.slice(offset, offset + limit);

    const dtos = paginatedItems.map(i => ItemResponseDTO.from(i));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
