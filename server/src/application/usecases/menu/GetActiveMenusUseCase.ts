import { MenuService } from '../../../domain/menus/MenuService';
import { PaginationDTO } from '../../queries';
import { MenuResponseDTO } from '../../dtos/menu';

export interface GetActiveMenusInput {
  page?: number;
  limit?: number;
}

export class GetActiveMenusUseCase {
  constructor(private menuService: MenuService) {}

  async execute(input: GetActiveMenusInput): Promise<PaginationDTO<MenuResponseDTO>> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const allMenus = await this.menuService.getAllMenus();
    const activeMenus = allMenus.filter(m => m.active === true);

    const total = activeMenus.length;
    const offset = (page - 1) * limit;
    const paginatedMenus = activeMenus.slice(offset, offset + limit);

    const dtos = paginatedMenus.map(m => MenuResponseDTO.from(m));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
