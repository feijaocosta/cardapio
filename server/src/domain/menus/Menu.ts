import { ValidationError } from '../../core/errors/AppError';

export class Menu {
  constructor(
    readonly id: number | null,
    readonly name: string,
    readonly description: string | null,
    readonly logoFilename: string | null,
    readonly active: boolean,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || !this.name.trim()) {
      throw new ValidationError('Nome do menu é obrigatório');
    }

    if (this.name.trim().length > 255) {
      throw new ValidationError('Nome do menu não pode ter mais de 255 caracteres');
    }
  }

  static create(name: string, description?: string): Menu {
    return new Menu(
      null,
      name,
      description || null,
      null,
      true,
      new Date(),
      new Date()
    );
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): Menu {
    return new Menu(
      this.id,
      this.name,
      this.description,
      this.logoFilename,
      false,
      this.createdAt,
      new Date()
    );
  }

  activate(): Menu {
    return new Menu(
      this.id,
      this.name,
      this.description,
      this.logoFilename,
      true,
      this.createdAt,
      new Date()
    );
  }

  updateLogo(filename: string): Menu {
    return new Menu(
      this.id,
      this.name,
      this.description,
      filename,
      this.active,
      this.createdAt,
      new Date()
    );
  }
}
