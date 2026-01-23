import { SettingService } from '../../../domain/settings/SettingService';
import { PaginationDTO } from '../../queries';
import { SettingResponseDTO } from '../../dtos/setting';

export interface GetSettingsByGroupInput {
  group: string;
  page?: number;
  limit?: number;
}

export class GetSettingsByGroupUseCase {
  constructor(private settingService: SettingService) {}

  async execute(input: GetSettingsByGroupInput): Promise<PaginationDTO<SettingResponseDTO>> {
    const page = input.page || 1;
    const limit = input.limit || 10;

    const allSettings = await this.settingService.getAllSettings();
    const filtered = allSettings.filter(s => s.group === input.group);

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginatedSettings = filtered.slice(offset, offset + limit);

    const dtos = paginatedSettings.map(s => SettingResponseDTO.from(s));
    return new PaginationDTO(dtos, page, limit, total);
  }
}
