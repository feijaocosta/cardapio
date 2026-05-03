# 🔄 Plano de Migração: Node.js/SQLite → PHP/Laravel/MySQL

**Data**: 2 de maio de 2026  
**Versão**: 1.0  
**Status**: Planejamento  
**Autor**: Análise via GitHub Copilot

---

## 📌 Resumo Executivo

Este documento define o plano completo para migrar o backend do **Sistema de Pedidos (Cardápio)** de `Node.js + Express + SQLite` para `PHP 8.2+ + Laravel 11 + MySQL 8`, **sem perder nenhuma funcionalidade**.

O frontend React **não precisa mudar** — Laravel fornecerá exatamente a mesma API REST que o Express fornece hoje.

---

## 🗺️ Visão Geral da Migração

### Stack Atual
| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js 18+ / Express.js |
| Banco de dados | SQLite (arquivo .sqlite) |
| ORM | SQL direto + sqlite npm |
| Testes | Jest (462 testes) |
| Upload de arquivos | Multer |
| Deploy | GCP VM / PM2 |

### Stack de Destino
| Camada | Tecnologia |
|--------|-----------|
| Backend | PHP 8.2+ / Laravel 11 |
| Banco de dados | MySQL 8.0+ |
| ORM | Eloquent ORM |
| Testes | PHPUnit + Pest PHP |
| Upload de arquivos | Laravel Storage (filesystem) |
| Deploy | GCP VM / PHP-FPM + Nginx |

### O que NÃO muda
- ✅ Frontend React (100% preservado)
- ✅ Todas as URLs da API (`/api/menus`, `/api/items`, `/api/orders`, `/api/settings`)
- ✅ Contratos de Request/Response (JSON idêntico)
- ✅ Regras de negócio (status de pedidos, preço opcional, configurações)
- ✅ Sistema de layouts múltiplos
- ✅ Upload de logos de cardápios

---

## 🏗️ Mapeamento de Arquitetura

### Correspondência de Camadas (Node → Laravel)

```
Node.js (Clean Architecture)          Laravel (MVC + Service Layer)
══════════════════════════════════════════════════════════════════

server/src/domain/menus/Menu.ts    →  app/Models/Menu.php (Eloquent)
server/src/domain/menus/MenuService.ts → app/Services/MenuService.php
server/src/domain/orders/Order.ts  →  app/Models/Order.php
server/src/domain/orders/OrderService.ts → app/Services/OrderService.php
server/src/domain/settings/        →  app/Models/Setting.php

server/src/application/dtos/       →  app/Http/Requests/ (Form Requests)

server/src/infrastructure/http/    →  app/Http/Controllers/
server/src/infrastructure/database/ → database/migrations/ + database/seeders/

server/src/container/Container.ts  →  app/Providers/AppServiceProvider.php (DI)
server/src/core/errors/            →  app/Exceptions/ (Laravel Exception Handler)

server/migrations/*.sql            →  database/migrations/*.php
```

---

## 📊 Mapeamento do Banco de Dados

### Schema SQLite → MySQL

Todas as tabelas são migradas sem perda de dados. Ajustes necessários:

```sql
-- SQLite usa INTEGER/AUTOINCREMENT → MySQL usa INT/AUTO_INCREMENT
-- SQLite usa REAL → MySQL usa DECIMAL(10, 2)
-- SQLite usa TEXT → MySQL usa VARCHAR ou TEXT
-- SQLite não tem ON UPDATE CURRENT_TIMESTAMP → MySQL suporta nativamente

-- 1. menus
CREATE TABLE menus (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL UNIQUE,
  description   TEXT NULL,
  logo_filename VARCHAR(255) NULL,
  active        TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. items (menu_items no sistema M2M)
CREATE TABLE items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  price       DECIMAL(10,2) NULL,          -- NULL = preço opcional (PRÉ-REQUISITO 2)
  description TEXT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. menu_items (relacionamento N:N)
CREATE TABLE menu_items (
  menu_id     INT UNSIGNED NOT NULL,
  item_id     INT UNSIGNED NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (menu_id, item_id),
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- 4. orders
CREATE TABLE orders (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  status        ENUM('Pendente','Em preparação','Pronto','Entregue','Cancelado')
                NOT NULL DEFAULT 'Pendente',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. order_items
CREATE TABLE order_items (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id   INT UNSIGNED NOT NULL,
  item_id    INT UNSIGNED NOT NULL,
  quantity   INT UNSIGNED NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id)  REFERENCES items(id)  ON DELETE RESTRICT
);

-- 6. settings
CREATE TABLE settings (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`      VARCHAR(100) NOT NULL UNIQUE,
  `value`    TEXT NOT NULL,
  `type`     VARCHAR(50) NOT NULL DEFAULT 'string',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 📡 Mapeamento Completo de Endpoints API

Todos os endpoints devem ser preservados **100% identicos** (URL + método HTTP + body + response).

### Endpoints Atuais (para preservar)

```
GET    /health
GET    /api/menus
GET    /api/menus?active=true
GET    /api/menus/:id
POST   /api/menus
PUT    /api/menus/:id
DELETE /api/menus/:id
GET    /api/items
GET    /api/items/:id
GET    /api/items/menu/:menuId        ← atenção: rota específica antes da genérica
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
POST   /api/menus/:menuId/items/:itemId    ← associar item ao menu
DELETE /api/menus/:menuId/items/:itemId   ← desassociar item do menu
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id/status
GET    /api/settings
GET    /api/settings/:key
PUT    /api/settings
POST   /api/settings/:key
```

### Mapeamento para Rotas Laravel (`routes/api.php`)

```php
// routes/api.php

Route::get('/health', [HealthController::class, 'check']);

// Menus
Route::apiResource('menus', MenuController::class);
Route::get('menus', [MenuController::class, 'index']);         // ?active=true suportado
Route::post('menus/{menu}/items/{item}', [MenuItemController::class, 'attach']);
Route::delete('menus/{menu}/items/{item}', [MenuItemController::class, 'detach']);

// Items
Route::get('items/menu/{menuId}', [ItemController::class, 'byMenu']); // específico primeiro!
Route::apiResource('items', ItemController::class);

// Orders
Route::get('orders', [OrderController::class, 'index']);
Route::get('orders/{order}', [OrderController::class, 'show']);
Route::post('orders', [OrderController::class, 'store']);
Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);

// Settings
Route::get('settings', [SettingController::class, 'index']);
Route::get('settings/{key}', [SettingController::class, 'show']);
Route::put('settings', [SettingController::class, 'updateBulk']);
Route::post('settings/{key}', [SettingController::class, 'upsert']);
```

---

## 🧱 Estrutura do Projeto Laravel

```
laravel-cardapio/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── API/
│   │   │   │   ├── HealthController.php
│   │   │   │   ├── MenuController.php
│   │   │   │   ├── ItemController.php
│   │   │   │   ├── MenuItemController.php  ← associações N:N
│   │   │   │   ├── OrderController.php
│   │   │   │   └── SettingController.php
│   │   │   └── Controller.php
│   │   ├── Requests/
│   │   │   ├── CreateMenuRequest.php       ← validação (substitui DTOs Node)
│   │   │   ├── UpdateMenuRequest.php
│   │   │   ├── CreateItemRequest.php
│   │   │   ├── UpdateItemRequest.php
│   │   │   ├── CreateOrderRequest.php
│   │   │   ├── UpdateOrderStatusRequest.php
│   │   │   └── UpdateSettingsRequest.php
│   │   └── Resources/
│   │       ├── MenuResource.php            ← serialização JSON (substitui ResponseDTOs)
│   │       ├── MenuCollection.php
│   │       ├── ItemResource.php
│   │       ├── OrderResource.php
│   │       └── SettingResource.php
│   │
│   ├── Models/
│   │   ├── Menu.php
│   │   ├── Item.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   └── Setting.php
│   │
│   ├── Services/
│   │   ├── MenuService.php
│   │   ├── ItemService.php
│   │   ├── OrderService.php
│   │   └── SettingService.php
│   │
│   └── Exceptions/
│       └── Handler.php                     ← tratamento global de erros
│
├── database/
│   ├── migrations/
│   │   ├── 2026_01_01_000001_create_menus_table.php
│   │   ├── 2026_01_01_000002_create_items_table.php
│   │   ├── 2026_01_01_000003_create_menu_items_table.php
│   │   ├── 2026_01_01_000004_create_orders_table.php
│   │   ├── 2026_01_01_000005_create_order_items_table.php
│   │   └── 2026_01_01_000006_create_settings_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── SettingsSeeder.php              ← dados iniciais de configuração
│
├── routes/
│   └── api.php                             ← todas as rotas da API
│
├── config/
│   └── cors.php                            ← CORS para o frontend React
│
└── storage/
    └── app/
        └── public/
            └── logos/                      ← uploads de logos dos menus
```

---

## 🔑 Regras de Negócio a Preservar

As seguintes regras devem ser implementadas no Laravel exatamente como estão hoje no Node.js:

### 1. Cardápios (Menus)
- `name` é obrigatório e único
- `active` é boolean (padrão: `true`)
- Um cardápio pode ter múltiplos itens (N:N)
- Upload de logo: suportado via multipart/form-data
- Logo armazenada como filename, servida via `/storage/logos/`

### 2. Itens (Items)
- `name` é obrigatório
- `price` é **opcional** (pode ser `null`) — **PRÉ-REQUISITO 2**
- Um item pode estar em múltiplos cardápios (N:N)
- Endpoint `GET /api/items/menu/:menuId` retorna itens do menu específico

### 3. Pedidos (Orders)
- `customer_name` é obrigatório (não pode ser vazio/whitespace)
- `items` é obrigatório e não pode ser array vazio — **PRÉ-REQUISITO**
- `status` é obrigatório com 5 valores válidos: `Pendente`, `Em preparação`, `Pronto`, `Entregue`, `Cancelado`
- Status padrão na criação: `Pendente`
- Mudança de status apenas pelo painel admin (endpoint `PATCH /orders/:id/status`)
- Criação de pedido é **transacional** (order + order_items em uma transação)
- `unit_price` é gravado no momento do pedido (snapshot do preço)

### 4. Configurações (Settings)
- Chave-valor genérico com suporte a tipos (`string`, `boolean`, `json`)
- Configurações iniciais obrigatórias:
  - `show_price` (boolean, padrão: `true`) — **PRÉ-REQUISITO 1**
  - `layout_model` (string, padrão: `'default'`) — **PRÉ-REQUISITO 1**
- Deve suportar criar/atualizar (upsert) sem erro se já existir

### 5. Tratamento de Erros
- 404: recurso não encontrado → `{ error: "Not found" }`
- 422: validação falhou → `{ errors: { campo: ["mensagem"] } }`
- 500: erro interno → `{ error: "Internal server error" }`
- CORS habilitado para o frontend React

---

## 📋 Plano de Execução por Fases

---

### ✅ FASE 0: Preparação do Ambiente (30 minutos)

**Pré-requisitos:**
```bash
# Verificar versões
php --version     # PHP 8.2+
composer --version
mysql --version   # MySQL 8.0+
```

**Instalar Laravel:**
```bash
composer create-project laravel/laravel cardapio-backend
cd cardapio-backend

# Instalar dependências úteis
composer require laravel/sanctum        # (opcional, para auth futura)
composer require --dev pestphp/pest    # testes com Pest PHP
composer require --dev pestphp/pest-plugin-laravel

# Configurar Pest
php artisan pest:install
```

**Configurar `.env`:**
```env
APP_NAME="Cardápio API"
APP_ENV=local
APP_KEY=                    # gerado por php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cardapio
DB_USERNAME=root
DB_PASSWORD=sua_senha

FILESYSTEM_DISK=public
```

---

### ✅ FASE 1: Banco de Dados e Models (2-3 horas)

#### Passo 1.1 — Criar as Migrations

```bash
php artisan make:migration create_menus_table
php artisan make:migration create_items_table
php artisan make:migration create_menu_items_table
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
php artisan make:migration create_settings_table
```

**Exemplo — `create_menus_table`:**
```php
Schema::create('menus', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->text('description')->nullable();
    $table->string('logo_filename')->nullable();
    $table->boolean('active')->default(true);
    $table->timestamps();
});
```

**Exemplo — `create_items_table`:**
```php
Schema::create('items', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->decimal('price', 10, 2)->nullable(); // PRÉ-REQUISITO 2: nullable
    $table->text('description')->nullable();
    $table->timestamps();
});
```

**Exemplo — `create_menu_items_table` (N:N):**
```php
Schema::create('menu_items', function (Blueprint $table) {
    $table->unsignedBigInteger('menu_id');
    $table->unsignedBigInteger('item_id');
    $table->primary(['menu_id', 'item_id']);
    $table->foreign('menu_id')->references('id')->on('menus')->cascadeOnDelete();
    $table->foreign('item_id')->references('id')->on('items')->cascadeOnDelete();
    $table->timestamp('created_at')->useCurrent();
});
```

**Exemplo — `create_orders_table`:**
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->string('customer_name');
    $table->enum('status', ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'])
          ->default('Pendente');
    $table->timestamps();
});
```

**Exemplo — `create_settings_table`:**
```php
Schema::create('settings', function (Blueprint $table) {
    $table->id();
    $table->string('key', 100)->unique();
    $table->text('value');
    $table->string('type', 50)->default('string');
    $table->timestamps();
});
```

**Executar:**
```bash
php artisan migrate
```

---

#### Passo 1.2 — Criar os Models Eloquent

**`app/Models/Menu.php`:**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
{
    protected $fillable = ['name', 'description', 'logo_filename', 'active'];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'menu_items');
    }
}
```

**`app/Models/Item.php`:**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Item extends Model
{
    protected $fillable = ['name', 'price', 'description'];

    protected $casts = [
        'price' => 'float',  // nullable float
    ];

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_items');
    }
}
```

**`app/Models/Order.php`:**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = ['customer_name', 'status'];

    const STATUSES = ['Pendente', 'Em preparação', 'Pronto', 'Entregue', 'Cancelado'];

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->orderItems->sum(fn($oi) => $oi->quantity * $oi->unit_price);
    }
}
```

**`app/Models/OrderItem.php`:**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    public $timestamps = false;

    protected $fillable = ['order_id', 'item_id', 'quantity', 'unit_price'];

    protected $casts = [
        'quantity'   => 'integer',
        'unit_price' => 'float',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
```

**`app/Models/Setting.php`:**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'type'];

    public function getTypedValueAttribute(): mixed
    {
        return match($this->type) {
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $this->value,
            'float'   => (float) $this->value,
            'json'    => json_decode($this->value, true),
            default   => $this->value,
        };
    }
}
```

---

#### Passo 1.3 — Seeder de Configurações Padrão

```php
// database/seeders/SettingsSeeder.php
Setting::upsert([
    ['key' => 'show_price',   'value' => 'true',    'type' => 'boolean'],
    ['key' => 'layout_model', 'value' => 'default', 'type' => 'string'],
], uniqueBy: ['key'], update: ['value', 'type']);
```

```bash
php artisan db:seed --class=SettingsSeeder
```

---

### ✅ FASE 2: Form Requests (Validação) (1-2 horas)

Substitui os DTOs do Node.js. O Laravel valida automaticamente antes de chegar ao controller.

**`CreateMenuRequest.php`:**
```php
public function rules(): array
{
    return [
        'name'        => 'required|string|max:255|unique:menus',
        'description' => 'nullable|string',
        'active'      => 'boolean',
    ];
}
```

**`CreateItemRequest.php`:**
```php
public function rules(): array
{
    return [
        'name'        => 'required|string|max:255',
        'price'       => 'nullable|numeric|min:0',  // PRÉ-REQUISITO 2: nullable
        'description' => 'nullable|string',
    ];
}
```

**`CreateOrderRequest.php`:**
```php
public function rules(): array
{
    return [
        'customer_name'        => 'required|string|min:1|max:255',
        'items'                => 'required|array|min:1',  // array não-vazio obrigatório
        'items.*.itemId'       => 'required|integer|exists:items,id',
        'items.*.quantity'     => 'required|integer|min:1',
        'items.*.unitPrice'    => 'required|numeric|min:0',
    ];
}
```

**`UpdateOrderStatusRequest.php`:**
```php
public function rules(): array
{
    return [
        'status' => 'required|string|in:Pendente,Em preparação,Pronto,Entregue,Cancelado',
    ];
}
```

---

### ✅ FASE 3: Services (Lógica de Negócio) (2-3 horas)

Os Services encapsulam a lógica de negócio, análogos aos Services e UseCases do Node.js.

**`app/Services/OrderService.php` (exemplo mais complexo):**
```php
<?php
namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Cria pedido + itens em uma transação atômica.
     * Análogo ao BEGIN TRANSACTION do Node.js.
     */
    public function create(string $customerName, array $items): Order
    {
        return DB::transaction(function () use ($customerName, $items) {
            $order = Order::create([
                'customer_name' => $customerName,
                'status'        => 'Pendente',
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'item_id'    => $item['itemId'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unitPrice'],
                ]);
            }

            return $order->load('orderItems.item');
        });
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);
        return $order->fresh();
    }
}
```

**`app/Services/MenuService.php`:**
```php
<?php
namespace App\Services;

use App\Models\Menu;
use Illuminate\Support\Facades\Storage;

class MenuService
{
    public function create(array $data, ?object $logoFile = null): Menu
    {
        if ($logoFile) {
            $data['logo_filename'] = $logoFile->store('logos', 'public');
        }
        return Menu::create($data);
    }

    public function update(Menu $menu, array $data, ?object $logoFile = null): Menu
    {
        if ($logoFile) {
            // Remove logo antiga se existir
            if ($menu->logo_filename) {
                Storage::disk('public')->delete($menu->logo_filename);
            }
            $data['logo_filename'] = $logoFile->store('logos', 'public');
        }
        $menu->update($data);
        return $menu->fresh();
    }

    public function delete(Menu $menu): void
    {
        if ($menu->logo_filename) {
            Storage::disk('public')->delete($menu->logo_filename);
        }
        $menu->delete();
    }
}
```

---

### ✅ FASE 4: Controllers (1-2 horas)

**`app/Http/Controllers/API/MenuController.php`:**
```php
<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function __construct(private MenuService $menuService) {}

    // GET /api/menus ou GET /api/menus?active=true
    public function index(Request $request): JsonResponse
    {
        $query = Menu::with('items');

        if ($request->boolean('active')) {
            $query->where('active', true);
        }

        return response()->json(MenuResource::collection($query->get()));
    }

    // GET /api/menus/:id
    public function show(Menu $menu): JsonResponse
    {
        return response()->json(new MenuResource($menu->load('items')));
    }

    // POST /api/menus
    public function store(CreateMenuRequest $request): JsonResponse
    {
        $menu = $this->menuService->create(
            $request->validated(),
            $request->file('logo')
        );

        return response()->json(new MenuResource($menu), 201);
    }

    // PUT /api/menus/:id
    public function update(UpdateMenuRequest $request, Menu $menu): JsonResponse
    {
        $menu = $this->menuService->update(
            $menu,
            $request->validated(),
            $request->file('logo')
        );

        return response()->json(new MenuResource($menu));
    }

    // DELETE /api/menus/:id
    public function destroy(Menu $menu): JsonResponse
    {
        $this->menuService->delete($menu);
        return response()->json(['message' => 'Menu deletado com sucesso']);
    }
}
```

**`app/Http/Controllers/API/OrderController.php`:**
```php
<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    // GET /api/orders
    public function index(): JsonResponse
    {
        $orders = Order::with('orderItems.item')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(OrderResource::collection($orders));
    }

    // GET /api/orders/:id
    public function show(Order $order): JsonResponse
    {
        return response()->json(new OrderResource($order->load('orderItems.item')));
    }

    // POST /api/orders
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->create(
            $request->customer_name,
            $request->items
        );

        return response()->json(new OrderResource($order), 201);
    }

    // PATCH /api/orders/:id/status
    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $order = $this->orderService->updateStatus($order, $request->status);
        return response()->json(new OrderResource($order));
    }
}
```

**`app/Http/Controllers/API/ItemController.php`:**
```php
<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;

class ItemController extends Controller
{
    // GET /api/items
    public function index(): JsonResponse
    {
        return response()->json(ItemResource::collection(Item::all()));
    }

    // GET /api/items/menu/:menuId  ← IMPORTANTE: registrar ANTES de show()
    public function byMenu(int $menuId): JsonResponse
    {
        $menu = Menu::findOrFail($menuId);
        $items = $menu->items()->get();
        return response()->json(ItemResource::collection($items));
    }

    // GET /api/items/:id
    public function show(Item $item): JsonResponse
    {
        return response()->json(new ItemResource($item));
    }

    // POST /api/items
    public function store(CreateItemRequest $request): JsonResponse
    {
        $item = Item::create($request->validated());
        return response()->json(new ItemResource($item), 201);
    }

    // PUT /api/items/:id
    public function update(UpdateItemRequest $request, Item $item): JsonResponse
    {
        $item->update($request->validated());
        return response()->json(new ItemResource($item));
    }

    // DELETE /api/items/:id
    public function destroy(Item $item): JsonResponse
    {
        $item->delete();
        return response()->json(['message' => 'Item deletado com sucesso']);
    }
}
```

**`app/Http/Controllers/API/SettingController.php`:**
```php
<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    // GET /api/settings
    public function index(): JsonResponse
    {
        return response()->json(Setting::all());
    }

    // GET /api/settings/:key
    public function show(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        return response()->json($setting);
    }

    // PUT /api/settings  (bulk update)
    public function updateBulk(Request $request): JsonResponse
    {
        $updated = [];
        foreach ($request->all() as $key => $value) {
            $setting = Setting::updateOrCreate(
                ['key' => $key],
                ['value' => (string) $value]
            );
            $updated[] = $setting;
        }
        return response()->json($updated);
    }

    // POST /api/settings/:key  (upsert individual)
    public function upsert(Request $request, string $key): JsonResponse
    {
        $request->validate(['value' => 'required']);

        $setting = Setting::updateOrCreate(
            ['key' => $key],
            ['value' => (string) $request->value]
        );

        return response()->json($setting, $setting->wasRecentlyCreated ? 201 : 200);
    }
}
```

---

### ✅ FASE 5: API Resources (Serialização JSON) (1 hora)

Garante que o JSON retornado é idêntico ao que o frontend React espera.

**`app/Http/Resources/MenuResource.php`:**
```php
<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'description'  => $this->description,
            'logo_filename'=> $this->logo_filename,
            'active'       => $this->active,
            'created_at'   => $this->created_at?->toISOString(),
            'updated_at'   => $this->updated_at?->toISOString(),
            'items'        => ItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
```

**`app/Http/Resources/OrderResource.php`:**
```php
<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'customerName'  => $this->customer_name,   // camelCase para o frontend
            'status'        => $this->status,
            'total'         => $this->total,            // atributo calculado
            'items'         => $this->whenLoaded('orderItems', function () {
                return $this->orderItems->map(fn($oi) => [
                    'itemId'    => $oi->item_id,
                    'name'      => $oi->item?->name,
                    'quantity'  => $oi->quantity,
                    'unitPrice' => $oi->unit_price,
                ]);
            }),
            'date'          => $this->created_at?->toISOString(),
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}
```

---

### ✅ FASE 6: Tratamento de Erros Global (30 minutos)

**`app/Exceptions/Handler.php`** (personalizar o handler padrão do Laravel):

```php
// Registrar no método register()
$this->renderable(function (ModelNotFoundException $e) {
    return response()->json(['error' => 'Recurso não encontrado'], 404);
});

$this->renderable(function (ValidationException $e) {
    return response()->json([
        'error'   => 'Dados inválidos',
        'errors'  => $e->errors(),
    ], 422);
});

$this->renderable(function (Throwable $e) {
    if (app()->environment('production')) {
        return response()->json(['error' => 'Erro interno do servidor'], 500);
    }
    // Em desenvolvimento, mostrar detalhes
    return response()->json([
        'error'   => $e->getMessage(),
        'trace'   => $e->getTrace(),
    ], 500);
});
```

---

### ✅ FASE 7: CORS (15 minutos)

**`config/cors.php`:**
```php
'allowed_origins' => [
    'http://localhost:5173',   // frontend dev
    'http://localhost:3000',   // alternativa
    env('FRONTEND_URL', '*'),  // produção via .env
],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

Registrar middleware em `bootstrap/app.php` (Laravel 11):
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```

---

### ✅ FASE 8: Upload de Arquivos (30 minutos)

O sistema atual usa Multer (Node.js) para upload de logos. Laravel tem o `Storage` facade.

```bash
# Criar link simbólico público
php artisan storage:link
```

**Servir logo via URL:**
```php
// No MenuResource, retornar URL completa
'logo_url' => $this->logo_filename
    ? Storage::disk('public')->url($this->logo_filename)
    : null,
```

**No frontend (services/api.ts)**, atualizar `getMenuLogoUrl()` para usar a URL retornada pela API em vez de construir manualmente.

---

### ✅ FASE 9: Testes com Pest PHP (2-3 horas)

Substitui os 462 testes Jest. Cobertura equivalente com Pest PHP.

```bash
# Estrutura de testes
tests/
├── Feature/
│   ├── MenuTest.php
│   ├── ItemTest.php
│   ├── OrderTest.php
│   ├── SettingTest.php
│   └── HealthTest.php
└── Unit/
    ├── Models/
    │   ├── MenuTest.php
    │   └── OrderTest.php
    └── Services/
        └── OrderServiceTest.php
```

**Exemplo — `tests/Feature/OrderTest.php`:**
```php
<?php

use App\Models\Item;
use App\Models\Order;

it('creates order with valid data', function () {
    $item = Item::factory()->create(['price' => 29.90]);

    $response = $this->postJson('/api/orders', [
        'customer_name' => 'João Silva',
        'items' => [
            ['itemId' => $item->id, 'quantity' => 2, 'unitPrice' => 29.90],
        ],
    ]);

    $response->assertStatus(201)
        ->assertJsonFragment(['customerName' => 'João Silva'])
        ->assertJsonFragment(['status' => 'Pendente']);
});

it('rejects order with empty items', function () {
    $response = $this->postJson('/api/orders', [
        'customer_name' => 'João',
        'items' => [],
    ]);

    $response->assertStatus(422)
        ->assertJsonStructure(['errors' => ['items']]);
});

it('rejects order without customer name', function () {
    $response = $this->postJson('/api/orders', [
        'customer_name' => '',
        'items' => [['itemId' => 1, 'quantity' => 1, 'unitPrice' => 10.00]],
    ]);

    $response->assertStatus(422);
});

it('updates order status via admin', function () {
    $order = Order::factory()->create(['status' => 'Pendente']);

    $response = $this->patchJson("/api/orders/{$order->id}/status", [
        'status' => 'Em preparação',
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment(['status' => 'Em preparação']);
});

it('rejects invalid status', function () {
    $order = Order::factory()->create();

    $response = $this->patchJson("/api/orders/{$order->id}/status", [
        'status' => 'StatusInvalido',
    ]);

    $response->assertStatus(422);
});
```

**Exemplo — `tests/Feature/SettingTest.php`:**
```php
it('show_price setting defaults to true', function () {
    $response = $this->getJson('/api/settings/show_price');
    $response->assertStatus(200)
        ->assertJsonFragment(['key' => 'show_price', 'value' => 'true']);
});

it('admin can toggle show_price', function () {
    $this->postJson('/api/settings/show_price', ['value' => 'false'])
         ->assertStatus(200);

    $this->getJson('/api/settings/show_price')
         ->assertJsonFragment(['value' => 'false']);
});
```

```bash
php artisan test
# ou
./vendor/bin/pest
```

---

### ✅ FASE 10: Deploy na VM GCP (1-2 horas)

A VM GCP já está configurada (IP: `34.41.59.79`, Debian 11). Adaptar para PHP:

```bash
# Na VM GCP
sudo apt update
sudo apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring \
                   php8.2-xml php8.2-bcmath php8.2-zip php8.2-gd \
                   mysql-server nginx

# Instalar Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Configurar MySQL
sudo mysql -u root
CREATE DATABASE cardapio;
CREATE USER 'cardapio'@'localhost' IDENTIFIED BY 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON cardapio.* TO 'cardapio'@'localhost';
FLUSH PRIVILEGES;

# Deploy da aplicação
cd /var/www
sudo git clone <repo> cardapio-backend
cd cardapio-backend
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# Permissões
sudo chown -R www-data:www-data /var/www/cardapio-backend/storage
sudo chmod -R 775 /var/www/cardapio-backend/storage
```

**Nginx config para Laravel:**
```nginx
server {
    listen 80;
    server_name _;
    root /var/www/cardapio-backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    }
}
```

---

## ⚠️ Pontos de Atenção Críticos

### 1. Ordem das Rotas — `/api/items/menu/:menuId` vs `/api/items/:id`
No Laravel, rotas são registradas na ordem declarada. A rota `/api/items/menu/{menuId}` **deve ser registrada antes** de `/api/items/{item}`, caso contrário o Laravel vai tentar converter `"menu"` em um Item model e retornar 404.

```php
// routes/api.php — ORDEM IMPORTA:
Route::get('items/menu/{menuId}', [ItemController::class, 'byMenu']); // ← primeiro!
Route::apiResource('items', ItemController::class);                    // ← depois
```

### 2. Campo `customer_name` vs `customerName`
O banco usa `snake_case` (`customer_name`), mas o frontend espera `camelCase` (`customerName`). O `OrderResource` deve fazer essa conversão explicitamente (já está no exemplo acima).

### 3. Upload de Logo — URL no Response
O frontend atual usa `getMenuLogoUrl()` em `services/api.ts` para construir a URL da logo. Com Laravel, o `MenuResource` deve retornar a URL completa (`logo_url`). Verificar se o frontend precisa de ajuste neste ponto.

### 4. Transação de Pedidos
A criação de pedido **DEVE ser transacional**. `DB::transaction()` no `OrderService` garante atomicidade entre criação do pedido e dos itens.

### 5. Configurações — `show_price` e `layout_model`
Estes dois settings devem ser criados pelo seeder. Caso contrário, o frontend vai receber 404 ao carregar a tela pela primeira vez.

### 6. CORS em Produção
O header `Access-Control-Allow-Origin` deve incluir o domínio do frontend em produção. Configurar via variável `FRONTEND_URL` no `.env`.

### 7. Preço Opcional — Serialização
O campo `price` no Item pode ser `null`. O `ItemResource` deve serializar como `null` (não como `0`), para que o frontend possa diferenciar "sem preço" de "preço zero".

---

## 🧪 Checklist de Validação Final

Antes de considerar a migração completa, verificar cada item:

### API Endpoints
- [ ] `GET /health` retorna `{ status: "OK" }`
- [ ] `GET /api/menus` retorna array de menus
- [ ] `GET /api/menus?active=true` retorna apenas menus ativos
- [ ] `POST /api/menus` cria cardápio com logo (multipart)
- [ ] `PUT /api/menus/:id` atualiza cardápio
- [ ] `DELETE /api/menus/:id` remove cardápio
- [ ] `GET /api/items` retorna todos os itens
- [ ] `GET /api/items/menu/:menuId` retorna itens do menu
- [ ] `POST /api/items` cria item SEM preço (`price: null`)
- [ ] `POST /api/orders` com items válidos retorna 201
- [ ] `POST /api/orders` com items vazio retorna 422
- [ ] `PATCH /api/orders/:id/status` muda status
- [ ] `GET /api/settings/show_price` retorna configuração
- [ ] `POST /api/settings/show_price` atualiza configuração

### Regras de Negócio
- [ ] Pedido sem items é rejeitado
- [ ] Pedido sem `customer_name` é rejeitado
- [ ] Status inválido de pedido é rejeitado
- [ ] Item com `price: null` é aceito e servido corretamente
- [ ] Configurações `show_price` e `layout_model` existem após seed
- [ ] Transação de pedido: falha em item_id inválido faz rollback

### Frontend (Sem Mudanças)
- [ ] Cliente vê cardápios ativos em `/`
- [ ] Cliente seleciona cardápio e vê itens
- [ ] Cliente faz pedido com sucesso
- [ ] Admin vê pedidos em `/admin`
- [ ] Admin muda status de pedido
- [ ] Admin vê/edita configurações (show_price, layout)
- [ ] Upload de logo de cardápio funciona

---

## 📊 Estimativa de Tempo Total

| Fase | Descrição | Tempo Estimado |
|------|-----------|---------------|
| 0 | Preparação do Ambiente | 30 min |
| 1 | Banco de Dados e Models | 2-3 h |
| 2 | Form Requests (Validação) | 1-2 h |
| 3 | Services (Lógica de Negócio) | 2-3 h |
| 4 | Controllers | 1-2 h |
| 5 | API Resources (Serialização) | 1 h |
| 6 | Tratamento de Erros Global | 30 min |
| 7 | CORS | 15 min |
| 8 | Upload de Arquivos | 30 min |
| 9 | Testes com Pest PHP | 2-3 h |
| 10 | Deploy na VM GCP | 1-2 h |
| **Total** | | **~12-17 horas** |

---

## 🔗 Dependências e Ordem de Execução Recomendada

```
FASE 0 (Ambiente)
   └─→ FASE 1 (Models + Migrations)
          └─→ FASE 2 (Form Requests)
                 └─→ FASE 3 (Services)
                        └─→ FASE 4 (Controllers)
                               └─→ FASE 5 (Resources)
                                      ├─→ FASE 6 (Erros)
                                      ├─→ FASE 7 (CORS)
                                      ├─→ FASE 8 (Uploads)
                                      └─→ FASE 9 (Testes)
                                             └─→ FASE 10 (Deploy)
```

---

## 📚 Referências

- [Laravel 11 Docs](https://laravel.com/docs/11.x)
- [Eloquent Relationships](https://laravel.com/docs/11.x/eloquent-relationships)
- [Laravel API Resources](https://laravel.com/docs/11.x/eloquent-resources)
- [Form Request Validation](https://laravel.com/docs/11.x/validation#form-request-validation)
- [Pest PHP](https://pestphp.com/)
- [Laravel Storage](https://laravel.com/docs/11.x/filesystem)

---

**Versão**: 1.0  
**Data**: 2 de maio de 2026  
**Status**: Pronto para Execução
