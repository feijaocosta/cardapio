import { Request, Response } from 'express';
import { SettingService } from '../../../domain/settings/SettingService';
import { UpdateSettingDTO } from '../../../application/dtos/setting';

export class SettingController {
  constructor(private settingService: SettingService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const settings = await this.settingService.getAllSettings();
    res.json(settings);
  }

  async getByKey(req: Request, res: Response): Promise<void> {
    const { key } = req.params;
    const setting = await this.settingService.getSettingByKey(key);
    res.json(setting);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { key } = req.params;
    const dto = new UpdateSettingDTO(req.body);
    const setting = await this.settingService.updateSetting(key, dto);
    res.json(setting);
  }

  async createOrUpdate(req: Request, res: Response): Promise<void> {
    const { key } = req.params;
    const dto = new UpdateSettingDTO(req.body);
    const setting = await this.settingService.createOrUpdateSetting(key, dto);
    res.status(201).json(setting);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { key } = req.params;
    await this.settingService.deleteSetting(key);
    res.status(204).send();
  }
}
