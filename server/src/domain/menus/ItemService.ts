import { MenuItem } from './MenuItem';
import { IItemRepository } from './ItemRepository';
import { NotFoundError } from '../../core/errors/AppError';
import { CreateItemDTO, UpdateItemDTO, ItemResponseDTO } from '../../application/dtos/item';

export class ItemService {
  constructor(private itemRepository: IItemRepository) {}

  async getItemById(id: number): Promise<ItemResponseDTO> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Item', id);
    }
    return ItemResponseDTO.from(item);
  }

  async getItemsByMenuId(menuId: number): Promise<ItemResponseDTO[]> {
    const items = await this.itemRepository.findByMenuId(menuId);
    return items.map(item => ItemResponseDTO.from(item));
  }

  async getAllItems(): Promise<ItemResponseDTO[]> {
    const items = await this.itemRepository.findAll();
    return items.map(item => ItemResponseDTO.from(item));
  }

  async createItem(dto: CreateItemDTO): Promise<ItemResponseDTO> {
    const item = MenuItem.create(dto.menuId, dto.name, dto.price, dto.description);
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
      item.menuId,
      dto.name !== undefined ? dto.name : item.name,
      dto.price !== undefined ? dto.price : item.price,
      dto.description !== undefined ? dto.description : item.description,
      item.createdAt,
      new Date()
    );

    const saved = await this.itemRepository.save(updated);
    return ItemResponseDTO.from(saved);
  }

  async deleteItem(id: number): Promise<void> {
    await this.itemRepository.delete(id);
  }
}
