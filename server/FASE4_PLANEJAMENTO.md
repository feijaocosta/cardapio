# FASE 4: Application Layer - PLANEJAMENTO DETALHADO

## 🎯 Objetivo Principal

Implementar a **Application Layer** com Use Cases avançados, Pagination, Filtering, Search e Validações de Negócio complexas.

---

## 📋 Escopo da FASE 4

### 4.1 Use Cases Avançados
```
✅ MenuUseCases
   ├─ GetAllMenusUseCase (com paginação)
   ├─ SearchMenusUseCase (busca por nome)
   ├─ GetMenuStatisticsUseCase (dados agregados)
   └─ GetActiveMenusUseCase (filtro por status)

✅ ItemUseCases
   ├─ ListItemsByMenuUseCase (com paginação)
   ├─ SearchItemsUseCase (busca por nome/descrição)
   ├─ GetItemsByPriceRangeUseCase (filtro por preço)
   └─ GetItemStatisticsUseCase (média, mín, máx)

✅ OrderUseCases
   ├─ ListOrdersByStatusUseCase (filtro por status)
   ├─ SearchOrdersByCustomerUseCase (busca por cliente)
   ├─ GetOrderStatisticsUseCase (total vendas, etc)
   └─ GetOrdersByDateRangeUseCase (período)

✅ SettingUseCases
   ├─ GetSettingsByGroupUseCase (agrupamento)
   └─ UpdateBulkSettingsUseCase (atualização em massa)
```

### 4.2 Query & Filter System
```
✅ PaginationDTO
   ├─ page (número da página)
   ├─ limit (itens por página)
   ├─ total (total de registros)
   └─ pages (total de páginas)

✅ FilterBuilder
   ├─ addFilter(field, operator, value)
   ├─ addSort(field, direction)
   ├─ build() → SQL WHERE + ORDER BY
   └─ toDTO() → PaginationDTO

✅ SearchService
   ├─ searchMenus(term) → List<Menu>
   ├─ searchItems(term) → List<MenuItem>
   ├─ searchOrders(term) → List<Order>
   └─ buildSearchQuery() → SQL LIKE
```

### 4.3 Advanced Validations
```
✅ BusinessRuleValidator
   ├─ validateMenuUniqueName(name)
   ├─ validateItemPrice(price)
   ├─ validateOrderMinItems(items)
   └─ validateSettingType(value, type)

✅ CrossEntityValidator
   ├─ validateMenuItemRelation(menuId, itemId)
   ├─ validateOrderItemExists(itemId)
   └─ validateNoCircularReferences()
```

### 4.4 Aggregation & Statistics
```
✅ MenuStatistics
   ├─ total items
   ├─ average price
   ├─ min/max price
   └─ active items count

✅ OrderStatistics
   ├─ total orders
   ├─ revenue
   ├─ average order value
   ├─ orders by status (breakdown)
   └─ top customers

✅ SystemStatistics
   ├─ total menus
   ├─ total items
   ├─ total orders
   └─ growth metrics
```

### 4.5 Caching Layer (Opcional)
```
✅ CacheService
   ├─ set(key, value, ttl)
   ├─ get(key)
   ├─ invalidate(pattern)
   └─ clear()

✅ Estratégias
   ├─ Menu list cache (5 min)
   ├─ Item list cache (5 min)
   ├─ Statistics cache (10 min)
   └─ Search results cache (2 min)
```

### 4.6 Event System (Opcional)
```
✅ EventEmitter
   ├─ on(event, handler)
   ├─ emit(event, data)
   └─ off(event, handler)

✅ Eventos
   ├─ MenuCreated
   ├─ ItemUpdated
   ├─ OrderStatusChanged
   └─ SettingUpdated
```

---

## 📁 Estrutura de Arquivos

```
application/
├── usecases/
│   ├── menu/
│   │   ├── GetAllMenusUseCase.ts
│   │   ├── SearchMenusUseCase.ts
│   │   ├── GetMenuStatisticsUseCase.ts
│   │   └── GetActiveMenusUseCase.ts
│   ├── item/
│   │   ├── ListItemsByMenuUseCase.ts
│   │   ├── SearchItemsUseCase.ts
│   │   ├── GetItemsByPriceRangeUseCase.ts
│   │   └── GetItemStatisticsUseCase.ts
│   ├── order/
│   │   ├── ListOrdersByStatusUseCase.ts
│   │   ├── SearchOrdersByCustomerUseCase.ts
│   │   ├── GetOrderStatisticsUseCase.ts
│   │   └── GetOrdersByDateRangeUseCase.ts
│   └── setting/
│       ├── GetSettingsByGroupUseCase.ts
│       └── UpdateBulkSettingsUseCase.ts
├── queries/
│   ├── FilterBuilder.ts
│   ├── PaginationDTO.ts
│   ├── SearchService.ts
│   ├── QueryParser.ts
│   └── SortBuilder.ts
├── validators/
│   ├── BusinessRuleValidator.ts
│   ├── CrossEntityValidator.ts
│   └── ValidatorRegistry.ts
├── aggregations/
│   ├── MenuStatistics.ts
│   ├── OrderStatistics.ts
│   ├── SystemStatistics.ts
│   └── AggregationService.ts
└── cache/ (opcional)
    ├── CacheService.ts
    ├── MemoryCache.ts
    └── CacheStrategies.ts
```

---

## 🎯 Tarefas Detalhadas

### 4.1.1 Use Cases de Menu
```
- [ ] GetAllMenusUseCase
      ├─ Recebe: PaginationDTO + FilterDTO
      ├─ Retorna: List<MenuResponseDTO> com paginação
      └─ Integra com: MenuRepository + FilterBuilder

- [ ] SearchMenusUseCase
      ├─ Recebe: searchTerm, page, limit
      ├─ Retorna: List<MenuResponseDTO> filtrado
      └─ Integra com: SearchService

- [ ] GetMenuStatisticsUseCase
      ├─ Recebe: menuId (opcional)
      ├─ Retorna: MenuStatistics
      └─ Integra com: AggregationService

- [ ] GetActiveMenusUseCase
      ├─ Recebe: page, limit
      ├─ Retorna: List<Menu> apenas ativos
      └─ Integra com: FilterBuilder (active = true)
```

### 4.1.2 Use Cases de Item
```
- [ ] ListItemsByMenuUseCase
      ├─ Recebe: menuId, page, limit, sort
      ├─ Retorna: List<ItemResponseDTO>
      └─ Integra com: ItemRepository.findByMenuId()

- [ ] SearchItemsUseCase
      ├─ Recebe: term, menuId, page, limit
      ├─ Retorna: List<ItemResponseDTO>
      └─ Integra com: SearchService

- [ ] GetItemsByPriceRangeUseCase
      ├─ Recebe: minPrice, maxPrice, page, limit
      ├─ Retorna: List<ItemResponseDTO>
      └─ Integra com: FilterBuilder (price BETWEEN)

- [ ] GetItemStatisticsUseCase
      ├─ Recebe: menuId
      ├─ Retorna: ItemStatistics
      └─ Integra com: AggregationService
```

### 4.1.3 Use Cases de Order
```
- [ ] ListOrdersByStatusUseCase
      ├─ Recebe: status, page, limit
      ├─ Retorna: List<OrderResponseDTO>
      └─ Integra com: FilterBuilder

- [ ] SearchOrdersByCustomerUseCase
      ├─ Recebe: customerName, page, limit
      ├─ Retorna: List<OrderResponseDTO>
      └─ Integra com: SearchService

- [ ] GetOrderStatisticsUseCase
      ├─ Recebe: period (today, week, month, year)
      ├─ Retorna: OrderStatistics
      └─ Integra com: AggregationService

- [ ] GetOrdersByDateRangeUseCase
      ├─ Recebe: startDate, endDate, page, limit
      ├─ Retorna: List<OrderResponseDTO>
      └─ Integra com: FilterBuilder (BETWEEN dates)
```

### 4.2 Query & Filter System
```
- [ ] FilterBuilder
      ├─ Classe que constrói WHERE dinâmico
      ├─ Suporte para: =, !=, <, >, <=, >=, LIKE, BETWEEN, IN
      ├─ Método build() retorna SQL WHERE
      └─ Testes: testes unitários para cada operador

- [ ] SortBuilder
      ├─ Classe que constrói ORDER BY dinâmico
      ├─ Suporte para: ASC, DESC
      ├─ Múltiplos campos
      └─ Testes: validação de campos válidos

- [ ] PaginationDTO
      ├─ page, limit, total, pages, data
      ├─ Conversão automática
      └─ Testes: cálculo de pages correto

- [ ] SearchService
      ├─ Integra FilterBuilder + SearchTerms
      ├─ Busca full-text (LIKE %term%)
      └─ Testes: buscas em diferentes campos
```

### 4.3 Validações Avançadas
```
- [ ] BusinessRuleValidator
      ├─ validateMenuUniqueName(name, excludeId?)
      ├─ validateItemPrice(price)
      ├─ validateOrderMinItems(items)
      ├─ validateSettingType(value, type)
      └─ Testes: cada regra testada

- [ ] CrossEntityValidator
      ├─ validateMenuItemRelation()
      ├─ validateOrderItemExists()
      ├─ validateNoDeletedItems()
      └─ Testes: integrações testadas
```

### 4.4 Agregações & Estatísticas
```
- [ ] MenuStatistics DTO
      ├─ totalItems, avgPrice, minPrice, maxPrice
      ├─ activeItemsCount
      └─ Testes: cálculos corretos

- [ ] OrderStatistics DTO
      ├─ totalOrders, totalRevenue, avgOrderValue
      ├─ ordersByStatus (breakdown)
      ├─ topCustomers
      └─ Testes: período e agregações

- [ ] AggregationService
      ├─ getMenuStatistics(menuId)
      ├─ getOrderStatistics(period)
      ├─ getSystemStatistics()
      └─ Testes: queries SQL corretas
```

---

## 🧪 Testes Planejados

### Testes Unitários
```
- [ ] FilterBuilder.test.ts (operadores)
- [ ] SortBuilder.test.ts (ordenação)
- [ ] PaginationDTO.test.ts (cálculos)
- [ ] SearchService.test.ts (termos)
- [ ] BusinessRuleValidator.test.ts (regras)
- [ ] CrossEntityValidator.test.ts (relacionamentos)
- [ ] AggregationService.test.ts (cálculos)
```

### Testes de Integração
```
- [ ] MenuUseCases.integration.test.ts
- [ ] ItemUseCases.integration.test.ts
- [ ] OrderUseCases.integration.test.ts
- [ ] FilterBuilder com Repository.test.ts
- [ ] SearchService com DB.test.ts
```

---

## 📊 Métricas de Sucesso

| Métrica | Target | Como Medir |
|---------|--------|-----------|
| Use Cases | 12 | Contar arquivos *UseCase.ts |
| Cobertura de Queries | 100% | Testar cada tipo de filtro |
| Performance de Paginação | <100ms | Medir tempo de query |
| Validações | 10+ | Contar métodos validators |
| Testes | 80%+ coverage | Jest/Vitest report |
| Zero erros TypeScript | 0 | tsc --noEmit |

---

## 🛠️ Ferramentas & Dependências

### Já Instaladas
- ✅ TypeScript
- ✅ Express
- ✅ SQLite + sqlite wrapper
- ✅ Jest (para testes)

### A Adicionar (se necessário)
- [ ] @vitest/ui (para visualizar testes)
- [ ] faker (para fixtures de testes)

---

## 📈 Integração com FASE 3

```
FASE 3 (Infrastructure)
    ↓
├─ Repositories ✅
├─ Controllers ✅
├─ Services ✅
└─ DTOs ✅
    ↓
FASE 4 (Application)
    ├─ Use Cases (novo)
    ├─ Query Builders (novo)
    ├─ Validators (novo)
    ├─ Aggregations (novo)
    └─ Reutiliza: Repos, Services, DTOs
```

---

## 🚀 Plano de Execução

### Dia 1: Use Cases Básicos
```
- [ ] GetAllMenusUseCase
- [ ] GetAllItemsUseCase
- [ ] GetAllOrdersUseCase
```

### Dia 2: Query & Filter System
```
- [ ] FilterBuilder completo
- [ ] SortBuilder completo
- [ ] PaginationDTO completo
```

### Dia 3: Search & Validators
```
- [ ] SearchService
- [ ] BusinessRuleValidator
- [ ] CrossEntityValidator
```

### Dia 4: Agregações & Testes
```
- [ ] AggregationService
- [ ] MenuStatistics
- [ ] OrderStatistics
- [ ] Testes unitários
```

### Dia 5: Integração & Report
```
- [ ] Testes de integração
- [ ] Correção de bugs
- [ ] Report final (FASE4_FINAL.md)
```

---

## 📝 Exemplo de UseCase

```typescript
// GetAllMenusUseCase.ts
export class GetAllMenusUseCase {
  constructor(
    private menuRepository: IMenuRepository,
    private filterBuilder: FilterBuilder
  ) {}

  async execute(input: GetAllMenusInput): Promise<PaginationDTO<MenuResponseDTO>> {
    // 1. Validar input
    // 2. Construir filtros (se houver)
    // 3. Chamar repository com filtros + paginação
    // 4. Mapear para DTOs
    // 5. Retornar PaginationDTO
    
    const items = await this.menuRepository.findAll(
      this.filterBuilder
        .addFilter('active', '=', true)
        .addSort('name', 'ASC')
        .paginate(input.page, input.limit)
        .build()
    );
    
    return new PaginationDTO({
      page: input.page,
      limit: input.limit,
      total: items.count,
      data: items.map(m => MenuResponseDTO.from(m))
    });
  }
}
```

---

## 🎯 Conclusão do Planejamento

### O que será entregue
- ✅ 12 Use Cases implementados
- ✅ Sistema completo de Query/Filter/Pagination
- ✅ Validações avançadas
- ✅ Agregações e estatísticas
- ✅ 80%+ cobertura de testes
- ✅ Report final com padrão consistente

### Status
**🚀 Pronto para iniciar a FASE 4!**

---

*Planejamento criado em: 23 de janeiro de 2026*
*Próximo passo: Executar as tarefas conforme plano*
