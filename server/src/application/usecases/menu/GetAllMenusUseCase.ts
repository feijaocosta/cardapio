import { MenuService } from '../../../domain/menus/MenuService';
import { FilterBuilder, PaginationDTO } from '../../queries';
import { MenuResponseDTO } from '../../dtos/menu';

export interface GetAllMenusInput {
  page?: number;
  limit?: number;
  active?: boolean;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export class GetAllMenusUseCase {
  constructor(private menuService: MenuService) {}

  async execute(input: GetAllMenusInput): Promise<PaginationDTO<MenuResponseDTO>> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const menus = await this.menuService.getAllMenus();

    // Aplicar filtros
    let filtered = menus;
    if (input.active !== undefined) {
      filtered = filtered.filter(m => m.active === input.active);
    }

    // Aplicar ordenação
    if (input.sortBy) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[input.sortBy!];
        const bVal = (b as any)[input.sortBy!];

        if (aVal < bVal) return input.sortDirection === 'DESC' ? 1 : -1;
        if (aVal > bVal) return input.sortDirection === 'DESC' ? -1 : 1;
        return 0;
      });
    }

    // Paginação
    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginatedMenus = filtered.slice(offset, offset + limit);

    const dtos = paginatedMenus.map(m => MenuResponseDTO.from(m));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
