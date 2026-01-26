import { Database } from 'sqlite';
import { Container } from './Container';
import { MenuRepository } from '../infrastructure/database/repositories/MenuRepository';
import { ItemRepository } from '../infrastructure/database/repositories/ItemRepository';
import { OrderRepository } from '../infrastructure/database/repositories/OrderRepository';
import { SettingRepository } from '../infrastructure/database/repositories/SettingRepository';
import { MenuService } from '../domain/menus/MenuService';
import { ItemService } from '../domain/menus/ItemService';
import { OrderService } from '../domain/orders/OrderService';
import { SettingService } from '../domain/settings/SettingService';
import { MenuController } from '../infrastructure/http/controllers/MenuController';
import { ItemController } from '../infrastructure/http/controllers/ItemController';
import { OrderController } from '../infrastructure/http/controllers/OrderController';
import { SettingController } from '../infrastructure/http/controllers/SettingController';
import { uploadMiddleware } from '../infrastructure/http/middlewares/uploadMiddleware';

export function setupContainer(db: Database): Container {
  const container = new Container();

  // Repositories
  container.registerSingleton('MenuRepository', () => new MenuRepository(db));
  container.registerSingleton('ItemRepository', () => new ItemRepository(db));
  container.registerSingleton('OrderRepository', () => new OrderRepository(db));
  container.registerSingleton('SettingRepository', () => new SettingRepository(db));

  // Services
  container.registerSingleton('MenuService', () => 
    new MenuService(container.get('MenuRepository') as MenuRepository)
  );
  container.registerSingleton('ItemService', () => 
    new ItemService(container.get('ItemRepository') as ItemRepository)
  );
  container.registerSingleton('OrderService', () => 
    new OrderService(container.get('OrderRepository') as OrderRepository)
  );
  container.registerSingleton('SettingService', () => 
    new SettingService(container.get('SettingRepository') as SettingRepository)
  );

  // Controllers
  container.registerSingleton('MenuController', () => 
    new MenuController(
      container.get('MenuService') as MenuService,
      container.get('ItemService') as ItemService
    )
  );
  container.registerSingleton('ItemController', () => 
    new ItemController(container.get('ItemService') as ItemService)
  );
  container.registerSingleton('OrderController', () => 
    new OrderController(container.get('OrderService') as OrderService)
  );
  container.registerSingleton('SettingController', () => 
    new SettingController(container.get('SettingService') as SettingService)
  );

  // Middlewares
  container.registerSingleton('uploadMiddleware', () => uploadMiddleware);

  return container;
}
