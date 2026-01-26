import { ValidationError } from '../../core/errors/AppError';

export class MenuItem {
  constructor(
    public id: number,
    public name: string,
    public price?: number,
    public description?: string
  ) {}

  static create(id: number, name: string, price?: number, description?: string): MenuItem {
    return new MenuItem(id, name, price, description);
  }
}
