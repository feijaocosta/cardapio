import { MenuService } from '../domain/menus/MenuService';
import { ItemService } from '../domain/menus/ItemService';
import { OrderService } from '../domain/orders/OrderService';
import { SettingService } from '../domain/settings/SettingService';
import { MenuRepository } from '../infrastructure/database/repositories/MenuRepository';
import { ItemRepository } from '../infrastructure/database/repositories/ItemRepository';
import { OrderRepository } from '../infrastructure/database/repositories/OrderRepository';
import { SettingRepository } from '../infrastructure/database/repositories/SettingRepository';
import { MenuController } from '../infrastructure/http/controllers/MenuController';
import { ItemController } from '../infrastructure/http/controllers/ItemController';
import { OrderController } from '../infrastructure/http/controllers/OrderController';
import { SettingController } from '../infrastructure/http/controllers/SettingController';

export class Container {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  register(key: string, factory: () => any): void {
    if (this.services.has(key)) {
      throw new Error(`Serviço ${key} já registrado`);
    }
    this.services.set(key, factory);
  }

  registerSingleton(key: string, factory: () => any): void {
    if (this.singletons.has(key)) {
      throw new Error(`Singleton ${key} já registrado`);
    }
    this.register(key, () => {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, factory());
      }
      return this.singletons.get(key);
    });
  }

  get<T = any>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Serviço ${key} não encontrado`);
    }
    return factory();
  }

  has(key: string): boolean {
    return this.services.has(key);
  }

  registerControllers(): void {
    // ...existing code...
    
    this.registerSingleton('MenuController', () => {
      const menuService = this.get<MenuService>('MenuService');
      const itemService = this.get<ItemService>('ItemService');
      return new MenuController(menuService, itemService);
    });

    // ...existing code...
  }
}