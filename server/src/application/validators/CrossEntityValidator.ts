import { ValidationError } from '../../core/errors/AppError';
import { IMenuRepository } from '../../domain/menus/MenuRepository';
import { IItemRepository } from '../../domain/menus/ItemRepository';
import { IOrderRepository } from '../../domain/orders/OrderRepository';

export class CrossEntityValidator {
  constructor(
    private menuRepository: IMenuRepository,
    private itemRepository: IItemRepository,
    private orderRepository: IOrderRepository
  ) {}

  async validateMenuItemRelation(menuId: number, itemId: number): Promise<void> {
    try {
      const item = await this.itemRepository.findById(itemId);
      if (item.menuId !== menuId) {
        throw new ValidationError(`Item ${itemId} não pertence ao menu ${menuId}`);
      }
    } catch (error: any) {
      if (error instanceof ValidationError) throw error;
      throw new ValidationError(`Relação entre menu e item inválida`);
    }
  }

  async validateOrderItemsExist(items: any[]): Promise<void> {
    for (const item of items) {
      try {
        await this.itemRepository.findById(item.itemId);
      } catch {
        throw new ValidationError(`Item com ID ${item.itemId} não encontrado no banco de dados`);
      }
    }
  }

  async validateOrderExists(orderId: number): Promise<void> {
    try {
      await this.orderRepository.findById(orderId);
    } catch {
      throw new ValidationError(`Pedido com ID ${orderId} não encontrado`);
    }
  }

  async validateMenuHasItems(menuId: number): Promise<void> {
    try {
      const items = await this.itemRepository.findByMenuId(menuId);
      if (items.length === 0) {
        throw new ValidationError(`Menu ${menuId} não possui itens. Adicione itens antes de usar este menu`);
      }
    } catch (error: any) {
      if (error instanceof ValidationError) throw error;
      throw new ValidationError(`Erro ao validar itens do menu`);
    }
  }

  async validateMenuCanBeDeleted(menuId: number): Promise<void> {
    // Verificar se há orders relacionadas
    try {
      const orders = await this.orderRepository.findAll();
      const relatedOrders = orders.filter(order => 
        order.items.some(item => 
          item.menuId === menuId
        )
      );

      if (relatedOrders.length > 0) {
        throw new ValidationError(
          `Não é possível deletar menu com ${relatedOrders.length} pedido(s) associado(s)`
        );
      }
    } catch (error: any) {
      if (error instanceof ValidationError) throw error;
      throw new ValidationError(`Erro ao validar deleção de menu`);
    }
  }

  async validateNoCircularReferences(): Promise<void> {
    // Implementação futura para evitar referências circulares
    // Por enquanto, apenas placeholder
  }
}
