import { Setting } from './Setting';
import { ISettingRepository } from './SettingRepository';
import { NotFoundError } from '../../core/errors/AppError';
import { UpdateSettingDTO, SettingResponseDTO } from '../../application/dtos/setting';

export class SettingService {
  constructor(private settingRepository: ISettingRepository) {}

  async getAllSettings(): Promise<SettingResponseDTO[]> {
    const settings = await this.settingRepository.findAll();
    return settings.map(setting => SettingResponseDTO.from(setting));
  }

  async getSettingByKey(key: string): Promise<SettingResponseDTO> {
    const setting = await this.settingRepository.findByKey(key);
    if (!setting) {
      throw new NotFoundError('Configuração', key);
    }
    return SettingResponseDTO.from(setting);
  }

  async updateSetting(key: string, dto: UpdateSettingDTO): Promise<SettingResponseDTO> {
    const existing = await this.settingRepository.findByKey(key);
    if (!existing) {
      throw new NotFoundError('Configuração', key);
    }

    const setting = new Setting(key, dto.value, dto.type);
    const saved = await this.settingRepository.save(setting);
    return SettingResponseDTO.from(saved);
  }

  async createOrUpdateSetting(key: string, dto: UpdateSettingDTO): Promise<SettingResponseDTO> {
    const setting = new Setting(key, dto.value, dto.type);
    const saved = await this.settingRepository.save(setting);
    return SettingResponseDTO.from(saved);
  }

  async deleteSetting(key: string): Promise<void> {
    await this.settingRepository.delete(key);
  }
}
