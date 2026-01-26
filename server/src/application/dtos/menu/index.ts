import { ValidationError } from '../../../core/errors/AppError';

export class CreateMenuDTO {
  name: string;
  description?: string;

  constructor(data: any) {
    this.name = data?.name?.trim() || '';
    this.description = data?.description?.trim() || '';

    this.validate();
  }

  private validate(): void {
    if (!this.name) {
      throw new ValidationError('Nome do menu é obrigatório');
    }
  }
}

export class UpdateMenuDTO {
  name?: string;
  description?: string;
  active?: boolean;

  constructor(data: any) {
    this.name = data?.name?.trim() || undefined;
    this.description = data?.description?.trim() || undefined;
    this.active = data?.active !== undefined ? Boolean(data.active) : undefined;
  }
}

export class MenuResponseDTO {
  id: number;
  name: string;
  description: string | null;
  logoFilename: string | null;
  active: boolean;
  itemIds: number[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<MenuResponseDTO>) {
    this.id = data.id!;
    this.name = data.name!;
    this.description = data.description || null;
    this.logoFilename = data.logoFilename || null;
    this.active = data.active ?? true;
    this.itemIds = data.itemIds || [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(entity: any, itemIds: number[] = []): MenuResponseDTO {
    return new MenuResponseDTO({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      logoFilename: entity.logoFilename,
      active: entity.active,
      itemIds: itemIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
