# 🏗️ Arquitetura de Refatoração - Backend Clean Architecture + DDD Lite

**Versão**: 1.0  
**Data de Criação**: 23 de janeiro de 2026  
**Status**: Planejamento  
**Objetivo**: Refatorar backend de CRUD anêmico para Clean Architecture com DDD Lite

---

## 📋 Contexto e Justificativa

### Problema Atual

O backend atual segue um padrão **Anemic Model Anti-pattern**:
- ❌ Lógica de negócio espalhada nas rotas (controllers)
- ❌ Sem separação de camadas (domain, application, infrastructure)
- ❌ SQL direto nas rotas (acoplamento com banco de dados)
- ❌ Sem entidades de domínio com lógica encapsulada
- ❌ Impossível testar sem mockar Express inteiro
- ❌ Validações inconsistentes (algumas nas rotas, algumas no frontend)
- ❌ Sem tratamento de erros centralizado

### Solução Adotada: Clean Architecture + DDD Lite

**Por que não DDD completo?**
- Projeto é pequeno (4 entidades)
- Complexidade de negócio limitada
- DDD completo seria over-engineering
- Agregates, Domain Events, Value Objects seriam excessivos

**Por que Clean Architecture?**
- ✅ Separação clara de responsabilidades
- ✅ Cada camada tem um propósito específico
- ✅ Fácil testar services isolados
- ✅ Escalável e manutenível
- ✅ Não é complexo demais para projeto pequeno

**DDD Lite significa:**
- ✅ Entidades com lógica de negócio encapsulada
- ✅ Repositórios abstratos (sem expor SQL)
- ✅ Services com casos de uso claros
- ✅ DTOs para transferência de dados
- ✅ Sem Aggregates, Value Objects, Domain Events (ainda)

---

## 🎯 Estrutura Proposta Detalhada

### Hierarquia de Camadas

```
┌─────────────────────────────────────────┐
│     HTTP Layer (Routes + Handlers)      │ ← Express
├─────────────────────────────────────────┤
│   Application Layer (Services + DTOs)   │ ← Casos de Uso
├─────────────────────────────────────────┤
│     Domain Layer (Entities + Rules)     │ ← Lógica de Negócio
├─────────────────────────────────────────┤
│ Infrastructure Layer (Repositories+DB)  │ ← Implementações Concretas
└─────────────────────────────────────────┘
```

### Estrutura de Diretórios

```
server/src/
│
├── core/                                    # Shared utilities
│   ├── errors/
│   │   ├── AppError.ts                     # Classe base de erros
│   │   ├── ValidationError.ts              # Erro de validação
│   │   └── NotFoundError.ts                # 404 error
│   ├── types/
│   │   └── index.ts                        # Tipos globais
│   └── utils/
│       └── validators.ts                   # Funções de validação reutilizáveis
│
├── domain/                                  # ★ LÓGICA DE NEGÓCIO PURA
│   ├── menus/
│   │   ├── Menu.ts                         # Entity Menu
│   │   ├── MenuItem.ts                     # Entity MenuItem
│   │   ├── MenuRepository.ts               # Interface (contrato)
│   │   └── MenuService.ts                  # Lógica de negócio
│   ├── orders/
│   │   ├── Order.ts                        # Entity Order
│   │   ├── OrderItem.ts                    # Entity OrderItem
│   │   ├── OrderRepository.ts              # Interface
│   │   └── OrderService.ts                 # Lógica de negócio
│   └── settings/
│       ├── Setting.ts                      # Entity Setting
│       ├── SettingRepository.ts            # Interface
│       └── SettingService.ts               # Lógica de negócio
│
├── application/                             # ★ CASOS DE USO & DTOs
│   ├── dtos/
│   │   ├── menu/
│   │   │   ├── CreateMenuDTO.ts
│   │   │   ├── UpdateMenuDTO.ts
│   │   │   └── MenuResponseDTO.ts
│   │   ├── item/
│   │   │   ├── CreateItemDTO.ts
│   │   │   ├── UpdateItemDTO.ts
│   │   │   └── ItemResponseDTO.ts
│   │   ├── order/
│   │   │   ├── CreateOrderDTO.ts
│   │   │   ├── UpdateOrderDTO.ts
│   │   │   └── OrderResponseDTO.ts
│   │   └── setting/
│   │       ├── UpdateSettingDTO.ts
│   │       └── SettingResponseDTO.ts
│   └── usecases/                           # (Opcional) Separar use cases complexos
│       └── (futuro se necessário)
│
├── infrastructure/                          # ★ IMPLEMENTAÇÕES CONCRETAS
│   ├── database/
│   │   ├── database.ts                     # Conexão SQLite (já existe)
│   │   ├── repositories/
│   │   │   ├── MenuRepository.ts           # Implementação concreta
│   │   │   ├── OrderRepository.ts          # Implementação concreta
│   │   │   ├── SettingRepository.ts        # Implementação concreta
│   │   │   └── BaseRepository.ts           # Classe base reutilizável
│   │   └── migrations/                     # (já existe)
│   └── http/
│       ├── middleware/
│       │   ├── errorHandler.ts             # ★ NOVO: Tratamento centralizado
│       │   ├── requestValidator.ts         # ★ NOVO: Validação centralizada
│       │   ├── asyncHandler.ts             # ★ NOVO: Wrapper para async/await
│       │   └── upload.ts                   # (já existe)
│       ├── routes/
│       │   ├── menus.ts                    # Refatorado
│       │   ├── items.ts                    # Refatorado
│       │   ├── orders.ts                   # Refatorado
│       │   ├── settings.ts                 # Refatorado
│       │   └── health.ts                   # (já existe)
│       └── adapters/
│           └── (opcional) Adapters Express ↔ Domain
│
├── container/                               # ★ NOVO: Injeção de Dependência
│   └── Container.ts                        # (simples, sem framework)
│
└── index.ts                                # Entry point (já existe, refatorado)
```

---

## 🔑 Definições Importantes

### Domain Layer (Lógica de Negócio)

**Responsabilidades:**
- Definir entidades com lógica encapsulada
- Definir interfaces de repositório (contrato, NÃO implementação)
- Definir services com regras de negócio
- ZERO dependências externas (sem Express, sem SQLite)

**Exemplo - Menu Entity:**
```typescript
// domain/menus/Menu.ts
export class Menu {
  constructor(
    readonly id: number | null,
    readonly name: string,
    readonly description: string | null,
    readonly logoFilename: string | null,
    readonly active: boolean
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || !this.name.trim()) {
      throw new ValidationError('Nome do menu é obrigatório');
    }
  }

  static create(name: string, description?: string): Menu {
    return new Menu(null, name, description || null, null, true);
  }
}
```

**Exemplo - Repository Interface (contrato):**
```typescript
// domain/menus/MenuRepository.ts
export interface IMenuRepository {
  save(menu: Menu): Promise<Menu>;
  findById(id: number): Promise<Menu | null>;
  findAll(): Promise<Menu[]>;
  delete(id: number): Promise<void>;
}
```

### Application Layer (Casos de Uso)

**Responsabilidades:**
- DTOs (validação de entrada e saída)
- Services que orquestram repositórios
- Convertendo DTOs ↔ Entities

**Exemplo - Service:**
```typescript
// domain/menus/MenuService.ts
export class MenuService {
  constructor(private repository: IMenuRepository) {}

  async createMenu(dto: CreateMenuDTO): Promise<MenuResponseDTO> {
    // Validar
    if (!dto.name.trim()) {
      throw new ValidationError('Nome é obrigatório');
    }

    // Criar entidade
    const menu = Menu.create(dto.name, dto.description);

    // Persistir
    const saved = await this.repository.save(menu);

    // Retornar DTO
    return MenuResponseDTO.from(saved);
  }
}
```

### Infrastructure Layer (Implementações)

**Responsabilidades:**
- Implementações concretas de repositórios
- Drivers de banco de dados
- Middlewares Express
- Rotas (apenas orquestração)

**Exemplo - Repository Concreto:**
```typescript
// infrastructure/database/repositories/MenuRepository.ts
import { IMenuRepository } from '../../../domain/menus/MenuRepository';

export class MenuRepository implements IMenuRepository {
  constructor(private db: Database) {}

  async save(menu: Menu): Promise<Menu> {
    if (menu.id) {
      // UPDATE
      await this.db.run('UPDATE menus SET ...', [...]);
    } else {
      // INSERT
      const result = await this.db.run('INSERT INTO menus ...', [...]);
      menu.id = result.lastID;
    }
    return menu;
  }

  async findById(id: number): Promise<Menu | null> {
    const row = await this.db.get('SELECT * FROM menus WHERE id = ?', id);
    return row ? this.toDomain(row) : null;
  }

  private toDomain(row: any): Menu {
    return new Menu(row.id, row.name, row.description, row.logo_filename, row.active);
  }
}
```

### HTTP Layer (Routes)

**Responsabilidades:**
- APENAS orquestração
- Validar entrada via DTOs
- Chamar services
- Retornar respostas formatadas

**Exemplo - Rota Refatorada:**
```typescript
// infrastructure/http/routes/menus.ts
router.post('/', upload.single('logo'), asyncHandler(async (req, res) => {
  // 1. Validar entrada com DTO
  const dto = new CreateMenuDTO(req.body);
  
  // 2. Processar imagem se houver
  if (req.file) {
    dto.logoFilename = await processAndSaveImage(req.file);
  }

  // 3. Chamar service (lógica está lá!)
  const response = await menuService.createMenu(dto);

  // 4. Retornar resposta
  res.status(201).json(response);
}));
```

---

## 📦 Princípios de Design

### 1. **Dependency Injection (DI)**
```typescript
// Ao invés de:
const menuService = new MenuService(new MenuRepository(db));

// Usar container simples:
const container = new Container();
container.register('menuRepository', () => new MenuRepository(db));
container.register('menuService', () => new MenuService(
  container.get('menuRepository')
));

// Ou até mais tarde: NestJS, TypeDI, etc
```

### 2. **SOLID Principles**

| Princípio | Como Aplicar |
|-----------|-------------|
| **S**ingle Responsibility | Cada classe faz UMA coisa |
| **O**pen/Closed | Aberto para extensão, fechado para modificação |
| **L**iskov Substitution | Interfaces bem definidas |
| **I**nterface Segregation | Interfaces pequenas e específicas |
| **D**ependency Inversion | Depender de abstrações, não implementações |

### 3. **No Anemic Models**
```typescript
// ❌ RUIM (Anemic)
class Menu {
  id: number;
  name: string;
  // Só dados, sem lógica!
}

// ✅ BOM (Rich Model)
class Menu {
  constructor(readonly id: number, readonly name: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.name.trim()) {
      throw new Error('Invalid name');
    }
  }

  isActive(): boolean {
    return this.active;
  }
}
```

---

## 🔄 Fluxo de Requisição Refatorado

### Antes (Atual - Problemático)
```
Request HTTP
    ↓
Route Handler (Express)
    ↓ (SQL direto!)
Database
    ↓
Response HTTP
```

### Depois (Proposto - Limpo)
```
Request HTTP
    ↓
Route Handler (Express)
    ↓
Middleware: Validação (DTO)
    ↓
Service (Lógica de negócio)
    ↓
Repository (Abstração do banco)
    ↓
Database (SQLite)
    ↓
Response DTO
    ↓
Response HTTP
```

---

## 🛠️ Decisões Técnicas

### Banco de Dados: SQLite → Continuar
- ✅ Simples para projeto pequeno
- ✅ Sem dependências externas
- ✅ Dados persistem em arquivo

### ORM: Não usar (ainda)
- Manter `sqlite` package (é simples o suficiente)
- Se crescer: avaliar Prisma, TypeORM, Drizzle
- Repositórios abstraem a query, facilitando migração futura

### Validação: Joi / Zod
- ❌ Não adicionar complexidade agora
- ✅ Validação simples em DTOs
- Futuro: Se crescer, adicionar Zod ou Joi

### Logging: Console → JSON Logs
- ❌ Não adicionar package pesado agora
- ✅ Console.log estruturado por enquanto
- Futuro: Winston ou Pino se necessário

### Injeção de Dependência: Container Manual
- ❌ Não usar NestJS ainda (complexo demais)
- ❌ Não usar TypeDI (uma dependência extra)
- ✅ Container simples feito à mão (veja `container/`)
- Futuro: NestJS quando projeto crescer

---

## 📊 Mapeamento de Migração

### Menus
```
Antes:
- GET /menus                          → route direta DB
- POST /menus (com upload)            → route direta DB
- PUT /menus/:id (com upload)         → route direta DB
- DELETE /menus/:id                   → route direta DB

Depois:
- GET /menus                          → MenuService.getAll()
- POST /menus                         → MenuService.create(DTO)
- PUT /menus/:id                      → MenuService.update(id, DTO)
- DELETE /menus/:id                   → MenuService.delete(id)

Services usam:
- MenuRepository (abstração)
- Menu (entity com validações)
- DTOs (validation + response)
```

### Items
```
Padrão idêntico aos Menus
- ItemService
- ItemRepository
- Item (entity)
- ItemResponseDTO, CreateItemDTO, UpdateItemDTO
```

### Orders
```
Padrão idêntico + relacionamento com Items
- OrderService
- OrderRepository
- Order (entity)
- OrderItem (entity)
- OrderResponseDTO, CreateOrderDTO, UpdateOrderDTO
```

### Settings
```
Padrão idêntico
- SettingService
- SettingRepository
- Setting (entity)
- SettingResponseDTO, UpdateSettingDTO
```

---

## 🎓 Exemplo Completo: Fluxo de Criar Menu

### 1️⃣ Frontend envia
```http
POST /menus
Content-Type: application/json

{
  "name": "Cardápio Principal",
  "description": "Menu principal do restaurante"
}
```

### 2️⃣ Route Handler valida
```typescript
// infrastructure/http/routes/menus.ts
router.post('/', asyncHandler(async (req, res) => {
  // Criar DTO (valida automaticamente)
  const dto = new CreateMenuDTO(req.body);
  
  // Chamar service
  const result = await menuService.createMenu(dto);
  
  res.status(201).json(result);
}));
```

### 3️⃣ Service orquestra
```typescript
// domain/menus/MenuService.ts
async createMenu(dto: CreateMenuDTO): Promise<MenuResponseDTO> {
  // Validar com regras de negócio
  if (!dto.name.trim()) {
    throw new ValidationError('Nome é obrigatório');
  }

  // Criar entity
  const menu = Menu.create(dto.name, dto.description);

  // Persistir via repository (abstração)
  const saved = await this.menuRepository.save(menu);

  // Retornar DTO formatado
  return MenuResponseDTO.from(saved);
}
```

### 4️⃣ Repository salva
```typescript
// infrastructure/database/repositories/MenuRepository.ts
async save(menu: Menu): Promise<Menu> {
  const result = await this.db.run(
    'INSERT INTO menus (name, description, active) VALUES (?, ?, ?)',
    [menu.name, menu.description, menu.active]
  );

  return new Menu(
    result.lastID,
    menu.name,
    menu.description,
    menu.logoFilename,
    menu.active
  );
}
```

### 5️⃣ Response volta
```json
{
  "id": 1,
  "name": "Cardápio Principal",
  "description": "Menu principal do restaurante",
  "logoFilename": null,
  "active": true
}
```

---

## ✅ Benefícios da Refatoração

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Testabilidade** | ❌ Impossível sem mockar Express inteiro | ✅ Services testáveis isoladamente |
| **Reusabilidade** | ❌ Lógica presa nas rotas | ✅ Services reutilizáveis em CLI, gRPC, etc |
| **Manutenção** | ❌ Modificar lógica = mexer em múltiplas rotas | ✅ Modificar lógica = mexer no service |
| **Escalabilidade** | ⚠️ Código fica bagunçado conforme cresce | ✅ Estrutura suporta crescimento |
| **Complexidade** | ⚠️ Simples mas desorganizado | ✅ Bem estruturado, fácil navegar |
| **Debugging** | ❌ Difícil rastrear lógica | ✅ Fluxo claro e previsível |
| **Documentação** | ❌ Nenhuma, entender requer ler código | ✅ Estrutura fala por si |

---

## 🚫 O que NÃO fazer

- ❌ Não adicione NestJS/TypeDI ainda (sem necessidade)
- ❌ Não crie Value Objects complexos (ainda)
- ❌ Não crie Domain Events (ainda)
- ❌ Não adicione ORM pesado (sqlite package é suficiente)
- ❌ Não crie service com múltiplas responsabilidades
- ❌ Não deixe SQL nas rotas

---

## 📈 Roadmap Futuro

### Fase 1: Foundation ✅ (Este documento)
- [ ] Estrutura de diretórios
- [ ] Error handling
- [ ] DTOs base
- [ ] Services simples

### Fase 2: Domain Layer 🔜
- [ ] Entities (Menu, MenuItem, Order, Setting)
- [ ] Repository interfaces
- [ ] Services com lógica
- [ ] Validações

### Fase 3: Infrastructure 🔜
- [ ] Repository implementations
- [ ] Database layer refatorado
- [ ] Middleware de validação
- [ ] Tratamento centralizado de erros

### Fase 4: HTTP Layer 🔜
- [ ] Routes refatoradas
- [ ] Middleware de async error handling
- [ ] Response formatação consistente
- [ ] Testes básicos

### Fase 5: Testes 🔜
- [ ] Unit tests (services)
- [ ] Integration tests (routes)
- [ ] E2E tests (flows completos)

### Fase 6: Polish 🔜
- [ ] Adicionar Zod/Joi se necessário
- [ ] Adicionar logging estruturado
- [ ] Adicionar observabilidade
- [ ] Documentação com OpenAPI

---

## 📚 Referências e Inspiração

- **Clean Architecture** - Robert C. Martin (Uncle Bob)
- **Domain-Driven Design** - Eric Evans
- **SOLID Principles** - Robert C. Martin
- **Repository Pattern** - Martin Fowler
- **Dependency Injection** - Martin Fowler

---

**Próximo Passo**: Executar `PLANO_EXECUCAO.md`  
**Versão do Documento**: 1.0  
**Revisão Necessária**: Após completar Fase 1
