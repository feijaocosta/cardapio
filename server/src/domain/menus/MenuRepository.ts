import { Menu } from './Menu';

export interface IMenuRepository {
  save(menu: Menu): Promise<Menu>;
  findById(id: number): Promise<Menu | null>;
  findAll(): Promise<Menu[]>;
  delete(id: number): Promise<void>;
}
