import { MenuService } from '../../../domain/menus/MenuService';
import { ItemService } from '../../../domain/menus/ItemService';
import { MenuStatistics } from '../../aggregations';
import { MenuResponseDTO } from '../../dtos/menu';

export interface GetMenuStatisticsInput {
  menuId?: number;
}

export class GetMenuStatisticsUseCase {
  constructor(
    private menuService: MenuService,
    private itemService: ItemService
  ) {}

  async execute(input: GetMenuStatisticsInput): Promise<{ menu?: MenuResponseDTO; statistics: MenuStatistics }> {
    let items: any[] = [];

    if (input.menuId) {
      const menu = await this.menuService.getMenuById(input.menuId);
      items = await this.itemService.getItemsByMenuId(input.menuId);
      const statistics = MenuStatistics.from(items);
      return {
        menu: MenuResponseDTO.from(menu),
        statistics
      };
    } else {
      // Retornar estatísticas de todos os itens
      const allItems = await this.itemService.getAllItems();
      const statistics = MenuStatistics.from(allItems);
      return { statistics };
    }
  }
}
