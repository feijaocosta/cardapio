# ✅ Plano de Execução - Refatoração Backend

**Versão**: 1.0  
**Data de Criação**: 23 de janeiro de 2026  
**Status**: Pronto para Execução  
**Duração Estimada**: 2-3 dias  
**Dependência**: Ler `ARQUITETURA_REFATORACAO.md` antes de começar

---

## ⚠️ IMPORTANTE: Onde as Mudanças Acontecem

**TODOS os comandos e arquivos criados serão em `/server/src/`**

Este é um **monorepo** com estrutura:
```
/cardapio (raiz)
├── Frontend React (src/, components/, services/)
└── /server/ ← TODO BACKEND AQUI
    └── src/ ← REFATORAÇÃO ACONTECE AQUI
```

### Instruções para Comandos
```bash
# ✅ CORRETO: Navegue para /server primeiro
cd /Users/feijao/development/cardapio/server
mkdir -p src/core/errors

# ❌ ERRADO: NÃO fazer na raiz
cd /Users/feijao/development/cardapio
mkdir -p core/errors  # NÃO AQUI!
```

### Sobre Caminhos de Import
```typescript
// ✅ CORRETO: Relativo a server/src/
import { Menu } from '../../domain/menus/Menu';

// Estrutura de pastas:
// server/src/domain/menus/Menu.ts
// server/src/infrastructure/http/routes/menus.ts
// ↓ import de routes para domain
// ../../domain/menus/Menu.ts
```

### Checklist de Estrutura
- [ ] **Frontend** em `/cardapio/src/` - NÃO MUDA
- [ ] **Backend** em `/cardapio/server/src/` - REFATORAÇÃO AQUI
- [ ] **Documentação** em `/cardapio/*.md` - Já criada
- [ ] **Cada um com package.json próprio** - Sim

---

## 🎯 Objetivo

Transformar o backend de um padrão Anemic Model para Clean Architecture + DDD Lite, mantendo todas as funcionalidades, mas com código testável, escalável e bem organizado.

---

## 📋 Pré-requisitos

- [ ] Documentação `ARQUITETURA_REFATORACAO.md` lida e entendida
- [ ] Projeto rodando sem erros (`npm run dev` no server)
- [ ] Git atualizado (para rollback se necessário)
- [ ] Todas as dependências instaladas

```bash
cd /Users/feijao/development/cardapio/server
npm install
npm run dev
# Deve rodar sem erros em http://localhost:3000
```

---

## 🔄 Ordem de Execução Recomendada

```
FASE 1: Foundation (Dia 1 - Manhã)
├── ✅ Criar estrutura de diretórios
├── ✅ Implementar error handling
├── ✅ Criar tipos globais
├── ✅ Criar DTOs base
└── ✅ Criar Container simples (DI)

FASE 2: Domain Layer (Dia 1 - Tarde)
├── ✅ Criar entities (Menu, MenuItem, Order, Setting)
├── ✅ Criar repository interfaces
├── ✅ Criar services de domínio
└── ✅ Adicionar validações

FASE 3: Infrastructure (Dia 2 - Dia inteiro)
├── ✅ Implementar repositories concretos
├── ✅ Criar middleware de validação
├── ✅ Criar middleware de error handling
└── ✅ Refatorar routes

FASE 4: Integração (Dia 3 - Manhã)
├── ✅ Testar todas as rotas
├── ✅ Verificar comportamento idêntico
├── ✅ Adicionar logs
└── ✅ Cleanup & documentação

FASE 5: Limpeza (Dia 3 - Tarde)
├── ✅ Remover código antigo
├── ✅ Atualizar package.json se necessário
├── ✅ Remover este plano
└── ✅ Documentar mudanças em GUIA_DESENVOLVIMENTO.md
```

---

## 🚀 FASE 1: Foundation

### ✅ Tarefa 1.1: Criar Estrutura de Diretórios

```bash
cd /Users/feijao/development/cardapio/server/src

# Criar diretórios principais
mkdir -p core/errors
mkdir -p core/types
mkdir -p core/utils
mkdir -p domain/menus
mkdir -p domain/orders
mkdir -p domain/settings
mkdir -p application/dtos/menu
mkdir -p application/dtos/item
mkdir -p application/dtos/order
mkdir -p application/dtos/setting
mkdir -p infrastructure/database/repositories
mkdir -p infrastructure/http/middleware
mkdir -p infrastructure/http/adapters
mkdir -p container
```

**Verificação**: Estrutura criada conforme `ARQUITETURA_REFATORACAO.md`

---

### ✅ Tarefa 1.2: Implementar Error Handling

**Arquivo**: `core/errors/AppError.ts`

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: number | string) {
    const message = id ? `${resource} com ID ${id} não encontrado` : `${resource} não encontrado`;
    super(message, 404, true);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
```

**Verificação**: 
- [ ] 3 classes de erro criadas
- [ ] Herdam de AppError
- [ ] Status codes corretos

---

### ✅ Tarefa 1.3: Criar Tipos Globais

**Arquivo**: `core/types/index.ts`

```typescript
// Entidades principais
export interface IEntity {
  id: number | null;
}

// DTOs padrão
export interface ICreateDTO {
  createdAt?: Date;
}

export interface IUpdateDTO {
  updatedAt?: Date;
}

export interface IResponseDTO {
  id: number;
}

// Resultado paginado (futuro)
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Resposta padrão da API
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

**Verificação**:
- [ ] Tipos criados
- [ ] Exportados corretamente
- [ ] Sem erros de compilação

---

### ✅ Tarefa 1.4: Criar Container (Dependency Injection)

**Arquivo**: `container/Container.ts`

```typescript
export class Container {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  register(key: string, factory: () => any): void {
    if (this.services.has(key)) {
      throw new Error(`Serviço ${key} já registrado`);
    }
    this.services.set(key, factory);
  }

  registerSingleton(key: string, factory: () => any): void {
    if (this.singletons.has(key)) {
      throw new Error(`Singleton ${key} já registrado`);
    }
    this.register(key, () => {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, factory());
      }
      return this.singletons.get(key);
    });
  }

  get<T = any>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Serviço ${key} não encontrado`);
    }
    return factory();
  }

  has(key: string): boolean {
    return this.services.has(key);
  }
}
```

**Verificação**:
- [ ] Container criado
- [ ] Métodos register, registerSingleton, get funcionam
- [ ] Sem erros de compilação

---

### ✅ Tarefa 1.5: Middleware de Async Error Handling

**Arquivo**: `infrastructure/http/middleware/asyncHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Verificação**:
- [ ] Middleware criado
- [ ] Exportado para uso nas rotas

---

### ✅ Tarefa 1.6: Middleware de Tratamento de Erros Global

**Arquivo**: `infrastructure/http/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../core/errors/AppError';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Erro:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Erro desconhecido
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    timestamp: new Date().toISOString(),
  });
};
```

**Verificação**:
- [ ] Middleware criado
- [ ] Trata AppError e erros genéricos
- [ ] Formata resposta consistentemente

---

## 🎓 FASE 2: Domain Layer

### ✅ Tarefa 2.1: Criar Entity Menu

**Arquivo**: `domain/menus/Menu.ts`

```typescript
import { ValidationError } from '../../core/errors/AppError';

export class Menu {
  constructor(
    readonly id: number | null,
    readonly name: string,
    readonly description: string | null,
    readonly logoFilename: string | null,
    readonly active: boolean,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || !this.name.trim()) {
      throw new ValidationError('Nome do menu é obrigatório');
    }

    if (this.name.trim().length > 255) {
      throw new ValidationError('Nome do menu não pode ter mais de 255 caracteres');
    }
  }

  static create(name: string, description?: string): Menu {
    return new Menu(
      null,
      name,
      description || null,
      null,
      true,
      new Date(),
      new Date()
    );
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): Menu {
    return new Menu(
      this.id,
      this.name,
      this.description,
      this.logoFilename,
      false,
      this.createdAt,
      new Date()
    );
  }

  activate(): Menu {
    return new Menu(
      this.id,
      this.name,
      this.description,
      this.logoFilename,
      true,
      this.createdAt,
      new Date()
    );
  }

  updateLogo(filename: string): Menu {
    return new Menu(
      this.id,
      this.name,
      this.description,
      filename,
      this.active,
      this.createdAt,
      new Date()
    );
  }
}
```

**Verificação**:
- [ ] Entity Menu criada
- [ ] Validações funcionam
- [ ] Factory method `create` funciona
- [ ] Métodos auxiliares (activate, deactivate, updateLogo)

---

### ✅ Tarefa 2.2: Criar Entity MenuItem

**Arquivo**: `domain/menus/MenuItem.ts`

```typescript
import { ValidationError } from '../../core/errors/AppError';

export class MenuItem {
  constructor(
    readonly id: number | null,
    readonly menuId: number,
    readonly name: string,
    readonly price: number,
    readonly description: string | null,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || !this.name.trim()) {
      throw new ValidationError('Nome do item é obrigatório');
    }

    if (typeof this.price !== 'number' || this.price < 0) {
      throw new ValidationError('Preço deve ser um número positivo');
    }

    if (this.name.length > 255) {
      throw new ValidationError('Nome do item não pode ter mais de 255 caracteres');
    }
  }

  static create(menuId: number, name: string, price: number, description?: string): MenuItem {
    return new MenuItem(
      null,
      menuId,
      name,
      price,
      description || null,
      new Date(),
      new Date()
    );
  }

  getPriceFormatted(): string {
    return this.price.toFixed(2);
  }
}
```

**Verificação**:
- [ ] Entity MenuItem criada
- [ ] Validações funcionam
- [ ] Factory method funciona

---

### ✅ Tarefa 2.3: Criar Entity Order

**Arquivo**: `domain/orders/Order.ts`

```typescript
import { ValidationError } from '../../core/errors/AppError';

export type OrderStatus = 'Pendente' | 'Em preparação' | 'Pronto' | 'Entregue' | 'Cancelado';

export class Order {
  constructor(
    readonly id: number | null,
    readonly customerName: string,
    readonly status: OrderStatus,
    readonly items: OrderItem[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.customerName || !this.customerName.trim()) {
      throw new ValidationError('Nome do cliente é obrigatório');
    }

    const validStatuses: OrderStatus[] = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];
    if (!validStatuses.includes(this.status)) {
      throw new ValidationError('Status do pedido inválido');
    }

    if (!Array.isArray(this.items) || this.items.length === 0) {
      throw new ValidationError('Pedido deve conter pelo menos um item');
    }
  }

  static create(customerName: string, items: OrderItem[]): Order {
    return new Order(
      null,
      customerName,
      'Pendente',
      items,
      new Date(),
      new Date()
    );
  }

  changeStatus(newStatus: OrderStatus): Order {
    return new Order(
      this.id,
      this.customerName,
      newStatus,
      this.items,
      this.createdAt,
      new Date()
    );
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }
}

export class OrderItem {
  constructor(
    readonly id: number | null,
    readonly orderId: number | null,
    readonly itemId: number,
    readonly quantity: number,
    readonly unitPrice: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!Number.isInteger(this.quantity) || this.quantity <= 0) {
      throw new ValidationError('Quantidade deve ser um número inteiro positivo');
    }

    if (this.unitPrice < 0) {
      throw new ValidationError('Preço unitário não pode ser negativo');
    }
  }

  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }

  static create(itemId: number, quantity: number, unitPrice: number): OrderItem {
    return new OrderItem(null, null, itemId, quantity, unitPrice);
  }
}
```

**Verificação**:
- [ ] Entities Order e OrderItem criadas
- [ ] Validações funcionam
- [ ] Factory methods funcionam
- [ ] Cálculos funcionam (getTotal, getSubtotal)

---

### ✅ Tarefa 2.4: Criar Entity Setting

**Arquivo**: `domain/settings/Setting.ts`

```typescript
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
```

**Verificação**:
- [ ] Entity Setting criada
- [ ] Validações funcionam
- [ ] Conversão de tipos funciona

---

### ✅ Tarefa 2.5: Criar Repository Interfaces

**Arquivo**: `domain/menus/MenuRepository.ts`

```typescript
import { Menu } from './Menu';

export interface IMenuRepository {
  save(menu: Menu): Promise<Menu>;
  findById(id: number): Promise<Menu | null>;
  findAll(): Promise<Menu[]>;
  delete(id: number): Promise<void>;
}
```

**Arquivo**: `domain/orders/OrderRepository.ts`

```typescript
import { Order } from './Order';

export interface IOrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: number): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  delete(id: number): Promise<void>;
}
```

**Arquivo**: `domain/settings/SettingRepository.ts`

```typescript
import { Setting } from './Setting';

export interface ISettingRepository {
  save(setting: Setting): Promise<Setting>;
  findByKey(key: string): Promise<Setting | null>;
  findAll(): Promise<Setting[]>;
  delete(key: string): Promise<void>;
}
```

**Verificação**:
- [ ] 3 interfaces de repositório criadas
- [ ] Métodos básicos definidos (save, find, delete)
- [ ] Sem implementação concreta (apenas interface)

---

## 📦 FASE 3: Infrastructure

### ✅ Tarefa 3.1: Implementar MenuRepository Concreto

**Arquivo**: `infrastructure/database/repositories/MenuRepository.ts`

```typescript
import { Database } from 'sqlite';
import { Menu } from '../../../domain/menus/Menu';
import { IMenuRepository } from '../../../domain/menus/MenuRepository';
import { NotFoundError } from '../../../core/errors/AppError';

export class MenuRepository implements IMenuRepository {
  constructor(private db: Database) {}

  async save(menu: Menu): Promise<Menu> {
    if (menu.id) {
      // Update
      await this.db.run(
        `UPDATE menus SET name = ?, description = ?, logo_filename = ?, active = ? WHERE id = ?`,
        [menu.name, menu.description, menu.logoFilename, menu.active ? 1 : 0, menu.id]
      );
      return menu;
    } else {
      // Insert
      const result = await this.db.run(
        `INSERT INTO menus (name, description, active) VALUES (?, ?, ?)`,
        [menu.name, menu.description, menu.active ? 1 : 0]
      );
      return new Menu(
        result.lastID as number,
        menu.name,
        menu.description,
        menu.logoFilename,
        menu.active,
        menu.createdAt,
        menu.updatedAt
      );
    }
  }

  async findById(id: number): Promise<Menu | null> {
    const row = await this.db.get<any>(
      'SELECT * FROM menus WHERE id = ?',
      id
    );
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<Menu[]> {
    const rows = await this.db.all<any[]>('SELECT * FROM menus');
    return rows.map(row => this.toDomain(row));
  }

  async delete(id: number): Promise<void> {
    const menu = await this.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu', id);
    }
    await this.db.run('DELETE FROM menus WHERE id = ?', id);
  }

  private toDomain(row: any): Menu {
    return new Menu(
      row.id,
      row.name,
      row.description || null,
      row.logo_filename || null,
      row.active === 1,
      new Date(row.created_at || Date.now()),
      new Date(row.updated_at || Date.now())
    );
  }
}
```

**Verificação**:
- [ ] Repository implementa IMenuRepository
- [ ] Todos os métodos implementados
- [ ] Conversão de dados (toDomain) funciona
- [ ] Sem erros de compilação

---

### ✅ Tarefa 3.2: Criar MenuService de Domínio

**Arquivo**: `domain/menus/MenuService.ts`

```typescript
import { Menu } from './Menu';
import { IMenuRepository } from './MenuRepository';
import { NotFoundError } from '../../core/errors/AppError';
import { CreateMenuDTO, UpdateMenuDTO, MenuResponseDTO } from '../../application/dtos/menu';

export class MenuService {
  constructor(private menuRepository: IMenuRepository) {}

  async getAllMenus(): Promise<MenuResponseDTO[]> {
    const menus = await this.menuRepository.findAll();
    return menus.map(menu => MenuResponseDTO.from(menu));
  }

  async getMenuById(id: number): Promise<MenuResponseDTO> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu', id);
    }
    return MenuResponseDTO.from(menu);
  }

  async createMenu(dto: CreateMenuDTO): Promise<MenuResponseDTO> {
    const menu = Menu.create(dto.name, dto.description);
    const saved = await this.menuRepository.save(menu);
    return MenuResponseDTO.from(saved);
  }

  async updateMenu(id: number, dto: UpdateMenuDTO): Promise<MenuResponseDTO> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu', id);
    }

    const updated = new Menu(
      menu.id,
      dto.name !== undefined ? dto.name : menu.name,
      dto.description !== undefined ? dto.description : menu.description,
      menu.logoFilename,
      dto.active !== undefined ? dto.active : menu.active,
      menu.createdAt,
      new Date()
    );

    const saved = await this.menuRepository.save(updated);
    return MenuResponseDTO.from(saved);
  }

  async deleteMenu(id: number): Promise<void> {
    await this.menuRepository.delete(id);
  }

  async updateMenuLogo(id: number, logoFilename: string): Promise<MenuResponseDTO> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu', id);
    }

    const updated = menu.updateLogo(logoFilename);
    const saved = await this.menuRepository.save(updated);
    return MenuResponseDTO.from(saved);
  }
}
```

**Verificação**:
- [ ] Service criado com métodos de caso de uso
- [ ] Todos os CRUD básicos implementados
- [ ] Usa entidades do domínio
- [ ] Lança exceções apropriadas

---

### ✅ Tarefa 3.3: Criar DTOs para Menu

**Arquivo**: `application/dtos/menu/CreateMenuDTO.ts`

```typescript
import { ValidationError } from '../../../core/errors/AppError';

export class CreateMenuDTO {
  name: string;
  description?: string;

  constructor(data: any) {
    this.name = data?.name?.trim() || '';
    this.description = data?.description?.trim() || '';

    this.validate();
  }

  private validate(): void {
    if (!this.name) {
      throw new ValidationError('Nome do menu é obrigatório');
    }
  }
}

export class UpdateMenuDTO {
  name?: string;
  description?: string;
  active?: boolean;

  constructor(data: any) {
    this.name = data?.name?.trim() || undefined;
    this.description = data?.description?.trim() || undefined;
    this.active = data?.active !== undefined ? data.active === 'true' || data.active === true : undefined;
  }
}

export class MenuResponseDTO {
  id: number;
  name: string;
  description: string | null;
  logoFilename: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<MenuResponseDTO>) {
    this.id = data.id!;
    this.name = data.name!;
    this.description = data.description || null;
    this.logoFilename = data.logoFilename || null;
    this.active = data.active !== undefined ? data.active : true;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(entity: any): MenuResponseDTO {
    return new MenuResponseDTO({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      logoFilename: entity.logoFilename,
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
```

**Verificação**:
- [ ] 3 DTOs criados (Create, Update, Response)
- [ ] Validação em Create
- [ ] Factory method `from` em Response DTO
- [ ] Sem erros de compilação

---

### ✅ Tarefa 3.4: Refatorar Rota de Menus

**Arquivo**: `infrastructure/http/routes/menus.ts` (refatorado)

```typescript
import express from 'express';
import { MenuService } from '../../../domain/menus/MenuService';
import { asyncHandler } from '../middleware/asyncHandler';
import { upload, processAndSaveImage, deleteImageFile, generateImageFilename } from '../middleware/upload';
import { CreateMenuDTO, UpdateMenuDTO } from '../../../application/dtos/menu';

const router = express.Router();
let menuService: MenuService; // Será injetado no index.ts

export function setMenuService(service: MenuService) {
  menuService = service;
}

// GET /menus
router.get('/', asyncHandler(async (req, res) => {
  const menus = await menuService.getAllMenus();
  res.json(menus);
}));

// GET /menus/:id/logo
router.get('/:id/logo', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const menu = await menuService.getMenuById(id);
  
  if (!menu.logoFilename) {
    return res.status(404).json({ error: 'Logo não encontrado' });
  }

  res.set('Cache-Control', 'public, max-age=86400');
  res.set('Content-Type', 'image/webp');
  res.sendFile(menu.logoFilename, { root: __dirname + '/../../uploads' });
}));

// POST /menus
router.post('/', upload.single('logo'), asyncHandler(async (req, res) => {
  const dto = new CreateMenuDTO(req.body);
  
  let menu = await menuService.createMenu(dto);

  if (req.file && menu.id) {
    const logoFilename = generateImageFilename(menu.id);
    await processAndSaveImage(req.file, logoFilename);
    menu = await menuService.updateMenuLogo(menu.id, logoFilename);
  }

  res.status(201).json(menu);
}));

// PUT /menus/:id
router.put('/:id', upload.single('logo'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const dto = new UpdateMenuDTO(req.body);
  
  let menu = await menuService.updateMenu(id, dto);

  if (req.file && menu.id) {
    const oldFilename = menu.logoFilename;
    const logoFilename = generateImageFilename(menu.id);
    
    await processAndSaveImage(req.file, logoFilename);
    if (oldFilename) {
      deleteImageFile(oldFilename);
    }
    
    menu = await menuService.updateMenuLogo(menu.id, logoFilename);
  }

  res.status(200).json(menu);
}));

// DELETE /menus/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const menu = await menuService.getMenuById(id);
  
  if (menu.logoFilename) {
    deleteImageFile(menu.logoFilename);
  }

  await menuService.deleteMenu(id);
  res.status(200).json({ message: 'Menu deletado com sucesso' });
}));

export default router;
```

**Verificação**:
- [ ] Rota refatorada
- [ ] Usa asyncHandler
- [ ] Usa DTOs
- [ ] Usa MenuService
- [ ] Mantém mesma interface HTTP
- [ ] Sem erros de compilação

---

### ✅ Tarefa 3.5: Criar Items Repository e Service (Padrão similar)

Use o mesmo padrão de MenuRepository e MenuService para:

**Arquivos a criar:**
- [ ] `domain/menus/ItemRepository.ts` (interface)
- [ ] `infrastructure/database/repositories/ItemRepository.ts` (implementação)
- [ ] `domain/menus/ItemService.ts` (service)
- [ ] `application/dtos/item/CreateItemDTO.ts`
- [ ] `application/dtos/item/UpdateItemDTO.ts`
- [ ] `application/dtos/item/ItemResponseDTO.ts`

**Depois refatorar:**
- [ ] `infrastructure/http/routes/items.ts`

---

### ✅ Tarefa 3.6: Criar Orders Repository e Service

Use padrão similar para Order:

**Arquivos a criar:**
- [ ] `domain/orders/OrderRepository.ts` (interface - já criada em 2.5)
- [ ] `infrastructure/database/repositories/OrderRepository.ts` (implementação)
- [ ] `domain/orders/OrderService.ts` (service)
- [ ] `application/dtos/order/CreateOrderDTO.ts`
- [ ] `application/dtos/order/UpdateOrderDTO.ts`
- [ ] `application/dtos/order/OrderResponseDTO.ts`

**Depois refatorar:**
- [ ] `infrastructure/http/routes/orders.ts`

---

### ✅ Tarefa 3.7: Criar Settings Repository e Service

Use padrão similar para Setting:

**Arquivos a criar:**
- [ ] `domain/settings/SettingRepository.ts` (interface - já criada em 2.5)
- [ ] `infrastructure/database/repositories/SettingRepository.ts` (implementação)
- [ ] `domain/settings/SettingService.ts` (service)
- [ ] `application/dtos/setting/UpdateSettingDTO.ts`
- [ ] `application/dtos/setting/SettingResponseDTO.ts`

**Depois refatorar:**
- [ ] `infrastructure/http/routes/settings.ts`

---

## 🔗 FASE 4: Integração e Setup Final

### ✅ Tarefa 4.1: Atualizar index.ts

**Arquivo**: `src/index.ts` (refatorado)

Registrar todos os serviços no container e conectar middlewares:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initializeDatabase, getDatabase } from './db/database';
import { Container } from './container/Container';
import { errorHandler } from './infrastructure/http/middleware/errorHandler';

// Importar services
import { MenuService } from './domain/menus/MenuService';
import { MenuRepository } from './infrastructure/database/repositories/MenuRepository';
// ... imports outros services

// Importar rotas
import menusRouter, { setMenuService } from './infrastructure/http/routes/menus';
// ... imports outras rotas

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Setup das rotas
async function setupRoutes() {
  const db = await getDatabase();
  
  // Registrar no container
  const container = new Container();
  
  container.registerSingleton('menuRepository', () => new MenuRepository(db));
  container.registerSingleton('menuService', () => new MenuService(
    container.get('menuRepository')
  ));
  
  // ... registrar outros services
  
  // Injetar services nas rotas
  setMenuService(container.get('menuService'));
  // ... injetar outros services
  
  // Registrar rotas
  app.use('/menus', menusRouter);
  app.use('/items', itemsRouter);
  app.use('/orders', ordersRouter);
  app.use('/settings', settingsRouter);
  app.use('/health', healthRouter);
  
  // Error handler (DEVE ser última middleware)
  app.use(errorHandler);
}

// Iniciar servidor
initializeDatabase().then(async () => {
  await setupRoutes();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Erro ao inicializar:', error);
  process.exit(1);
});
```

**Verificação**:
- [ ] Todos os services registrados
- [ ] Todas as rotas conectadas
- [ ] Error handler no final
- [ ] Sem erros de compilação
- [ ] Servidor inicia sem problemas

---

### ✅ Tarefa 4.2: Implementar Testes Automatizados (Unitários + Integração)

#### 4.2.1: Setup de Testes

**Passo 1: Instalar dependências de teste**

```bash
cd /Users/feijao/development/cardapio/server

npm install --save-dev \
  jest \
  ts-jest \
  @types/jest \
  supertest \
  @types/supertest \
  sqlite \
  jest-extended
```

**Passo 2: Criar arquivo de configuração**

**Arquivo**: `server/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/index.ts',
    '!src/app.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
};
```

**Passo 3: Atualizar package.json com scripts de teste**

```json
{
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration"
  }
}
```

**Passo 4: Criar arquivo de setup para testes**

**Arquivo**: `src/__tests__/setup.ts`

```typescript
// Configuração global para testes
jest.setTimeout(10000);

// Mock do console.log em testes (opcional)
// global.console.log = jest.fn();
```

**Verificação**:
- [ ] Dependencies instaladas sem erro
- [ ] `jest.config.js` criado
- [ ] Scripts adicionados a `package.json`
- [ ] `npm test` executa sem erros

---

#### 4.2.2: Testes de Entidades (Domain Layer)

**Arquivo**: `src/__tests__/domain/menus/Menu.test.ts`

```typescript
import { Menu } from '../../../domain/menus/Menu';
import { ValidationError } from '../../../core/errors/AppError';

describe('Menu Entity', () => {
  describe('constructor', () => {
    it('deve criar um menu válido', () => {
      const menu = new Menu(1, 'Menu Principal', 'Descrição', null, true);
      
      expect(menu.id).toBe(1);
      expect(menu.name).toBe('Menu Principal');
      expect(menu.description).toBe('Descrição');
      expect(menu.active).toBe(true);
    });

    it('deve lançar erro se nome estiver vazio', () => {
      expect(() => {
        new Menu(1, '', 'Descrição', null, true);
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se nome tiver mais de 255 caracteres', () => {
      const longName = 'a'.repeat(256);
      
      expect(() => {
        new Menu(1, longName, 'Descrição', null, true);
      }).toThrow(ValidationError);
    });

    it('deve aceitar nome com até 255 caracteres', () => {
      const validName = 'a'.repeat(255);
      const menu = new Menu(1, validName, 'Descrição', null, true);
      
      expect(menu.name).toBe(validName);
    });
  });

  describe('factory method create', () => {
    it('deve criar menu com valores padrão', () => {
      const menu = Menu.create('Novo Menu', 'Descrição');
      
      expect(menu.id).toBeNull();
      expect(menu.name).toBe('Novo Menu');
      expect(menu.description).toBe('Descrição');
      expect(menu.active).toBe(true);
      expect(menu.logoFilename).toBeNull();
    });

    it('deve criar menu sem descrição', () => {
      const menu = Menu.create('Menu');
      
      expect(menu.description).toBeNull();
    });
  });

  describe('métodos de manipulação', () => {
    let menu: Menu;

    beforeEach(() => {
      menu = new Menu(1, 'Menu', 'Desc', null, true);
    });

    it('deve desativar menu', () => {
      const deactivated = menu.deactivate();
      
      expect(deactivated.active).toBe(false);
      expect(deactivated.id).toBe(menu.id);
    });

    it('deve ativar menu', () => {
      const deactivated = menu.deactivate();
      const activated = deactivated.activate();
      
      expect(activated.active).toBe(true);
    });

    it('deve atualizar logo', () => {
      const updated = menu.updateLogo('logo.webp');
      
      expect(updated.logoFilename).toBe('logo.webp');
      expect(updated.name).toBe(menu.name);
    });

    it('deve atualizar timestamp ao modificar', () => {
      const originalUpdated = menu.updatedAt;
      
      const modified = menu.updateLogo('new-logo.webp');
      
      expect(modified.updatedAt).not.toEqual(originalUpdated);
    });
  });

  describe('método isActive', () => {
    it('deve retornar true se menu ativo', () => {
      const menu = new Menu(1, 'Menu', null, null, true);
      expect(menu.isActive()).toBe(true);
    });

    it('deve retornar false se menu inativo', () => {
      const menu = new Menu(1, 'Menu', null, null, false);
      expect(menu.isActive()).toBe(false);
    });
  });
});
```

**Arquivo**: `src/__tests__/domain/menus/MenuItem.test.ts`

```typescript
import { MenuItem } from '../../../domain/menus/MenuItem';
import { ValidationError } from '../../../core/errors/AppError';

describe('MenuItem Entity', () => {
  describe('constructor', () => {
    it('deve criar item válido', () => {
      const item = new MenuItem(1, 1, 'Prato', 25.50, 'Descrição');
      
      expect(item.id).toBe(1);
      expect(item.menuId).toBe(1);
      expect(item.name).toBe('Prato');
      expect(item.price).toBe(25.50);
    });

    it('deve lançar erro se nome vazio', () => {
      expect(() => {
        new MenuItem(1, 1, '', 25.50, null);
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se preço negativo', () => {
      expect(() => {
        new MenuItem(1, 1, 'Prato', -10, null);
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se preço não é número', () => {
      expect(() => {
        new MenuItem(1, 1, 'Prato', 'invalido' as any, null);
      }).toThrow(ValidationError);
    });

    it('deve aceitar preço zero', () => {
      const item = new MenuItem(1, 1, 'Prato Grátis', 0, null);
      expect(item.price).toBe(0);
    });

    it('deve lançar erro se nome > 255 caracteres', () => {
      const longName = 'a'.repeat(256);
      
      expect(() => {
        new MenuItem(1, 1, longName, 25.50, null);
      }).toThrow(ValidationError);
    });
  });

  describe('factory method create', () => {
    it('deve criar item com valores padrão', () => {
      const item = MenuItem.create(1, 'Prato', 25.50, 'Descrição');
      
      expect(item.id).toBeNull();
      expect(item.menuId).toBe(1);
      expect(item.name).toBe('Prato');
      expect(item.price).toBe(25.50);
    });
  });

  describe('método getPriceFormatted', () => {
    it('deve formatar preço com 2 casas decimais', () => {
      const item = new MenuItem(1, 1, 'Prato', 25.5, null);
      expect(item.getPriceFormatted()).toBe('25.50');
    });

    it('deve formatar preço com muitas casas decimais', () => {
      const item = new MenuItem(1, 1, 'Prato', 25.999, null);
      expect(item.getPriceFormatted()).toBe('26.00');
    });
  });
});
```

**Arquivo**: `src/__tests__/domain/orders/Order.test.ts`

```typescript
import { Order, OrderItem, OrderStatus } from '../../../domain/orders/Order';
import { ValidationError } from '../../../core/errors/AppError';

describe('Order Entity', () => {
  describe('constructor', () => {
    it('deve criar order válida', () => {
      const items = [OrderItem.create(1, 2, 25.50)];
      const order = new Order(1, 'João', 'Pendente', items);
      
      expect(order.id).toBe(1);
      expect(order.customerName).toBe('João');
      expect(order.status).toBe('Pendente');
      expect(order.items).toHaveLength(1);
    });

    it('deve lançar erro se nome cliente vazio', () => {
      const items = [OrderItem.create(1, 2, 25.50)];
      
      expect(() => {
        new Order(1, '', 'Pendente', items);
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se status inválido', () => {
      const items = [OrderItem.create(1, 2, 25.50)];
      
      expect(() => {
        new Order(1, 'João', 'Status Inválido' as OrderStatus, items);
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se items vazio', () => {
      expect(() => {
        new Order(1, 'João', 'Pendente', []);
      }).toThrow(ValidationError);
    });
  });

  describe('factory method create', () => {
    it('deve criar order com status padrão Pendente', () => {
      const items = [OrderItem.create(1, 2, 25.50)];
      const order = Order.create('João', items);
      
      expect(order.id).toBeNull();
      expect(order.status).toBe('Pendente');
      expect(order.customerName).toBe('João');
    });
  });

  describe('método changeStatus', () => {
    it('deve mudar status de order', () => {
      const items = [OrderItem.create(1, 2, 25.50)];
      const order = Order.create('João', items);
      
      const updated = order.changeStatus('Em preparação');
      
      expect(updated.status).toBe('Em preparação');
      expect(updated.customerName).toBe('João');
    });

    it('deve aceitar todos os status válidos', () => {
      const items = [OrderItem.create(1, 2, 25.50)];
      const order = Order.create('João', items);
      
      const statuses: OrderStatus[] = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];
      
      statuses.forEach(status => {
        expect(() => order.changeStatus(status)).not.toThrow();
      });
    });
  });

  describe('método getTotal', () => {
    it('deve calcular total corretamente com um item', () => {
      const items = [OrderItem.create(1, 2, 25.50)]; // 2 * 25.50 = 51.00
      const order = new Order(1, 'João', 'Pendente', items);
      
      expect(order.getTotal()).toBe(51.00);
    });

    it('deve calcular total corretamente com múltiplos items', () => {
      const items = [
        OrderItem.create(1, 2, 25.50), // 2 * 25.50 = 51.00
        OrderItem.create(2, 1, 32.00), // 1 * 32.00 = 32.00
      ];
      const order = new Order(1, 'João', 'Pendente', items);
      
      expect(order.getTotal()).toBe(83.00);
    });
  });
});

describe('OrderItem Entity', () => {
  describe('constructor', () => {
    it('deve criar order item válido', () => {
      const item = new OrderItem(1, 1, 2, 2, 25.50);
      
      expect(item.id).toBe(1);
      expect(item.orderId).toBe(1);
      expect(item.itemId).toBe(2);
      expect(item.quantity).toBe(2);
      expect(item.unitPrice).toBe(25.50);
    });

    it('deve lançar erro se quantidade não é inteiro', () => {
      expect(() => {
        new OrderItem(1, 1, 2, 2.5, 25.50);
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se quantidade é zero', () => {
      expect(() => {
        new OrderItem(1, 1, 2, 0, 25.50);
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se quantidade negativa', () => {
      expect(() => {
        new OrderItem(1, 1, 2, -1, 25.50);
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se preço negativo', () => {
      expect(() => {
        new OrderItem(1, 1, 2, 2, -10);
      }).toThrow(ValidationError);
    });

    it('deve aceitar preço zero', () => {
      const item = new OrderItem(1, 1, 2, 2, 0);
      expect(item.unitPrice).toBe(0);
    });
  });

  describe('método getSubtotal', () => {
    it('deve calcular subtotal corretamente', () => {
      const item = new OrderItem(1, 1, 2, 3, 25.50);
      expect(item.getSubtotal()).toBe(76.50); // 3 * 25.50
    });
  });

  describe('factory method create', () => {
    it('deve criar order item sem IDs', () => {
      const item = OrderItem.create(2, 3, 25.50);
      
      expect(item.id).toBeNull();
      expect(item.orderId).toBeNull();
      expect(item.itemId).toBe(2);
    });
  });
});
```

**Arquivo**: `src/__tests__/domain/settings/Setting.test.ts`

```typescript
import { Setting } from '../../../domain/settings/Setting';
import { ValidationError } from '../../../core/errors/AppError';

describe('Setting Entity', () => {
  describe('constructor', () => {
    it('deve criar setting válida', () => {
      const setting = new Setting('app_name', 'Cardápio', 'string');
      
      expect(setting.key).toBe('app_name');
      expect(setting.value).toBe('Cardápio');
      expect(setting.type).toBe('string');
    });

    it('deve lançar erro se chave vazia', () => {
      expect(() => {
        new Setting('', 'value', 'string');
      }).toThrow(ValidationError);
    });

    it('deve lançar erro se valor vazio', () => {
      expect(() => {
        new Setting('key', '', 'string');
      }).toThrow(ValidationError);
    });

    it('deve usar tipo padrão string', () => {
      const setting = new Setting('key', 'value');
      expect(setting.type).toBe('string');
    });
  });

  describe('método getValue', () => {
    it('deve retornar string para tipo string', () => {
      const setting = new Setting('key', 'valor', 'string');
      expect(setting.getValue()).toBe('valor');
    });

    it('deve converter para número para tipo number', () => {
      const setting = new Setting('key', '123', 'number');
      expect(setting.getValue()).toBe(123);
      expect(typeof setting.getValue()).toBe('number');
    });

    it('deve converter para boolean para tipo boolean', () => {
      const settingTrue = new Setting('key', 'true', 'boolean');
      const settingFalse = new Setting('key', 'false', 'boolean');
      
      expect(settingTrue.getValue()).toBe(true);
      expect(settingFalse.getValue()).toBe(false);
    });
  });

  describe('factory method create', () => {
    it('deve criar setting com padrão string', () => {
      const setting = Setting.create('key', 'value');
      expect(setting.type).toBe('string');
    });

    it('deve criar setting com tipo específico', () => {
      const setting = Setting.create('key', '100', 'number');
      expect(setting.type).toBe('number');
    });
  });
});
```

**Verificação**:
- [ ] Todos os testes de entidade passam
- [ ] `npm test -- __tests__/domain/` executa com sucesso
- [ ] Coverage > 90% para domain layer

---

#### 4.2.3: Testes de Services (Business Logic)

**Arquivo**: `src/__tests__/domain/menus/MenuService.test.ts`

```typescript
import { MenuService } from '../../../domain/menus/MenuService';
import { Menu } from '../../../domain/menus/Menu';
import { IMenuRepository } from '../../../domain/menus/MenuRepository';
import { CreateMenuDTO, UpdateMenuDTO } from '../../../application/dtos/menu';
import { NotFoundError } from '../../../core/errors/AppError';

// Mock do repositório
class MockMenuRepository implements IMenuRepository {
  private menus: Map<number, Menu> = new Map();
  private idCounter = 1;

  async save(menu: Menu): Promise<Menu> {
    if (menu.id) {
      this.menus.set(menu.id, menu);
      return menu;
    } else {
      const newMenu = new Menu(
        this.idCounter++,
        menu.name,
        menu.description,
        menu.logoFilename,
        menu.active,
        menu.createdAt,
        menu.updatedAt
      );
      this.menus.set(newMenu.id!, newMenu);
      return newMenu;
    }
  }

  async findById(id: number): Promise<Menu | null> {
    return this.menus.get(id) || null;
  }

  async findAll(): Promise<Menu[]> {
    return Array.from(this.menus.values());
  }

  async delete(id: number): Promise<void> {
    if (!this.menus.has(id)) {
      throw new NotFoundError('Menu', id);
    }
    this.menus.delete(id);
  }
}

describe('MenuService', () => {
  let service: MenuService;
  let repository: MockMenuRepository;

  beforeEach(() => {
    repository = new MockMenuRepository();
    service = new MenuService(repository);
  });

  describe('getAllMenus', () => {
    it('deve retornar lista vazia quando não há menus', async () => {
      const menus = await service.getAllMenus();
      expect(menus).toEqual([]);
    });

    it('deve retornar todos os menus', async () => {
      // Arrange
      const menu1 = Menu.create('Menu 1', 'Desc 1');
      const menu2 = Menu.create('Menu 2', 'Desc 2');
      
      await repository.save(menu1);
      await repository.save(menu2);

      // Act
      const result = await service.getAllMenus();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Menu 1');
      expect(result[1].name).toBe('Menu 2');
    });
  });

  describe('getMenuById', () => {
    it('deve retornar menu quando encontrado', async () => {
      // Arrange
      const menu = Menu.create('Menu', 'Desc');
      const saved = await repository.save(menu);

      // Act
      const result = await service.getMenuById(saved.id!);

      // Assert
      expect(result.name).toBe('Menu');
      expect(result.id).toBe(saved.id);
    });

    it('deve lançar NotFoundError quando menu não existe', async () => {
      // Act & Assert
      await expect(service.getMenuById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('createMenu', () => {
    it('deve criar menu novo', async () => {
      // Arrange
      const dto = new CreateMenuDTO({ name: 'Novo Menu', description: 'Desc' });

      // Act
      const result = await service.createMenu(dto);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Novo Menu');
      expect(result.description).toBe('Desc');
      expect(result.active).toBe(true);
    });

    it('deve criar menu sem descrição', async () => {
      // Arrange
      const dto = new CreateMenuDTO({ name: 'Menu Simples' });

      // Act
      const result = await service.createMenu(dto);

      // Assert
      expect(result.description).toBeNull();
    });
  });

  describe('updateMenu', () => {
    it('deve atualizar menu existente', async () => {
      // Arrange
      const menu = Menu.create('Original', 'Original Desc');
      const saved = await repository.save(menu);
      const dto = new UpdateMenuDTO({ name: 'Atualizado', description: 'Nova Desc' });

      // Act
      const result = await service.updateMenu(saved.id!, dto);

      // Assert
      expect(result.name).toBe('Atualizado');
      expect(result.description).toBe('Nova Desc');
    });

    it('deve lançar NotFoundError ao atualizar menu inexistente', async () => {
      // Arrange
      const dto = new UpdateMenuDTO({ name: 'Novo Nome' });

      // Act & Assert
      await expect(service.updateMenu(999, dto)).rejects.toThrow(NotFoundError);
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      // Arrange
      const menu = Menu.create('Menu', 'Descrição Original');
      const saved = await repository.save(menu);
      const dto = new UpdateMenuDTO({ name: 'Novo Nome' });

      // Act
      const result = await service.updateMenu(saved.id!, dto);

      // Assert
      expect(result.name).toBe('Novo Nome');
      expect(result.description).toBe('Descrição Original');
    });

    it('deve atualizar status ativo/inativo', async () => {
      // Arrange
      const menu = Menu.create('Menu', 'Desc');
      const saved = await repository.save(menu);
      const dto = new UpdateMenuDTO({ active: false });

      // Act
      const result = await service.updateMenu(saved.id!, dto);

      // Assert
      expect(result.active).toBe(false);
    });
  });

  describe('deleteMenu', () => {
    it('deve deletar menu existente', async () => {
      // Arrange
      const menu = Menu.create('Menu', 'Desc');
      const saved = await repository.save(menu);

      // Act
      await service.deleteMenu(saved.id!);
      const found = await repository.findById(saved.id!);

      // Assert
      expect(found).toBeNull();
    });

    it('deve lançar NotFoundError ao deletar menu inexistente', async () => {
      // Act & Assert
      await expect(service.deleteMenu(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateMenuLogo', () => {
    it('deve atualizar logo de menu existente', async () => {
      // Arrange
      const menu = Menu.create('Menu', 'Desc');
      const saved = await repository.save(menu);

      // Act
      const result = await service.updateMenuLogo(saved.id!, 'new-logo.webp');

      // Assert
      expect(result.logoFilename).toBe('new-logo.webp');
    });

    it('deve lançar NotFoundError ao atualizar logo de menu inexistente', async () => {
      // Act & Assert
      await expect(service.updateMenuLogo(999, 'logo.webp')).rejects.toThrow(NotFoundError);
    });
  });
});
```

**Arquivo**: `src/__tests__/domain/orders/OrderService.test.ts`

```typescript
import { OrderService } from '../../../domain/orders/OrderService';
import { Order, OrderItem } from '../../../domain/orders/Order';
import { IOrderRepository } from '../../../domain/orders/OrderRepository';
import { CreateOrderDTO, UpdateOrderDTO } from '../../../application/dtos/order';
import { NotFoundError } from '../../../core/errors/AppError';

// Mock do repositório
class MockOrderRepository implements IOrderRepository {
  private orders: Map<number, Order> = new Map();
  private idCounter = 1;

  async save(order: Order): Promise<Order> {
    if (order.id) {
      this.orders.set(order.id, order);
      return order;
    } else {
      const newOrder = new Order(
        this.idCounter++,
        order.customerName,
        order.status,
        order.items,
        order.createdAt,
        order.updatedAt
      );
      this.orders.set(newOrder.id!, newOrder);
      return newOrder;
    }
  }

  async findById(id: number): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async delete(id: number): Promise<void> {
    if (!this.orders.has(id)) {
      throw new NotFoundError('Pedido', id);
    }
    this.orders.delete(id);
  }
}

describe('OrderService', () => {
  let service: OrderService;
  let repository: MockOrderRepository;

  beforeEach(() => {
    repository = new MockOrderRepository();
    service = new OrderService(repository);
  });

  describe('createOrder', () => {
    it('deve criar pedido novo com items', async () => {
      // Arrange
      const dto = new CreateOrderDTO({
        customerName: 'João',
        items: [
          { itemId: 1, quantity: 2, unitPrice: 25.50 },
          { itemId: 2, quantity: 1, unitPrice: 32.00 },
        ],
      });

      // Act
      const result = await service.createOrder(dto);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.customerName).toBe('João');
      expect(result.status).toBe('Pendente');
      expect(result.items).toHaveLength(2);
    });

    it('deve calcular total corretamente', async () => {
      // Arrange
      const dto = new CreateOrderDTO({
        customerName: 'João',
        items: [
          { itemId: 1, quantity: 2, unitPrice: 25.50 }, // 51.00
          { itemId: 2, quantity: 1, unitPrice: 32.00 }, // 32.00
        ],
      });

      // Act
      const result = await service.createOrder(dto);

      // Assert
      expect(result.total).toBe(83.00);
    });
  });

  describe('getOrderById', () => {
    it('deve retornar pedido quando encontrado', async () => {
      // Arrange
      const items = [OrderItem.create(1, 2, 25.50)];
      const order = Order.create('João', items);
      const saved = await repository.save(order);

      // Act
      const result = await service.getOrderById(saved.id!);

      // Assert
      expect(result.customerName).toBe('João');
    });

    it('deve lançar NotFoundError quando pedido não existe', async () => {
      // Act & Assert
      await expect(service.getOrderById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateOrderStatus', () => {
    it('deve atualizar status do pedido', async () => {
      // Arrange
      const items = [OrderItem.create(1, 2, 25.50)];
      const order = Order.create('João', items);
      const saved = await repository.save(order);
      const dto = new UpdateOrderDTO({ status: 'Em preparação' });

      // Act
      const result = await service.updateOrderStatus(saved.id!, dto);

      // Assert
      expect(result.status).toBe('Em preparação');
    });

    it('deve lançar NotFoundError ao atualizar pedido inexistente', async () => {
      // Arrange
      const dto = new UpdateOrderDTO({ status: 'Pronto' });

      // Act & Assert
      await expect(service.updateOrderStatus(999, dto)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getAllOrders', () => {
    it('deve retornar todos os pedidos', async () => {
      // Arrange
      const items1 = [OrderItem.create(1, 2, 25.50)];
      const items2 = [OrderItem.create(2, 1, 32.00)];
      
      const order1 = Order.create('João', items1);
      const order2 = Order.create('Maria', items2);
      
      await repository.save(order1);
      await repository.save(order2);

      // Act
      const result = await service.getAllOrders();

      // Assert
      expect(result).toHaveLength(2);
    });
  });

  describe('deleteOrder', () => {
    it('deve deletar pedido existente', async () => {
      // Arrange
      const items = [OrderItem.create(1, 2, 25.50)];
      const order = Order.create('João', items);
      const saved = await repository.save(order);

      // Act
      await service.deleteOrder(saved.id!);
      const found = await repository.findById(saved.id!);

      // Assert
      expect(found).toBeNull();
    });
  });
});
```

**Verificação**:
- [ ] Todos os testes de service passam
- [ ] `npm test -- __tests__/domain/.*Service.test.ts` com sucesso
- [ ] Mocks funcionam corretamente
- [ ] Coverage > 85% para services

---

#### 4.2.4: Testes de Integração (E2E básico)

**Arquivo**: `src/__tests__/integration/api.integration.test.ts`

```typescript
import request from 'supertest';
import { createApp } from '../../app';
import { Container } from '../../container/Container';
import { MenuService } from '../../domain/menus/MenuService';
import { ItemService } from '../../domain/menus/ItemService';
import { OrderService } from '../../domain/orders/OrderService';
import { SettingService } from '../../domain/settings/SettingService';
import { MenuRepository } from '../../infrastructure/database/repositories/MenuRepository';
import { ItemRepository } from '../../infrastructure/database/repositories/ItemRepository';
import { OrderRepository } from '../../infrastructure/database/repositories/OrderRepository';
import { SettingRepository } from '../../infrastructure/database/repositories/SettingRepository';
import { Menu } from '../../domain/menus/Menu';
import { MenuItem } from '../../domain/menus/MenuItem';
import { Order, OrderItem } from '../../domain/orders/Order';
import { Setting } from '../../domain/settings/Setting';

// Mock simples do banco para testes
class InMemoryMenuRepository implements MenuRepository {
  private menus: Map<number, Menu> = new Map();
  private idCounter = 1;

  async save(menu: Menu): Promise<Menu> {
    if (menu.id) {
      this.menus.set(menu.id, menu);
      return menu;
    }
    const newMenu = new Menu(this.idCounter++, menu.name, menu.description, menu.logoFilename, menu.active);
    this.menus.set(newMenu.id!, newMenu);
    return newMenu;
  }

  async findById(id: number): Promise<Menu | null> {
    return this.menus.get(id) || null;
  }

  async findAll(): Promise<Menu[]> {
    return Array.from(this.menus.values());
  }

  async delete(id: number): Promise<void> {
    this.menus.delete(id);
  }
}

// Repositórios em memória similares para Item, Order, Setting

describe('API Integration Tests', () => {
  let app: any;
  let container: Container;
  let menuService: MenuService;

  beforeEach(() => {
    container = new Container();
    
    // Registrar mocks em memória
    const menuRepo = new InMemoryMenuRepository();
    container.registerSingleton('MenuRepository', () => menuRepo);
    container.registerSingleton('MenuService', () => new MenuService(menuRepo));
    
    // Criar app com container
    app = createApp(container);
    
    menuService = container.get('MenuService');
  });

  describe('GET /health', () => {
    it('deve retornar status OK', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Menu Endpoints', () => {
    describe('GET /api/menus', () => {
      it('deve retornar lista vazia inicialmente', async () => {
        const response = await request(app).get('/api/menus');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it('deve retornar menus criados', async () => {
        // Arrange
        await menuService.createMenu({ name: 'Menu 1', description: 'Desc 1' } as any);
        await menuService.createMenu({ name: 'Menu 2', description: 'Desc 2' } as any);

        // Act
        const response = await request(app).get('/api/menus');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].name).toBe('Menu 1');
      });
    });

    describe('POST /api/menus', () => {
      it('deve criar menu novo', async () => {
        const response = await request(app)
          .post('/api/menus')
          .send({
            name: 'Novo Menu',
            description: 'Descrição do menu',
          });

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe('Novo Menu');
        expect(response.body.active).toBe(true);
      });

      it('deve retornar 400 com nome vazio', async () => {
        const response = await request(app)
          .post('/api/menus')
          .send({
            name: '',
            description: 'Descrição',
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('obrigatório');
      });
    });

    describe('GET /api/menus/:id', () => {
      it('deve retornar menu específico', async () => {
        // Arrange
        const created = await menuService.createMenu({ name: 'Menu', description: 'Desc' } as any);

        // Act
        const response = await request(app).get(`/api/menus/${created.id}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(created.id);
        expect(response.body.name).toBe('Menu');
      });

      it('deve retornar 404 para menu inexistente', async () => {
        const response = await request(app).get('/api/menus/999');

        expect(response.status).toBe(404);
        expect(response.body.error).toContain('não encontrado');
      });
    });

    describe('PUT /api/menus/:id', () => {
      it('deve atualizar menu existente', async () => {
        // Arrange
        const created = await menuService.createMenu({ name: 'Menu', description: 'Desc' } as any);

        // Act
        const response = await request(app)
          .put(`/api/menus/${created.id}`)
          .send({
            name: 'Menu Atualizado',
            active: false,
          });

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Menu Atualizado');
        expect(response.body.active).toBe(false);
      });
    });

    describe('DELETE /api/menus/:id', () => {
      it('deve deletar menu existente', async () => {
        // Arrange
        const created = await menuService.createMenu({ name: 'Menu', description: 'Desc' } as any);

        // Act
        const response = await request(app).delete(`/api/menus/${created.id}`);

        // Assert
        expect(response.status).toBe(204);
        
        // Verify
        const get = await request(app).get(`/api/menus/${created.id}`);
        expect(get.status).toBe(404);
      });
    });
  });

  describe('Order Endpoints', () => {
    describe('POST /api/orders', () => {
      it('deve criar pedido novo com items', async () => {
        const response = await request(app)
          .post('/api/orders')
          .send({
            customerName: 'João',
            items: [
              { itemId: 1, quantity: 2, unitPrice: 25.50 },
              { itemId: 2, quantity: 1, unitPrice: 32.00 },
            ],
          });

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.customerName).toBe('João');
        expect(response.body.status).toBe('Pendente');
        expect(response.body.total).toBe(83.00);
      });

      it('deve retornar 400 se items vazio', async () => {
        const response = await request(app)
          .post('/api/orders')
          .send({
            customerName: 'João',
            items: [],
          });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('Settings Endpoints', () => {
    describe('GET /api/settings', () => {
      it('deve retornar todas as configurações', async () => {
        const response = await request(app).get('/api/settings');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  });
});
```

**Verificação**:
- [ ] Testes de integração executam com sucesso
- [ ] `npm test -- __tests__/integration/` com sucesso
- [ ] Coverage > 70% para integração
- [ ] Endpoints verificados funcionam corretamente

---

#### 4.2.5: Executar Suite Completa de Testes

```bash
cd /Users/feijao/development/cardapio/server

# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch (para desenvolvimento)
npm run test:watch

# Executar apenas testes de integração
npm run test:integration

# Executar testes com padrão específico
npm test -- MenuService.test.ts
```

**Verificação**:
- [ ] `npm test` retorna 0 erros
- [ ] Cobertura de linha > 80%
- [ ] Cobertura de branch > 75%
- [ ] Todos os testes passam em modo CI/CD

---

#### 4.2.6: Adicionar GitHub Actions (Opcional - CI/CD)

**Arquivo**: `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: cd server && npm install
      
      - name: Run tests
        run: cd server && npm test
      
      - name: Generate coverage report
        run: cd server && npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./server/coverage/coverage-final.json
```

**Verificação**:
- [ ] Workflow criado em `.github/workflows/test.yml`
- [ ] Será executado automaticamente em push
- [ ] Coverage será enviado para Codecov

---

## 🧹 FASE 5: Limpeza e Finalização

### ✅ Tarefa 5.1: Remover Código Antigo

**Delete:**
- [ ] `src/db/migrations/` (move para `migrations/`)
- [ ] Arquivos de rotas antigos se não refatorados

**Keep:**
- [ ] `src/middleware/upload.ts` (reutilize na infraestrutura)
- [ ] `src/db/database.ts` (base de dados ainda precisa)

---

### ✅ Tarefa 5.2: Atualizar Documentação

**Arquivo**: `GUIA_DESENVOLVIMENTO.md`

Adicionar seção nova sobre arquitetura:

```markdown
## 🏗️ Arquitetura do Backend

O backend segue **Clean Architecture** com princípios de **DDD Lite**:

### Camadas

1. **Domain Layer** (`domain/`)
   - Entidades puras (Menu, MenuItem, Order, Setting)
   - Lógica de negócio encapsulada
   - Interfaces de repositório (contratos)
   - Services com casos de uso

2. **Application Layer** (`application/`)
   - DTOs (Data Transfer Objects)
   - Validação de entrada e saída
   - Conversão Entity ↔ DTO

3. **Infrastructure Layer** (`infrastructure/`)
   - Implementações de repositório
   - Drivers de banco de dados
   - Middlewares Express
   - Rotas HTTP

4. **Core Layer** (`core/`)
   - Error handling centralizado
   - Tipos globais
   - Validadores reutilizáveis
   - Container de DI

### Fluxo de Requisição

```
HTTP Request
  ↓
Route Handler (orquestra)
  ↓
Middleware: asyncHandler (capta erros)
  ↓
DTOs (validam entrada)
  ↓
Service (lógica de negócio)
  ↓
Repository (abstração do banco)
  ↓
Database (SQLite)
  ↓
Response DTO (formata saída)
  ↓
Error Handler (se houver erro)
  ↓
HTTP Response
```

### Como Adicionar Nova Entidade

1. Criar `domain/nova/NovaEntity.ts`
2. Criar `domain/nova/NovaRepository.ts` (interface)
3. Criar `domain/nova/NovaService.ts`
4. Criar DTOs em `application/dtos/nova/`
5. Implementar repositório em `infrastructure/database/repositories/`
6. Criar rota em `infrastructure/http/routes/`
7. Registrar no container em `index.ts`
```

---

### ✅ Tarefa 5.3: Remover Este Plano

**Delete:**
- [ ] `PLANO_EXECUCAO.md`

**Motivo:** Quando refatoração completar, este documento não é mais necessário. Toda documentação arquitetural está em `ARQUITETURA_REFATORACAO.md`.

---

### ✅ Tarefa 5.4: Git Commit Final

```bash
git add .
git commit -m "refactor: aplicar Clean Architecture + DDD Lite no backend

- Criar domain layer com entities Menu, MenuItem, Order, Setting
- Criar application layer com DTOs
- Criar infrastructure layer com repositories concretos
- Refatorar rotas para usar services
- Adicionar error handling centralizado
- Implementar dependency injection simples
- Manter mesma interface HTTP (compatível com frontend)
"
```

---

## 📊 Checklist Final

### Código
- [ ] Todas as fases completadas
- [ ] Sem erros de compilação (`npm run dev` funciona)
- [ ] Todas as rotas testadas manualmente
- [ ] Comportamento idêntico ao código anterior
- [ ] Sem código antico deixado para trás

### Documentação
- [ ] `ARQUITETURA_REFATORACAO.md` criado e atualizado
- [ ] `GUIA_DESENVOLVIMENTO.md` atualizado com nova seção
- [ ] `PLANO_EXECUCAO.md` deletado
- [ ] Commits bem documentados

### Qualidade
- [ ] Estrutura segue Clean Architecture
- [ ] DDD Lite implementado corretamente
- [ ] SOLID principles respeitados
- [ ] Sem acoplamento desnecessário
- [ ] Código legível e bem organizado

---

## 🎯 Próximos Passos Após Conclusão

1. **Adicionar Testes Unitários**
   - Jest + Supertest
   - Testar services isoladamente

2. **Adicionar Testes de Integração**
   - Testar fluxos completos
   - Database em memória para testes

3. **Adicionar Zod/Joi para Validação**
   - Mais robusto que validação manual
   - Melhor DX

4. **Adicionar Documentação OpenAPI/Swagger**
   - Auto-gerada a partir do código
   - Facilita uso da API

5. **Migrar para NestJS (Opcional)**
   - Se projeto crescer bastante
   - Estrutura já preparada para isso

---

## 📈 ROADMAP DE MELHORIAS PÓS-REFATORAÇÃO

### 🚀 FASE 6: Validação Robusta com Zod (Prioridade: ALTA)

**Por que?** A validação manual em DTOs é propensa a erros. Zod oferece:
- ✅ Validação declarativa e type-safe
- ✅ Mensagens de erro customizadas
- ✅ Composição de schemas
- ✅ Integração com TypeScript automática

**Arquivos a criar:**
```
core/
  ├── validators/
  │   ├── menu.schema.ts
  │   ├── item.schema.ts
  │   ├── order.schema.ts
  │   └── setting.schema.ts
```

**Exemplo de implementação:**

```typescript
// core/validators/menu.schema.ts
import { z } from 'zod';

export const CreateMenuSchema = z.object({
  name: z.string()
    .min(1, 'Nome do menu é obrigatório')
    .max(255, 'Nome não pode ter mais de 255 caracteres')
    .trim(),
  description: z.string().optional().nullable(),
});

export const UpdateMenuSchema = CreateMenuSchema.partial();

export type CreateMenuInput = z.infer<typeof CreateMenuSchema>;
export type UpdateMenuInput = z.infer<typeof UpdateMenuSchema>;
```

**Refatorar DTOs para usar Zod:**

```typescript
// application/dtos/menu/CreateMenuDTO.ts - ANTES
export class CreateMenuDTO {
  name: string;
  constructor(data: any) {
    this.name = data?.name?.trim() || '';
    this.validate();
  }
  private validate(): void {
    if (!this.name) {
      throw new ValidationError('Nome do menu é obrigatório');
    }
  }
}

// application/dtos/menu/CreateMenuDTO.ts - DEPOIS
import { CreateMenuSchema, CreateMenuInput } from '../../../core/validators/menu.schema';

export class CreateMenuDTO implements CreateMenuInput {
  name: string;
  description?: string | null;

  constructor(data: unknown) {
    const validated = CreateMenuSchema.parse(data);
    this.name = validated.name;
    this.description = validated.description;
  }
}
```

**Middleware de validação:**

```typescript
// infrastructure/http/middleware/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../../../core/errors/AppError';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      req.body = validated.body;
      req.params = validated.params;
      req.query = validated.query;
      next();
    } catch (error: any) {
      const message = error.errors?.[0]?.message || 'Validação falhou';
      next(new ValidationError(message));
    }
  };
};
```

**Uso nas rotas:**

```typescript
// infrastructure/http/routes/menus.ts
router.post('/', 
  validateRequest(CreateMenuSchema),
  asyncHandler(async (req, res) => {
    const dto = new CreateMenuDTO(req.body); // Já validado
    const menu = await menuService.createMenu(dto);
    res.status(201).json(menu);
  })
);
```

**Estimativa:** 1-2 dias
**Ganhos:** 70% redução em código de validação, melhor segurança

---

### 🔐 FASE 7: Autenticação & Autorização (Prioridade: ALTA)

**Por que?** Admin view vs Customer view precisam de controle de acesso

**Implementação:**

```typescript
// domain/auth/Auth.ts
export class Auth {
  constructor(
    readonly userId: number,
    readonly role: 'admin' | 'customer',
    readonly token: string
  ) {}

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  hasPermission(resource: string, action: string): boolean {
    const permissions: Record<string, string[]> = {
      admin: ['read', 'create', 'update', 'delete'],
      customer: ['read'],
    };
    return permissions[this.role]?.includes(action) ?? false;
  }
}

// infrastructure/http/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../core/errors/AppError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Token não fornecido');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    next(new UnauthorizedError('Token inválido'));
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    throw new ForbiddenError('Acesso restrito a administradores');
  }
  next();
};
```

**Usar nas rotas:**

```typescript
// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const auth = await authService.login(req.body.password);
  res.json({ token: auth.token });
}));

// Proteger rotas admin
router.delete('/:id', authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  await menuService.deleteMenu(Number(req.params.id));
  res.status(204).send();
}));
```

**Estimativa:** 2-3 dias
**Ganhos:** Separação clara entre admin e customer, segurança aumentada

---

### 📊 FASE 8: Logging & Monitoring (Prioridade: MÉDIA)

**Por que?** Debug em produção é crítico

**Tecnologia recomendada:** Winston + Morgan

```bash
npm install winston morgan
```

```typescript
// core/logger/Logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Usar em services
logger.info('✅ Menu criado', { menuId: menu.id, name: menu.name });
logger.error('❌ Erro ao criar menu', { error: error.message });
```

**Middleware HTTP:**

```typescript
import morgan from 'morgan';

app.use(morgan('combined', {
  stream: fs.createWriteStream('logs/http.log', { flags: 'a' })
}));
app.use(morgan('dev')); // Console em desenvolvimento
```

**Estimativa:** 1-2 dias
**Ganhos:** Rastreabilidade total, debugging facilitado

---

### 🧪 FASE 9: E2E Tests com Cypress (Prioridade: MÉDIA)

**Por que?** Testes manuais são lentos e propensos a erros

```bash
npm install cypress --save-dev
```

```typescript
// cypress/e2e/menus.cy.ts
describe('Menu Management', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.login('admin', 'password');
  });

  it('deve criar novo menu', () => {
    cy.get('[data-testid="btn-new-menu"]').click();
    cy.get('input[name="name"]').type('Menu Especial');
    cy.get('textarea[name="description"]').type('Descrição do menu');
    cy.get('[data-testid="btn-save"]').click();
    cy.get('[data-testid="toast"]').should('contain', 'Menu criado com sucesso');
  });

  it('deve listar menus', () => {
    cy.get('[data-testid="menu-list"]')
      .should('be.visible')
      .find('[data-testid="menu-item"]')
      .should('have.length.greaterThan', 0);
  });

  it('deve deletar menu', () => {
    cy.get('[data-testid="menu-item"]').first().find('[data-testid="btn-delete"]').click();
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    cy.get('[data-testid="btn-confirm"]').click();
    cy.get('[data-testid="toast"]').should('contain', 'Menu deletado');
  });
});
```

**Estimativa:** 3-5 dias
**Ganhos:** Confiança no frontend, regressão detectada automaticamente

---

### 🔄 FASE 10: Paginação & Filtros (Prioridade: MÉDIA)

**Por que?** Performance com muitos registros

```typescript
// core/types/index.ts - ATUALIZADO
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// domain/menus/MenuRepository.ts - INTERFACE ATUALIZADA
export interface IMenuRepository {
  findPaginated(page: number, pageSize: number, filters?: MenuFilters): Promise<IPaginatedResponse<Menu>>;
}

// infrastructure/database/repositories/MenuRepository.ts
async findPaginated(
  page: number = 1,
  pageSize: number = 10,
  filters?: { search?: string; active?: boolean }
): Promise<IPaginatedResponse<Menu>> {
  let query = 'SELECT * FROM menus WHERE 1=1';
  const params: any[] = [];

  if (filters?.search) {
    query += ' AND name LIKE ?';
    params.push(`%${filters.search}%`);
  }

  if (filters?.active !== undefined) {
    query += ' AND active = ?';
    params.push(filters.active ? 1 : 0);
  }

  const total = await this.db.get(`SELECT COUNT(*) as count FROM (${query})`, params);
  
  const offset = (page - 1) * pageSize;
  query += ` LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);

  const rows = await this.db.all(query, params);
  
  return {
    data: rows.map(row => this.toDomain(row)),
    total: total.count,
    page,
    pageSize,
    hasNextPage: page * pageSize < total.count,
    hasPreviousPage: page > 1,
  };
}
```

**Usar nas rotas:**

```typescript
router.get('/', asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const search = req.query.search as string;
  const active = req.query.active === 'true';

  const result = await menuService.getMenusPaginated(page, pageSize, { search, active });
  res.json(result);
}));
```

**Estimativa:** 2-3 dias
**Ganhos:** Performance escalável, UX melhorada

---

### 📱 FASE 11: API REST Melhorada (Prioridade: BAIXA)

**Implementações recomendadas:**

1. **Soft Delete**
   ```typescript
   // Adicionar coluna deletedAt nas tabelas
   ALTER TABLE menus ADD COLUMN deleted_at DATETIME NULL;
   
   // Repository não retorna deletados por padrão
   async findAll() {
     const rows = await this.db.all('SELECT * FROM menus WHERE deleted_at IS NULL');
   }
   
   // Método de soft delete
   async softDelete(id: number) {
     await this.db.run('UPDATE menus SET deleted_at = NOW() WHERE id = ?', id);
   }
   ```

2. **Bulk Operations**
   ```typescript
   router.post('/bulk-delete', asyncHandler(async (req, res) => {
     const ids = req.body.ids as number[];
     await menuService.deleteMany(ids);
     res.json({ deleted: ids.length });
   }));
   ```

3. **ETags & Cache**
   ```typescript
   router.get('/:id', asyncHandler(async (req, res) => {
     const menu = await menuService.getMenuById(Number(req.params.id));
     const etag = crypto.createHash('md5').update(JSON.stringify(menu)).digest('hex');
     
     res.set('ETag', etag);
     if (req.headers['if-none-match'] === etag) {
       return res.status(304).send();
     }
     res.json(menu);
   }));
   ```

4. **HATEOAS (Optional)**
   ```typescript
   interface MenuResponseDTO {
     id: number;
     name: string;
     _links: {
       self: { href: string };
       items: { href: string };
       delete: { href: string };
     };
   }
   ```

**Estimativa:** 2-3 dias cada
**Ganhos:** API mais robusta, melhor performance

---

### 🎨 FASE 12: Documentação OpenAPI/Swagger (Prioridade: ALTA)

**Por que?** Documentação live é essencial para APIs

```bash
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

```typescript
// core/swagger/swaggerConfig.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cardápio API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de cardápios',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
      { url: 'https://api.cardapio.com', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/infrastructure/http/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

// src/index.ts
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './core/swagger/swaggerConfig';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**Documentar rotas:**

```typescript
/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: Lista todos os menus
 *     tags: [Menus]
 *     responses:
 *       200:
 *         description: Lista de menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 */
router.get('/', asyncHandler(async (req, res) => {
  const menus = await menuService.getAllMenus();
  res.json(menus);
}));
```

**Estimativa:** 2-3 dias
**Ganhos:** Documentação auto-gerada, melhor DX para usuários da API

---

### 🚀 FASE 13: Deploy & CI/CD (Prioridade: ALTA)

**Recomendações:**

1. **GitHub Actions para Deploy**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Build and push Docker image
           run: docker build -t cardapio-api:${{ github.sha }} .
         - name: Deploy to production
           run: docker run -d -p 3000:3000 cardapio-api:${{ github.sha }}
   ```

2. **Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   COPY server/package*.json ./
   RUN npm ci --only=production
   
   COPY server/src ./src
   COPY server/tsconfig.json ./
   
   RUN npm run build
   
   EXPOSE 3000
   CMD ["node", "dist/index.js"]
   ```

3. **Docker Compose para desenvolvimento**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     api:
       build: ./server
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=./database.sqlite
         - NODE_ENV=development
   ```

**Estimativa:** 3-5 dias
**Ganhos:** Deploy automático, rollback fácil, CI/CD maduro

---

### 🔧 FASE 14: Performance & Otimizações (Prioridade: MÉDIA)

**Implementações:**

1. **Query Caching com Redis**
   ```typescript
   // core/cache/CacheService.ts
   import Redis from 'redis';
   
   export class CacheService {
     private client = Redis.createClient();
   
     async get<T>(key: string): Promise<T | null> {
       const data = await this.client.get(key);
       return data ? JSON.parse(data) : null;
     }
   
     async set<T>(key: string, value: T, ttl: number = 3600) {
       await this.client.setex(key, ttl, JSON.stringify(value));
     }
   }
   ```

2. **Database Indexing**
   ```sql
   -- migrations/004_add_indexes.sql
   CREATE INDEX idx_menus_active ON menus(active);
   CREATE INDEX idx_items_menu_id ON items(menu_id);
   CREATE INDEX idx_orders_customer_name ON orders(customer_name);
   CREATE INDEX idx_orders_status ON orders(status);
   ```

3. **Query Optimization**
   ```typescript
   // Avoid N+1 queries
   async getMenusWithItems(menuIds: number[]) {
     const items = await this.db.all(
       'SELECT * FROM items WHERE menu_id IN (?, ?, ...)',
       menuIds
     );
     
     // Group by menuId
     const itemsByMenuId = new Map();
     items.forEach(item => {
       if (!itemsByMenuId.has(item.menu_id)) {
         itemsByMenuId.set(item.menu_id, []);
       }
       itemsByMenuId.get(item.menu_id).push(item);
     });
     
     return menus.map(menu => ({
       ...menu,
       items: itemsByMenuId.get(menu.id) || [],
     }));
   }
   ```

**Estimativa:** 3-5 dias
**Ganhos:** Redução de latência 50%+, melhor UX

---

### 📚 FASE 15: NestJS Migration (Prioridade: BAIXA - Futuro)

**Por que?** Se projeto crescer muito

**Vantagens:**
- ✅ DI out-of-the-box
- ✅ Decorators para validação/autenticação
- ✅ Guards, Pipes, Interceptors
- ✅ GraphQL support
- ✅ Melhor escalabilidade

**Esforço:** 5-10 dias (migração completa)

---

## 📊 Tabela de Priorização

| Fase | Melhoria | Prioridade | Esforço | ROI | Pré-requisito |
|------|----------|-----------|--------|-----|--------------|
| 6 | Zod Validation | ALTA | 1-2d | Alto | Refatoração |
| 7 | Auth & Authz | ALTA | 2-3d | Alto | Refatoração |
| 8 | Logging | MÉDIA | 1-2d | Médio | Refatoração |
| 9 | E2E Tests | MÉDIA | 3-5d | Médio | Testes Unit |
| 10 | Paginação | MÉDIA | 2-3d | Alto | Refatoração |
| 11 | REST Melhorada | BAIXA | 2-3d | Médio | Refatoração |
| 12 | Swagger | ALTA | 2-3d | Médio | Refatoração |
| 13 | CI/CD Deploy | ALTA | 3-5d | Alto | Testes |
| 14 | Performance | MÉDIA | 3-5d | Alto | Refatoração |
| 15 | NestJS | BAIXA | 5-10d | Médio | Futuro |

---

## 🗓️ Sugestão de Timeline

```
MESES 1-2 (Já em progresso)
├── Refatoração Clean Architecture (Semana 1-2)
├── Testes Unitários + Integração (Semana 2-3)
└── Correções de bugs descobertos (Semana 3-4)

MESES 2-3 (Depois da refatoração)
├── FASE 6: Zod Validation (Semana 1)
├── FASE 7: Auth & Authz (Semana 2-3)
├── FASE 12: Swagger (Semana 3)
└── FASE 13: CI/CD Deploy (Semana 4)

MESES 3-4 (Estabilização)
├── FASE 8: Logging (Semana 1)
├── FASE 10: Paginação (Semana 2)
├── FASE 14: Performance (Semana 3-4)
└── Melhorias conforme feedback (Contínuo)

MESES 5+ (Crescimento)
├── FASE 9: E2E Tests Cypress (Contínuo)
├── FASE 11: REST Melhorada (Conforme necessário)
├── Bug fixes e manutenção (Contínuo)
└── Avaliar FASE 15: NestJS Migration (Conforme crescimento)
```

---

## ✅ Checklist de Decisão

Antes de começar cada fase, responda:

- [ ] Refatoração principal foi **completada e validada**?
- [ ] **Testes automatizados** estão passando (>80% coverage)?
- [ ] **Documentação** está atualizada?
- [ ] **Feedback do cliente** foi incorporado?
- [ ] **Equipe está pronta** para próxima fase?
- [ ] **Infraestrutura** suporta a mudança?
- [ ] **Rollback plan** está definido?

---

**Roadmap criado em**: 23 de janeiro de 2026  
**Próxima revisão**: Após conclusão de FASE 4 (Integração)  
**Responsável**: Tech Lead / Arquiteto
