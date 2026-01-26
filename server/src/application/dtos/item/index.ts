import { ValidationError } from '../../../core/errors/AppError';

export class CreateItemDTO {
  name: string;
  price: number;
  description?: string;

  constructor(data: any) {
    this.name = data?.name?.trim() || '';
    this.price = data?.price ? Number(data.price) : 0;
    this.description = data?.description?.trim() || '';

    this.validate();
  }

  private validate(): void {
    if (!this.name) {
      throw new ValidationError('Nome do item é obrigatório');
    }
    if (this.price < 0) {
      throw new ValidationError('Preço não pode ser negativo');
    }
  }
}

export class UpdateItemDTO {
  name?: string;
  price?: number;
  description?: string;

  constructor(data: any) {
    this.name = data?.name?.trim() || undefined;
    this.price = data?.price !== undefined ? Number(data.price) : undefined;
    this.description = data?.description?.trim() || undefined;
  }
}

export class ItemResponseDTO {
  id: number;
  name: string;
  price: number;
  description: string | null;
  menuIds: number[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<ItemResponseDTO>) {
    this.id = data.id!;
    this.name = data.name!;
    this.price = data.price!;
    this.description = data.description || null;
    this.menuIds = data.menuIds || [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(entity: any, menuIds: number[] = []): ItemResponseDTO {
    return new ItemResponseDTO({
      id: entity.id,
      name: entity.name,
      price: entity.price,
      description: entity.description,
      menuIds: menuIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

export class AddItemToMenuDTO {
  menuId: number;
  itemId: number;

  constructor(data: any) {
    this.menuId = data?.menuId ? Number(data.menuId) : 0;
    this.itemId = data?.itemId ? Number(data.itemId) : 0;

    this.validate();
  }

  private validate(): void {
    if (!this.menuId) {
      throw new ValidationError('ID do menu é obrigatório');
    }
    if (!this.itemId) {
      throw new ValidationError('ID do item é obrigatório');
    }
  }
}
