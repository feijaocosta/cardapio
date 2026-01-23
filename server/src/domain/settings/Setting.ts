import { ValidationError } from '../../core/errors/AppError';

export class Setting {
  constructor(
    readonly key: string,
    readonly value: string,
    readonly type: 'string' | 'number' | 'boolean' = 'string'
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.key || !this.key.trim()) {
      throw new ValidationError('Chave da configuração é obrigatória');
    }

    if (!this.value) {
      throw new ValidationError('Valor da configuração é obrigatório');
    }
  }

  static create(key: string, value: string, type: 'string' | 'number' | 'boolean' = 'string'): Setting {
    return new Setting(key, value, type);
  }

  getValue() {
    if (this.type === 'number') return Number(this.value);
    if (this.type === 'boolean') return this.value === 'true';
    return this.value;
  }
}
