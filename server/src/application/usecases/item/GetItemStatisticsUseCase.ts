import { ItemService } from '../../../domain/menus/ItemService';
import { MenuStatistics } from '../../aggregations';

export interface GetItemStatisticsInput {
  menuId?: number;
}

export class GetItemStatisticsUseCase {
  constructor(private itemService: ItemService) {}

  async execute(input: GetItemStatisticsInput): Promise<MenuStatistics> {
    let items: any[] = [];

    if (input.menuId) {
      items = await this.itemService.getItemsByMenuId(input.menuId);
    } else {
      items = await this.itemService.getAllItems();
    }

    return MenuStatistics.from(items);
  }
}
