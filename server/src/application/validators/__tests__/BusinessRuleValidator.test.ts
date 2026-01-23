import { BusinessRuleValidator } from '../BusinessRuleValidator';
import { ValidationError } from '../../../core/errors/AppError';

// Mock das dependências
const mockMenuRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

const mockItemRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByMenuId: jest.fn(),
};

describe('BusinessRuleValidator', () => {
  let validator: BusinessRuleValidator;

  beforeEach(() => {
    validator = new BusinessRuleValidator(mockMenuRepository as any, mockItemRepository as any);
    jest.clearAllMocks();
  });

  describe('validateMenuUniqueName', () => {
    test('deve lançar erro se nome está vazio', async () => {
      await expect(validator.validateMenuUniqueName('')).rejects.toThrow(ValidationError);
      await expect(validator.validateMenuUniqueName('   ')).rejects.toThrow(ValidationError);
    });

    test('deve lançar erro se nome já existe', async () => {
      mockMenuRepository.findAll.mockResolvedValue([
        { id: 1, name: 'Pizza' }
      ]);

      await expect(validator.validateMenuUniqueName('Pizza')).rejects.toThrow('Menu com nome "Pizza" já existe');
    });

    test('deve permitir nome único', async () => {
      mockMenuRepository.findAll.mockResolvedValue([
        { id: 1, name: 'Pizza' }
      ]);

      await expect(validator.validateMenuUniqueName('Hamburguer')).resolves.not.toThrow();
    });

    test('deve permitir mesmo nome ao atualizar (excludeId)', async () => {
      mockMenuRepository.findAll.mockResolvedValue([
        { id: 1, name: 'Pizza' }
      ]);

      await expect(validator.validateMenuUniqueName('Pizza', 1)).resolves.not.toThrow();
    });

    test('deve considerar case-insensitive', async () => {
      mockMenuRepository.findAll.mockResolvedValue([
        { id: 1, name: 'Pizza' }
      ]);

      await expect(validator.validateMenuUniqueName('PIZZA')).rejects.toThrow();
    });
  });

  describe('validateItemPrice', () => {
    test('deve lançar erro se preço é undefined', () => {
      expect(() => validator.validateItemPrice(undefined as any)).toThrow('Preço é obrigatório');
    });

    test('deve lançar erro se preço é negativo', () => {
      expect(() => validator.validateItemPrice(-5)).toThrow('Preço não pode ser negativo');
    });

    test('deve lançar erro se preço é zero', () => {
      expect(() => validator.validateItemPrice(0)).toThrow('Preço deve ser maior que zero');
    });

    test('deve permitir preço válido', () => {
      expect(() => validator.validateItemPrice(9.99)).not.toThrow();
      expect(() => validator.validateItemPrice(100)).not.toThrow();
    });
  });

  describe('validateOrderMinItems', () => {
    test('deve lançar erro se items está vazio', () => {
      expect(() => validator.validateOrderMinItems([])).toThrow('Pedido deve conter pelo menos um item');
    });

    test('deve lançar erro se item não tem itemId', () => {
      const items = [{ quantity: 2 }];
      expect(() => validator.validateOrderMinItems(items)).toThrow('Item 1: ID inválido');
    });

    test('deve lançar erro se item não tem quantity', () => {
      const items = [{ itemId: 1 }];
      expect(() => validator.validateOrderMinItems(items)).toThrow('Item 1: Quantidade deve ser maior que zero');
    });

    test('deve lançar erro se quantity é zero', () => {
      const items = [{ itemId: 1, quantity: 0 }];
      expect(() => validator.validateOrderMinItems(items)).toThrow('Item 1: Quantidade deve ser maior que zero');
    });

    test('deve permitir items válidos', () => {
      const items = [
        { itemId: 1, quantity: 2 },
        { itemId: 2, quantity: 1 }
      ];
      expect(() => validator.validateOrderMinItems(items)).not.toThrow();
    });
  });

  describe('validateOrderStatus', () => {
    test('deve lançar erro se status inválido', () => {
      expect(() => validator.validateOrderStatus('Inválido')).toThrow('Status inválido');
    });

    test('deve permitir status válidos', () => {
      const validStatuses = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];
      validStatuses.forEach(status => {
        expect(() => validator.validateOrderStatus(status)).not.toThrow();
      });
    });
  });

  describe('validateCustomerName', () => {
    test('deve lançar erro se nome está vazio', () => {
      expect(() => validator.validateCustomerName('')).toThrow('Nome do cliente é obrigatório');
    });

    test('deve lançar erro se nome muito longo', () => {
      const longName = 'a'.repeat(256);
      expect(() => validator.validateCustomerName(longName)).toThrow('Nome do cliente muito longo');
    });

    test('deve permitir nome válido', () => {
      expect(() => validator.validateCustomerName('João Silva')).not.toThrow();
      expect(() => validator.validateCustomerName('a'.repeat(255))).not.toThrow();
    });
  });

  describe('validateItemExists', () => {
    test('deve lançar erro se item não existe', async () => {
      mockItemRepository.findById.mockRejectedValue(new Error('Not found'));

      await expect(validator.validateItemExists(999)).rejects.toThrow('Item com ID 999 não encontrado');
    });

    test('deve permitir item existente', async () => {
      mockItemRepository.findById.mockResolvedValue({ id: 1, name: 'Pizza' });

      await expect(validator.validateItemExists(1)).resolves.not.toThrow();
    });
  });

  describe('validateMenuExists', () => {
    test('deve lançar erro se menu não existe', async () => {
      mockMenuRepository.findById.mockRejectedValue(new Error('Not found'));

      await expect(validator.validateMenuExists(999)).rejects.toThrow('Menu com ID 999 não encontrado');
    });

    test('deve permitir menu existente', async () => {
      mockMenuRepository.findById.mockResolvedValue({ id: 1, name: 'Menu' });

      await expect(validator.validateMenuExists(1)).resolves.not.toThrow();
    });
  });

  describe('validateSettingType', () => {
    test('deve lançar erro se valor vazio', () => {
      expect(() => validator.validateSettingType('', 'string')).toThrow('Valor da configuração é obrigatório');
    });

    test('deve validar tipo number', () => {
      expect(() => validator.validateSettingType('abc', 'number')).toThrow('Valor deve ser um número');
      expect(() => validator.validateSettingType('123', 'number')).not.toThrow();
    });

    test('deve validar tipo boolean', () => {
      expect(() => validator.validateSettingType('yes', 'boolean')).toThrow('Valor deve ser true ou false');
      expect(() => validator.validateSettingType('true', 'boolean')).not.toThrow();
      expect(() => validator.validateSettingType('false', 'boolean')).not.toThrow();
    });
  });
});
