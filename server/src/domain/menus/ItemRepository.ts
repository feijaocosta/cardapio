import { MenuItem } from './MenuItem';
import { MenuItemAssociation } from './MenuItemAssociation';

export interface IItemRepository {
  save(item: MenuItem): Promise<MenuItem>;
  findById(id: number): Promise<MenuItem | null>;
  findAll(): Promise<MenuItem[]>;
  delete(id: number): Promise<void>;
  
  // Métodos para relacionamento N:N
  addItemToMenu(menuId: number, itemId: number): Promise<void>;
  removeItemFromMenu(menuId: number, itemId: number): Promise<void>;
  getItemsByMenuId(menuId: number): Promise<MenuItem[]>;
  getMenusByItemId(itemId: number): Promise<number[]>;
}
