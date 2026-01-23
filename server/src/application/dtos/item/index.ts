import { ValidationError } from '../../../core/errors/AppError';

export class CreateItemDTO {
  menuId: number;
  name: string;
  price: number;
  description?: string;

  constructor(data: any) {
    this.menuId = data?.menuId ? Number(data.menuId) : 0;
    this.name = data?.name?.trim() || '';
    this.price = data?.price ? Number(data.price) : 0;
    this.description = data?.description?.trim() || '';

    this.validate();
  }

  private validate(): void {
    if (!this.menuId) {
      throw new ValidationError('ID do menu é obrigatório');
    }
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
  menuId: number;
  name: string;
  price: number;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<ItemResponseDTO>) {
    this.id = data.id!;
    this.menuId = data.menuId!;
    this.name = data.name!;
    this.price = data.price!;
    this.description = data.description || null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(entity: any): ItemResponseDTO {
    return new ItemResponseDTO({
      id: entity.id,
      menuId: entity.menuId,
      name: entity.name,
      price: entity.price,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
