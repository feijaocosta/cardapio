import { ValidationError } from '../../core/errors/AppError';
import { IMenuRepository } from '../../domain/menus/MenuRepository';
import { IItemRepository } from '../../domain/menus/ItemRepository';

export class BusinessRuleValidator {
  constructor(
    private menuRepository: IMenuRepository,
    private itemRepository: IItemRepository
  ) {}

  async validateMenuUniqueName(name: string, excludeId?: number): Promise<void> {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Nome do menu é obrigatório');
    }

    const menus = await this.menuRepository.findAll();
    const exists = menus.some(m => 
      m.name.toLowerCase() === name.trim().toLowerCase() && 
      (!excludeId || m.id !== excludeId)
    );

    if (exists) {
      throw new ValidationError(`Menu com nome "${name}" já existe`);
    }
  }

  validateItemPrice(price: number): void {
    if (price === null || price === undefined) {
      throw new ValidationError('Preço é obrigatório');
    }

    if (price < 0) {
      throw new ValidationError('Preço não pode ser negativo');
    }

    if (price === 0) {
      throw new ValidationError('Preço deve ser maior que zero');
    }
  }

  validateOrderMinItems(items: any[]): void {
    if (!items || items.length === 0) {
      throw new ValidationError('Pedido deve conter pelo menos um item');
    }

    items.forEach((item, index) => {
      if (!item.itemId || item.itemId <= 0) {
        throw new ValidationError(`Item ${index + 1}: ID inválido`);
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new ValidationError(`Item ${index + 1}: Quantidade deve ser maior que zero`);
      }
    });
  }

  validateSettingType(value: string, type: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Valor da configuração é obrigatório');
    }

    if (type === 'number') {
      if (isNaN(Number(value))) {
        throw new ValidationError('Valor deve ser um número');
      }
    }

    if (type === 'boolean') {
      if (!['true', 'false'].includes(value.toLowerCase())) {
        throw new ValidationError('Valor deve ser true ou false');
      }
    }
  }

  async validateItemExists(itemId: number): Promise<void> {
    try {
      await this.itemRepository.findById(itemId);
    } catch {
      throw new ValidationError(`Item com ID ${itemId} não encontrado`);
    }
  }

  async validateMenuExists(menuId: number): Promise<void> {
    try {
      await this.menuRepository.findById(menuId);
    } catch {
      throw new ValidationError(`Menu com ID ${menuId} não encontrado`);
    }
  }

  validateCustomerName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Nome do cliente é obrigatório');
    }

    if (name.length > 255) {
      throw new ValidationError('Nome do cliente muito longo (máximo 255 caracteres)');
    }
  }

  validateOrderStatus(status: string): void {
    const validStatuses = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Status inválido. Valores válidos: ${validStatuses.join(', ')}`);
    }
  }
}
