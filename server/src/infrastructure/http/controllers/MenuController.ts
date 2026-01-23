import { Request, Response } from 'express';
import { MenuService } from '../../../domain/menus/MenuService';
import { CreateMenuDTO, UpdateMenuDTO } from '../../../application/dtos/menu';
import { generateImageFilename, processAndSaveImage, deleteImageFile, UPLOAD_DIR_PATH } from '../../../middleware/upload';
import path from 'path';

export class MenuController {
  constructor(private menuService: MenuService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const menus = await this.menuService.getAllMenus();
    res.json(menus);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const menu = await this.menuService.getMenuById(Number(id));
    res.json(menu);
  }

  async create(req: Request, res: Response): Promise<void> {
    const dto = new CreateMenuDTO(req.body);
    const menu = await this.menuService.createMenu(dto);
    res.status(201).json(menu);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = new UpdateMenuDTO(req.body);
    const menu = await this.menuService.updateMenu(Number(id), dto);
    res.json(menu);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.menuService.deleteMenu(Number(id));
    res.status(204).send();
  }

  async uploadLogo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    if (!req.file) {
      res.status(400).json({ message: 'Arquivo não fornecido' });
      return;
    }

    const filename = generateImageFilename(Number(id));
    await processAndSaveImage(req.file, filename);
    
    const menu = await this.menuService.updateMenuLogo(Number(id), filename);
    res.json(menu);
  }

  async getMenuLogo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const menu = await this.menuService.getMenuById(Number(id));
    
    if (!menu.logoFilename) {
      res.status(404).json({ message: 'Logo não encontrada' });
      return;
    }

    const filepath = path.join(UPLOAD_DIR_PATH, menu.logoFilename);
    res.sendFile(filepath);
  }
}
