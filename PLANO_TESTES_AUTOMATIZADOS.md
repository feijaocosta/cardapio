# 🧪 Plano de Testes Automatizados vs Manuais

**Data**: 23 de janeiro de 2026  
**Versão**: 1.0  
**Decidido por**: Análise de eficiência

---

## 📊 Comparação: Testes Manuais vs Automatizados

| Aspecto | Testes Manuais | Testes Automatizados |
|---------|----------------|--------------------|
| **Tempo Inicial** | 5 min (setup) | 30 min (setup + infra) |
| **Tempo por Execução** | 40-50 min | 2-5 segundos |
| **Execuções Futuras** | 40-50 min cada | Automático (CI/CD) |
| **Manutenção** | N/A | Baixa (código é a doc) |
| **Confiabilidade** | Erro humano | 100% consistente |
| **Documentação** | Manual externa | Auto-documentado |
| **Regressão** | Não detecta | Detecta automaticamente |
| **Custo Total (6 meses)** | ~800 min (13h) | ~35 min + tempo de CI/CD |

**Conclusão**: Testes automatizados são MUITO superiores em longo prazo! ✅

---

## 🎯 Novo Plano: Testes com Jest + Supertest

### Estrutura de Testes

```
server/src/
├── __tests__/
│   ├── setup.ts                          # Configuração global
│   ├── domain/                           # Testes de entidades
│   │   ├── menus/
│   │   │   ├── Menu.test.ts             # ~50 casos de teste
│   │   │   ├── MenuItem.test.ts         # ~30 casos de teste
│   │   │   └── MenuService.test.ts      # ~40 casos de teste
│   │   ├── orders/
│   │   │   ├── Order.test.ts            # ~40 casos de teste
│   │   │   ├── OrderItem.test.ts        # ~20 casos de teste
│   │   │   └── OrderService.test.ts     # ~35 casos de teste
│   │   ├── settings/
│   │   │   ├── Setting.test.ts          # ~20 casos de teste
│   │   │   └── SettingService.test.ts   # ~25 casos de teste
│   │
│   └── integration/
│       ├── api.integration.test.ts      # ~60 casos E2E
│
├── jest.config.js                        # Configuração Jest
├── package.json                          # Scripts de teste
```

### Total de Testes
- **Testes Unitários**: ~295 testes
- **Testes de Integração**: ~60 testes
- **TOTAL**: ~355 testes automatizados ✅

---

## 📋 Roadmap de Implementação (4 horas)

### Fase 1: Setup (30 min)
```bash
✅ Instalar Jest, ts-jest, supertest
✅ Criar jest.config.js
✅ Atualizar package.json com scripts
✅ Criar src/__tests__/setup.ts
```

**Resultado**: Infraestrutura pronta para testes

---

### Fase 2: Testes de Entidades (60 min)
```bash
✅ Menu.test.ts          (15 min)
✅ MenuItem.test.ts      (10 min)
✅ Order.test.ts         (15 min)
✅ OrderItem.test.ts     (8 min)
✅ Setting.test.ts       (8 min)
✅ npm test              (4 min para verificar)
```

**Resultado**: ~155 testes de entidade passando

---

### Fase 3: Testes de Services (90 min)
```bash
✅ MenuService.test.ts       (25 min)
✅ OrderService.test.ts      (25 min)
✅ ItemService.test.ts       (20 min)
✅ SettingService.test.ts    (15 min)
✅ npm test                  (5 min para verificar)
```

**Resultado**: ~295 testes unitários passando ✅

---

### Fase 4: Testes de Integração (60 min)
```bash
✅ api.integration.test.ts   (45 min)
✅ npm run test:integration  (5 min para verificar)
✅ Coverage report           (10 min)
```

**Resultado**: ~355 testes TOTAL passando ✅

---

### Fase 5: CI/CD (30 min - Opcional)
```bash
✅ Criar .github/workflows/test.yml
✅ Configurar para rodar em push
✅ Setup codecov
```

---

## 🔍 O que Será Testado

### ✅ Testes de Entidades (Domain Logic)
```typescript
describe('Menu Entity', () => {
  // Validações
  ✅ Criar menu válido
  ✅ Rejeitar nome vazio
  ✅ Rejeitar nome > 255 caracteres
  ✅ Aceitar nome com até 255 caracteres
  
  // Factory methods
  ✅ Criar menu com factory
  ✅ Valores padrão corretos
  
  // Métodos
  ✅ Ativar/desativar menu
  ✅ Atualizar logo
  ✅ Timestamps atualizados
})
```

### ✅ Testes de Services (Business Logic)
```typescript
describe('MenuService', () => {
  // CRUD básico
  ✅ Listar todos os menus
  ✅ Buscar menu por ID
  ✅ Criar menu novo
  ✅ Atualizar menu existente
  ✅ Deletar menu
  
  // Tratamento de erro
  ✅ Lançar NotFoundError em operações inválidas
  ✅ Validações de DTO
  
  // Edge cases
  ✅ Atualizar apenas campos fornecidos
  ✅ Atualizar logo
})
```

### ✅ Testes de Integração (E2E)
```typescript
describe('API Integration Tests', () => {
  // Health check
  ✅ GET /health retorna OK
  
  // Endpoints de Menus
  ✅ GET /api/menus (vazio)
  ✅ POST /api/menus (criar)
  ✅ GET /api/menus/:id (buscar)
  ✅ PUT /api/menus/:id (atualizar)
  ✅ DELETE /api/menus/:id (deletar)
  
  // Validações HTTP
  ✅ 400 para dados inválidos
  ✅ 404 para recursos não encontrados
  ✅ 201 para criação bem-sucedida
  
  // Endpoints de Orders
  ✅ POST /api/orders (criar pedido)
  ✅ Cálculo de total correto
  ✅ Validação de items
  
  // Endpoints de Settings
  ✅ GET /api/settings (listar)
})
```

---

## 🚀 Scripts de Teste

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch (desenvolvimento)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage

# Apenas testes de integração
npm run test:integration

# Teste específico
npm test -- Menu.test.ts

# Teste com output detalhado
npm test -- --verbose
```

---

## 📈 Métricas de Cobertura Esperada

| Métrica | Target | Esperado |
|---------|--------|----------|
| **Lines** | 80% | 92% |
| **Statements** | 80% | 91% |
| **Branches** | 75% | 87% |
| **Functions** | 80% | 93% |

**Resultado**: Coverage excelente, código confiável ✅

---

## 🔄 Fluxo de Desenvolvimento Futuro

### Ao criar nova feature:

1. **Escrever teste PRIMEIRO** (TDD)
   ```bash
   npm run test:watch
   # Teste falha (RED)
   ```

2. **Implementar feature**
   ```bash
   # Código implementado
   # Teste passa (GREEN)
   ```

3. **Refatorar se necessário** (REFACTOR)
   ```bash
   # Manter testes passando
   # Código mais limpo
   ```

4. **Commitar com confiança**
   ```bash
   git commit -m "feat: adicionar nova feature com testes"
   ```

---

## 💡 Benefícios da Abordagem

### Imediatos ✅
- ✅ Confiança no código
- ✅ Documentação viva (testes = especificação)
- ✅ Refatorações seguras
- ✅ Detecção automática de regressões

### Long-term 📈
- ✅ Reduz bugs em produção
- ✅ Facilita onboarding de novos devs
- ✅ Menos horas em debugging
- ✅ Melhor qualidade de código
- ✅ CI/CD confiável

---

## 📋 Checklist de Implementação

### Pré-requisitos
- [ ] Tomar decisão: executar testes automatizados (VOCÊ DECIDIU ✅)
- [ ] Ter PLANO_EXECUCAO.md atualizado com nova Tarefa 4.2

### Setup
- [ ] Instalar dependências (`npm install --save-dev jest ...`)
- [ ] Criar `jest.config.js`
- [ ] Atualizar `package.json` com scripts
- [ ] Criar `src/__tests__/setup.ts`
- [ ] Verificar: `npm test` executa sem erros

### Testes
- [ ] Criar todos os `.test.ts` files
- [ ] Fase 2: Testes de entidades (155 testes)
- [ ] Fase 3: Testes de services (140 testes)
- [ ] Fase 4: Testes de integração (60 testes)
- [ ] Verificar cobertura: `npm run test:coverage`

### CI/CD (Opcional)
- [ ] Criar `.github/workflows/test.yml`
- [ ] Testar workflow em push

---

## 🎯 Sucesso = Quando

```bash
✅ npm test → All 355 tests passed ✓
✅ npm run test:coverage → Coverage > 85%
✅ npm run test:watch → Testes passam continuamente
✅ GitHub Actions → Testes rodam automaticamente
```

---

## 📚 Estrutura de um Teste Típico

```typescript
// Arrange: Preparar dados
const menu = Menu.create('Menu Principal', 'Descrição');

// Act: Executar ação
const service = new MenuService(mockRepository);
const result = await service.createMenu(dto);

// Assert: Verificar resultado
expect(result.id).toBeDefined();
expect(result.name).toBe('Menu Principal');
```

---

## 🔗 Próximo Passo

**Ação**: Executar este novo plano na ordem especificada

**Tempo Total**: ~4 horas (vs 1.5 horas testes manuais, mas com ROI infinito)

**Começar por**: Fase 1 - Setup (30 min)

---

**Documento**: `PLANO_TESTES_AUTOMATIZADOS.md`  
**Status**: Aprovado para execução  
**Alternativa a**: Testes manuais (descartado)
