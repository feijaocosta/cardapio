import { Request, Response } from 'express';
import { ItemService } from '../../../domain/menus/ItemService';
import { CreateItemDTO, UpdateItemDTO, AddItemToMenuDTO } from '../../../application/dtos/item';

export class ItemController {
  constructor(private itemService: ItemService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const items = await this.itemService.getAllItems();
    res.json(items);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const item = await this.itemService.getItemById(Number(id));
    res.json(item);
  }

  async getByMenuId(req: Request, res: Response): Promise<void> {
    const { menuId } = req.params;
    const items = await this.itemService.getItemsByMenuId(Number(menuId));
    res.json(items);
  }

  async create(req: Request, res: Response): Promise<void> {
    const dto = new CreateItemDTO(req.body);
    const item = await this.itemService.createItem(dto);
    res.status(201).json(item);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = new UpdateItemDTO(req.body);
    const item = await this.itemService.updateItem(Number(id), dto);
    res.json(item);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.itemService.deleteItem(Number(id));
    res.status(204).send();
  }

  async addItemToMenu(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = new AddItemToMenuDTO({ menuId: req.body.menuId, itemId: Number(id) });
    await this.itemService.addItemToMenu(dto);
    res.status(201).send();
  }

  async removeItemFromMenu(req: Request, res: Response): Promise<void> {
    const { id, menuId } = req.params;
    await this.itemService.removeItemFromMenu(Number(menuId), Number(id));
    res.status(204).send();
  }
}
