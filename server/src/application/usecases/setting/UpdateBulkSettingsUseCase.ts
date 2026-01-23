import { SettingService } from '../../../domain/settings/SettingService';
import { BusinessRuleValidator } from '../../validators/BusinessRuleValidator';
import { SettingResponseDTO } from '../../dtos/setting';

export interface UpdateBulkSettingsInput {
  updates: Array<{
    key: string;
    value: string;
  }>;
}

export class UpdateBulkSettingsUseCase {
  constructor(
    private settingService: SettingService,
    private validator: BusinessRuleValidator
  ) {}

  async execute(input: UpdateBulkSettingsInput): Promise<SettingResponseDTO[]> {
    if (!input.updates || input.updates.length === 0) {
      return [];
    }

    const results: SettingResponseDTO[] = [];

    for (const update of input.updates) {
      try {
        const setting = await this.settingService.getSettingByKey(update.key);
        this.validator.validateSettingType(update.value, setting.type);
        
        const updated = await this.settingService.updateSetting(update.key, update.value);
        results.push(SettingResponseDTO.from(updated));
      } catch (error) {
        // Log do erro mas continua com os próximos
        console.error(`Erro ao atualizar setting ${update.key}:`, error);
      }
    }

    return results;
  }
}
