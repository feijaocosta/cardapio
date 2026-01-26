import { MenuItem } from './MenuItem';
import { IItemRepository } from './ItemRepository';
import { NotFoundError } from '../../core/errors/AppError';
import { CreateItemDTO, UpdateItemDTO, ItemResponseDTO, AddItemToMenuDTO } from '../../application/dtos/item';

export class ItemService {
  constructor(private itemRepository: IItemRepository) {}

  async getItemById(id: number): Promise<ItemResponseDTO> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Item', id);
    }
    const menuIds = await this.itemRepository.getMenusByItemId(id);
    return ItemResponseDTO.from(item, menuIds);
  }

  async getItemsByMenuId(menuId: number): Promise<ItemResponseDTO[]> {
    const items = await this.itemRepository.getItemsByMenuId(menuId);
    return items.map(item => ItemResponseDTO.from(item));
  }

  async getAllItems(): Promise<ItemResponseDTO[]> {
    const items = await this.itemRepository.findAll();
    return items.map(item => ItemResponseDTO.from(item));
  }

  async createItem(dto: CreateItemDTO): Promise<ItemResponseDTO> {
    const item = MenuItem.create(0, dto.name, dto.price, dto.description);
    const saved = await this.itemRepository.save(item);
    return ItemResponseDTO.from(saved);
  }

  async updateItem(id: number, dto: UpdateItemDTO): Promise<ItemResponseDTO> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Item', id);
    }

    const updated = new MenuItem(
      item.id,
      dto.name !== undefined ? dto.name : item.name,
      dto.price !== undefined ? dto.price : item.price,
      dto.description !== undefined ? dto.description : item.description
    );

    const saved = await this.itemRepository.save(updated);
    const menuIds = await this.itemRepository.getMenusByItemId(id);
    return ItemResponseDTO.from(saved, menuIds);
  }

  async deleteItem(id: number): Promise<void> {
    await this.itemRepository.delete(id);
  }

  async addItemToMenu(dto: AddItemToMenuDTO): Promise<void> {
    // Validar se item existe
    const item = await this.itemRepository.findById(dto.itemId);
    if (!item) {
      throw new NotFoundError('Item', dto.itemId);
    }

    // Validar se menu existe
    const menus = await this.itemRepository.getMenusByItemId(dto.itemId);
    
    // Verificar se item já está associado a este menu
    if (menus.includes(dto.menuId)) {
      throw new Error('Este item já está associado a este menu');
    }

    try {
      await this.itemRepository.addItemToMenu(dto.menuId, dto.itemId);
    } catch (error: any) {
      // Tratar erro de constraint UNIQUE
      if (error.code === 'SQLITE_CONSTRAINT' || error.errno === 19) {
        throw new Error('Este item já está associado a este menu');
      }
      throw error;
    }
  }

  async removeItemFromMenu(menuId: number, itemId: number): Promise<void> {
    await this.itemRepository.removeItemFromMenu(menuId, itemId);
  }
}
