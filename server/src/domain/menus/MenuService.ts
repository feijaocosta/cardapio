import { Menu } from './Menu';
import { IMenuRepository } from './MenuRepository';
import { NotFoundError } from '../../core/errors/AppError';
import { CreateMenuDTO, UpdateMenuDTO, MenuResponseDTO } from '../../application/dtos/menu';

export class MenuService {
  constructor(private menuRepository: IMenuRepository) {}

  async getAllMenus(): Promise<MenuResponseDTO[]> {
    const menus = await this.menuRepository.findAll();
    return menus.map(menu => MenuResponseDTO.from(menu));
  }

  async getMenuById(id: number): Promise<MenuResponseDTO> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu', id);
    }
    return MenuResponseDTO.from(menu);
  }

  async createMenu(dto: CreateMenuDTO): Promise<MenuResponseDTO> {
    const menu = Menu.create(dto.name, dto.description);
    const saved = await this.menuRepository.save(menu);
    return MenuResponseDTO.from(saved);
  }

  async updateMenu(id: number, dto: UpdateMenuDTO): Promise<MenuResponseDTO> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu', id);
    }

    const updated = new Menu(
      menu.id,
      dto.name !== undefined ? dto.name : menu.name,
      dto.description !== undefined ? dto.description : menu.description,
      menu.logoFilename,
      dto.active !== undefined ? dto.active : menu.active,
      menu.createdAt,
      new Date()
    );

    const saved = await this.menuRepository.save(updated);
    return MenuResponseDTO.from(saved);
  }

  async deleteMenu(id: number): Promise<void> {
    await this.menuRepository.delete(id);
  }

  async updateMenuLogo(id: number, logoFilename: string): Promise<MenuResponseDTO> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu', id);
    }

    const updated = menu.updateLogo(logoFilename);
    const saved = await this.menuRepository.save(updated);
    return MenuResponseDTO.from(saved);
  }
}
