import { MenuService } from '../../../domain/menus/MenuService';
import { SearchService, PaginationDTO } from '../../queries';
import { MenuResponseDTO } from '../../dtos/menu';

export interface SearchMenusInput {
  term: string;
  page?: number;
  limit?: number;
}

export class SearchMenusUseCase {
  private searchService = new SearchService();

  constructor(private menuService: MenuService) {}

  async execute(input: SearchMenusInput): Promise<PaginationDTO<MenuResponseDTO>> {
    if (!input.term || input.term.trim().length === 0) {
      return PaginationDTO.empty(input.page || 1, input.limit || 10);
    }

    const page = input.page || 1;
    const limit = input.limit || 10;

    const allMenus = await this.menuService.getAllMenus();

    // Buscar em nome e descrição
    const term = input.term.toLowerCase();
    const filtered = allMenus.filter(m =>
      m.name.toLowerCase().includes(term) ||
      (m.description?.toLowerCase().includes(term) || false)
    );

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginatedMenus = filtered.slice(offset, offset + limit);

    const dtos = paginatedMenus.map(m => MenuResponseDTO.from(m));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
