import { ValidationError } from '../../../core/errors/AppError';

export class UpdateSettingDTO {
  value: string;
  type?: 'string' | 'number' | 'boolean';

  constructor(data: any) {
    this.value = data?.value?.toString() || '';
    this.type = (data?.type || 'string') as any;

    this.validate();
  }

  private validate(): void {
    if (!this.value) {
      throw new ValidationError('Valor da configuração é obrigatório');
    }
  }
}

export class SettingResponseDTO {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
  parsedValue: any;

  constructor(data: Partial<SettingResponseDTO>) {
    this.key = data.key!;
    this.value = data.value!;
    this.type = data.type || 'string';
    this.parsedValue = this.parseValue();
  }

  private parseValue(): any {
    if (this.type === 'number') return Number(this.value);
    if (this.type === 'boolean') return this.value === 'true';
    return this.value;
  }

  static from(entity: any): SettingResponseDTO {
    return new SettingResponseDTO({
      key: entity.key,
      value: entity.value,
      type: entity.type,
    });
  }
}
