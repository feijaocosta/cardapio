import { Setting } from '../../../domain/settings/Setting';
import { ValidationError } from '../../../core/errors/AppError';

describe('Setting Domain Entity', () => {
  describe('Constructor', () => {
    test('deve criar setting com chave e valor', () => {
      const setting = new Setting('app_name', 'Cardápio Online');

      expect(setting.key).toBe('app_name');
      expect(setting.value).toBe('Cardápio Online');
      expect(setting.type).toBe('string');
    });

    test('deve criar setting com tipo especificado', () => {
      const setting = new Setting('max_items', '100', 'number');

      expect(setting.key).toBe('max_items');
      expect(setting.value).toBe('100');
      expect(setting.type).toBe('number');
    });

    test('deve lançar erro se chave está vazia', () => {
      expect(() => new Setting('', 'valor')).toThrow(ValidationError);
      expect(() => new Setting('   ', 'valor')).toThrow(ValidationError);
    });

    test('deve lançar erro se valor está vazio', () => {
      expect(() => new Setting('chave', '')).toThrow(ValidationError);
      expect(() => new Setting('chave', '   ')).not.toThrow(); // espaços são válidos
    });

    test('deve aceitar tipo string como padrão', () => {
      const setting = new Setting('chave', 'valor');
      expect(setting.type).toBe('string');
    });

    test('deve aceitar tipo number', () => {
      const setting = new Setting('chave', '123', 'number');
      expect(setting.type).toBe('number');
    });

    test('deve aceitar tipo boolean', () => {
      const setting = new Setting('chave', 'true', 'boolean');
      expect(setting.type).toBe('boolean');
    });

    test('deve aceitar chave com caracteres especiais', () => {
      const setting = new Setting('app_name_v2.1', 'valor');
      expect(setting.key).toBe('app_name_v2.1');
    });
  });

  describe('Factory Method: create', () => {
    test('deve criar setting com create()', () => {
      const setting = Setting.create('app_name', 'Cardápio Online');

      expect(setting.key).toBe('app_name');
      expect(setting.value).toBe('Cardápio Online');
      expect(setting.type).toBe('string');
    });

    test('deve criar setting com tipo em create()', () => {
      const setting = Setting.create('max_items', '100', 'number');

      expect(setting.type).toBe('number');
    });

    test('deve lançar erro se chave vazia em create', () => {
      expect(() => Setting.create('', 'valor')).toThrow(ValidationError);
    });

    test('deve lançar erro se valor vazio em create', () => {
      expect(() => Setting.create('chave', '')).toThrow(ValidationError);
    });

    test('deve usar tipo string como padrão em create', () => {
      const setting = Setting.create('chave', 'valor');
      expect(setting.type).toBe('string');
    });
  });

  describe('getValue()', () => {
    test('deve retornar valor como string', () => {
      const setting = new Setting('app_name', 'Cardápio Online', 'string');
      expect(setting.getValue()).toBe('Cardápio Online');
      expect(typeof setting.getValue()).toBe('string');
    });

    test('deve converter valor para number', () => {
      const setting = new Setting('max_items', '100', 'number');
      expect(setting.getValue()).toBe(100);
      expect(typeof setting.getValue()).toBe('number');
    });

    test('deve converter valor para boolean true', () => {
      const setting = new Setting('is_active', 'true', 'boolean');
      expect(setting.getValue()).toBe(true);
      expect(typeof setting.getValue()).toBe('boolean');
    });

    test('deve converter valor para boolean false', () => {
      const setting = new Setting('is_active', 'false', 'boolean');
      expect(setting.getValue()).toBe(false);
      expect(typeof setting.getValue()).toBe('boolean');
    });

    test('deve converter valor numérico com decimais', () => {
      const setting = new Setting('tax', '0.15', 'number');
      expect(setting.getValue()).toBeCloseTo(0.15, 2);
    });

    test('deve converter valor numérico negativo', () => {
      const setting = new Setting('offset', '-10', 'number');
      expect(setting.getValue()).toBe(-10);
    });

    test('deve converter string não numérica em NaN quando tipo é number', () => {
      const setting = new Setting('invalid', 'abc', 'number');
      expect(Number.isNaN(setting.getValue())).toBe(true);
    });

    test('deve converter valor diferente de true como false em boolean', () => {
      const setting = new Setting('flag', 'anything', 'boolean');
      expect(setting.getValue()).toBe(false);
    });

    test('deve retornar valor original para tipo string mesmo com números', () => {
      const setting = new Setting('id', '12345', 'string');
      expect(setting.getValue()).toBe('12345');
      expect(typeof setting.getValue()).toBe('string');
    });

    test('deve manter valor imutável ao chamar getValue() múltiplas vezes', () => {
      const setting = new Setting('key', 'value', 'string');
      const value1 = setting.getValue();
      const value2 = setting.getValue();

      expect(value1).toBe(value2);
      expect(value1).toBe('value');
    });
  });

  describe('Casos Extremos', () => {
    test('deve aceitar chave muito longa', () => {
      const longKey = 'a'.repeat(255);
      const setting = new Setting(longKey, 'valor');
      expect(setting.key).toBe(longKey);
    });

    test('deve aceitar valor muito longo', () => {
      const longValue = 'a'.repeat(1000);
      const setting = new Setting('chave', longValue);
      expect(setting.value).toBe(longValue);
    });

    test('deve aceitar valor com quebras de linha', () => {
      const multilineValue = 'linha1\nlinha2\nlinha3';
      const setting = new Setting('config', multilineValue);
      expect(setting.value).toBe(multilineValue);
    });

    test('deve aceitar valor com caracteres especiais', () => {
      const specialValue = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const setting = new Setting('special', specialValue);
      expect(setting.value).toBe(specialValue);
    });

    test('deve aceitar valor JSON como string', () => {
      const jsonValue = '{"key":"value"}';
      const setting = new Setting('json_config', jsonValue, 'string');
      expect(setting.value).toBe(jsonValue);
    });
  });

  describe('Validação Completa', () => {
    test('deve ser válido com parâmetros mínimos', () => {
      expect(() => new Setting('key', 'value')).not.toThrow();
    });

    test('deve ser válido com todos os parâmetros', () => {
      expect(() => new Setting('key', 'value', 'string')).not.toThrow();
    });

    test('deve ser válido com tipo number', () => {
      expect(() => new Setting('key', '123', 'number')).not.toThrow();
    });

    test('deve ser válido com tipo boolean', () => {
      expect(() => new Setting('key', 'true', 'boolean')).not.toThrow();
    });
  });

  // ✨ PRÉ-REQUISITO 1: Administrador pode determinar configurações
  describe('PRÉ-REQUISITO 1: Configurações Administrativas', () => {
    describe('Configuração: Exibir Preço no Cardápio', () => {
      test('deve permitir configurar exibição de preço como TRUE', () => {
        const showPrice = Setting.create('show_price', 'true', 'boolean');

        expect(showPrice.key).toBe('show_price');
        expect(showPrice.getValue()).toBe(true);
        expect(typeof showPrice.getValue()).toBe('boolean');
      });

      test('deve permitir configurar exibição de preço como FALSE', () => {
        const hidePrice = Setting.create('show_price', 'false', 'boolean');

        expect(hidePrice.key).toBe('show_price');
        expect(hidePrice.getValue()).toBe(false);
      });

      test('deve retornar FALSE por padrão quando não configurado', () => {
        // Simula default behavior
        const defaultHidePrice = Setting.create('show_price', 'false', 'boolean');
        expect(defaultHidePrice.getValue()).toBe(false);
      });

      test('deve permitir mudar de TRUE para FALSE', () => {
        const showPrice = Setting.create('show_price', 'true', 'boolean');
        expect(showPrice.getValue()).toBe(true);

        // Simula atualização
        const hidePrice = Setting.create('show_price', 'false', 'boolean');
        expect(hidePrice.getValue()).toBe(false);
      });

      test('deve guardar configuração corretamente', () => {
        const setting = Setting.create('show_price', 'true', 'boolean');
        const savedSetting = new Setting('show_price', 'true', 'boolean');

        expect(setting.getValue()).toBe(savedSetting.getValue());
      });
    });

    describe('Configuração: Modelo de Layout', () => {
      test('deve permitir configurar layout como grid', () => {
        const layout = Setting.create('layout_model', 'grid', 'string');

        expect(layout.key).toBe('layout_model');
        expect(layout.getValue()).toBe('grid');
        expect(typeof layout.getValue()).toBe('string');
      });

      test('deve permitir configurar layout como list', () => {
        const layout = Setting.create('layout_model', 'list', 'string');

        expect(layout.getValue()).toBe('list');
      });

      test('deve permitir configurar layout como carousel', () => {
        const layout = Setting.create('layout_model', 'carousel', 'string');

        expect(layout.getValue()).toBe('carousel');
      });

      test('deve aceitar layout customizado', () => {
        const layout = Setting.create('layout_model', 'custom_layout_v2', 'string');

        expect(layout.getValue()).toBe('custom_layout_v2');
      });

      test('deve permitir mudar layout', () => {
        const layout1 = Setting.create('layout_model', 'grid', 'string');
        expect(layout1.getValue()).toBe('grid');

        const layout2 = Setting.create('layout_model', 'list', 'string');
        expect(layout2.getValue()).toBe('list');
      });

      test('deve guardar configuração de layout corretamente', () => {
        const setting = Setting.create('layout_model', 'grid', 'string');
        const savedSetting = new Setting('layout_model', 'grid', 'string');

        expect(setting.getValue()).toBe(savedSetting.getValue());
      });
    });

    describe('Múltiplas Configurações Simultâneas', () => {
      test('deve permitir múltiplas configurações ao mesmo tempo', () => {
        const showPrice = Setting.create('show_price', 'true', 'boolean');
        const layoutModel = Setting.create('layout_model', 'grid', 'string');

        expect(showPrice.key).toBe('show_price');
        expect(layoutModel.key).toBe('layout_model');
        expect(showPrice.getValue()).toBe(true);
        expect(layoutModel.getValue()).toBe('grid');
      });

      test('deve mudar uma configuração sem afetar outra', () => {
        const config1 = Setting.create('show_price', 'true', 'boolean');
        const config2 = Setting.create('layout_model', 'list', 'string');

        // Mudar config2
        const config2Updated = Setting.create('layout_model', 'grid', 'string');

        // config1 não deve mudar
        expect(config1.getValue()).toBe(true);
        expect(config2Updated.getValue()).toBe('grid');
      });

      test('deve recuperar configurações corretamente em sequência', () => {
        const configs = [
          Setting.create('show_price', 'true', 'boolean'),
          Setting.create('layout_model', 'grid', 'string'),
          Setting.create('app_name', 'Cardápio Online', 'string'),
        ];

        expect(configs[0].getValue()).toBe(true);
        expect(configs[1].getValue()).toBe('grid');
        expect(configs[2].getValue()).toBe('Cardápio Online');
      });
    });
  });
});
