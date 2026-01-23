import { MenuItem } from './MenuItem';

export interface IItemRepository {
  save(item: MenuItem): Promise<MenuItem>;
  findById(id: number): Promise<MenuItem | null>;
  findByMenuId(menuId: number): Promise<MenuItem[]>;
  findAll(): Promise<MenuItem[]>;
  delete(id: number): Promise<void>;
}
