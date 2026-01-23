import { ValidationError } from '../../core/errors/AppError';

export class MenuItem {
  constructor(
    readonly id: number | null,
    readonly menuId: number,
    readonly name: string,
    readonly price: number,
    readonly description: string | null,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || !this.name.trim()) {
      throw new ValidationError('Nome do item é obrigatório');
    }

    if (typeof this.price !== 'number' || this.price < 0) {
      throw new ValidationError('Preço deve ser um número positivo');
    }

    if (this.name.length > 255) {
      throw new ValidationError('Nome do item não pode ter mais de 255 caracteres');
    }
  }

  static create(menuId: number, name: string, price: number, description?: string): MenuItem {
    return new MenuItem(
      null,
      menuId,
      name,
      price,
      description || null,
      new Date(),
      new Date()
    );
  }

  getPriceFormatted(): string {
    return this.price.toFixed(2);
  }
}
