# 🎨 Arquitetura do Frontend

## 📌 Visão Geral

Frontend React + TypeScript que fornece interface para clientes fazerem pedidos e admins gerenciarem sistema.

```
┌─────────────────────────────────────┐
│      App.tsx (Componente Raiz)      │
├─────────────────────────────────────┤
│                                     │
│  Estado Global:                     │
│  - view (customer/admin)            │
│  - refreshTrigger                   │
│  - isLoading, error                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Navigation Bar            │   │
│  │   - Botão Cliente           │   │
│  │   - Botão Admin             │   │
│  └─────────────────────────────┘   │
│           │                         │
│     ┌─────┴─────┐                   │
│     │           │                   │
│     ▼           ▼                   │
│  ┌────────┐  ┌──────────┐          │
│  │Customer│  │Admin     │          │
│  │View    │  │View      │          │
│  └────────┘  └──────────┘          │
│                                     │
│  Chamadas HTTP via services/api.ts  │
└────────────┬────────────────────────┘
             │ fetch
             ▼
      Backend (Express)
```

---

## 🏗️ Estrutura de Pastas

```
src/
├── App.tsx                     # Componente raiz
│   ├── Estado global
│   ├── Inicializa banco
│   ├── Navigation bar
│   └── Renderização condicional
│
├── main.tsx                    # Entry point React
│
├── components/
│   ├── admin-view.tsx         # Painel administrativo
│   │   ├── Aba Pedidos
│   │   ├── Aba Cardápios
│   │   ├── Aba Itens
│   │   ├── Aba Configurações
│   │   └── MenuCard (sub-componente)
│   │
│   ├── customer-view.tsx      # Interface do cliente
│   │   ├── Seleção de cardápio
│   │   ├── Fazer pedido
│   │   └── Carrinho
│   │
│   ├── figma/
│   │   └── ImageWithFallback.tsx # Componente com fallback
│   │
│   └── ui/                    # 20+ Componentes reutilizáveis
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       ├── form.tsx
│       └── ... (mais 14)
│
├── lib/
│   └── storage.ts             # Wrapper localStorage
│
├── styles/
│   └── globals.css            # Tailwind CSS global
│       ├── Reset CSS
│       ├── Classes customizadas
│       └── Temas de cores
│
└── App.css (gerado)
```

---

## 🔄 Fluxo de Renderização

### Inicialização da Aplicação

```
1. main.tsx
   └─→ ReactDOM.createRoot(App)

2. App.tsx
   ├─→ useEffect [] → initDatabase()
   │   └─→ Verifica conectividade (GET /health)
   │       ├─→ Sucesso → setIsLoading(false)
   │       └─→ Erro → setError(message)
   │
   ├─→ Durante loading
   │   └─→ Mostra spinner
   │
   ├─→ Se erro
   │   └─→ Exibe mensagem de erro + botão retry
   │
   └─→ Pronto
       ├─→ Navigation bar
       └─→ Renderiza view (customer ou admin)
```

### Cliente Faz Pedido

```
1. CustomerView
   ├─→ useEffect [] → getActiveMenus()
   │   └─→ Carrega cardápios ativos
   │
   ├─→ Cliente clica em cardápio
   │   └─→ setSelectedMenu(menu)
   │
   ├─→ useEffect [selectedMenu] → getMenuItemsByMenuId()
   │   └─→ Carrega itens do cardápio
   │
   ├─→ Cliente adiciona itens ao carrinho
   │   └─→ updateQuantity(itemId, change)
   │
   ├─→ Cliente preenche nome e clica "Fazer Pedido"
   │   └─→ handleSubmitOrder()
   │       ├─→ Validação de dados
   │       ├─→ Chamada POST /orders
   │       ├─→ addOrder() via services/api.ts
   │       ├─→ Sucesso:
   │       │   ├─→ Reset form
   │       │   ├─→ showSuccess = true (3s)
   │       │   └─→ onOrderPlaced() → setRefreshTrigger++
   │       │
   │       └─→ Erro: alert()

2. App.tsx (recebe onOrderPlaced)
   └─→ setRefreshTrigger(prev + 1)
       └─→ Passa para AdminView via prop
           └─→ AdminView recarrega dados
               └─→ Novo pedido aparece na lista
```

---

## 📦 Componentes Principais

### 1. App.tsx

**Responsabilidades:**
- Estado global (view, refreshTrigger)
- Inicialização do banco
- Navigation bar
- Tratamento de erros

**Estado:**
```typescript
const [view, setView] = useState<'customer' | 'admin'>('customer');
const [refreshTrigger, setRefreshTrigger] = useState(0);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

---

### 2. CustomerView.tsx

**Responsabilidades:**
- Listar cardápios ativos
- Selecionar cardápio
- Fazer pedido
- Carrinho

**Fluxo:**
```
┌─────────────────────────────────┐
│ Tela 1: Seleção de Cardápio     │
│ - selectedMenu === null         │
│ - Mostra lista de menus         │
│ - Cliente clica em cardápio     │
│ - setSelectedMenu(menu)         │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Tela 2: Fazer Pedido            │
│ - selectedMenu !== null         │
│ - Mostra cardápio selecionado   │
│ - Mostra itens                  │
│ - Cliente adiciona quantidades  │
│ - Cliente preenche nome         │
│ - Cliente clica "Fazer Pedido"  │
└─────────────────────────────────┘
```

---

### 3. AdminView.tsx

**Responsabilidades:**
- Gerenciar pedidos
- Gerenciar cardápios
- Gerenciar itens
- Gerenciar configurações

**Tabs:**

#### Aba "Pedidos"
- Lista todos os pedidos (DESC por data)
- Mostra: cliente, data, total, itens

#### Aba "Cardápios"
- Criar novo cardápio
- Listar cardápios existentes
- Ativar/desativar
- Editar items do cardápio

#### Aba "Itens"
- Criar novo item
- Listar itens existentes
- Deletar item

#### Aba "Configurações"
- Toggle "Mostrar Preços"
- Seletor de tema (5 opções)
- Pré-visualização ao vivo

---

## 🎨 Sistema de Temas

### Definição de Temas (services/api.ts)

```typescript
export const AVAILABLE_THEMES = [
  {
    id: 'orange',
    name: 'Laranja',
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    gradient: 'from-orange-50 to-red-50',
    textPrimary: 'text-orange-600'
  },
  // ... mais 4 temas
];
```

### Aplicação de Temas

```typescript
// Obter tema ativo
const theme = AVAILABLE_THEMES.find(t => t.id === settings.theme) || AVAILABLE_THEMES[0];

// Usar em classes
<div className={`${theme.gradient} p-4`}>...</div>
<button className={`${theme.primary} ${theme.primaryHover}`}>...</button>
<h1 className={theme.textPrimary}>Título</h1>
```

---

## 📡 Integração com API (services/api.ts)

### Helper de Fetch

```typescript
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}
```

### Funções Organizadas

**Itens:**
```typescript
getMenuItems()
addMenuItem(item)
updateMenuItem(id, item)
removeMenuItem(id)
```

**Pedidos:**
```typescript
getOrders()
addOrder(order)
updateOrderStatus(orderId, status)
```

**Cardápios:**
```typescript
getMenus()
getActiveMenus()
addMenu(menu)
updateMenu(id, menu)
removeMenu(id)
getMenuItemsByMenuId(menuId)
addItemToMenu(menuId, itemId)
removeItemFromMenu(menuId, itemId)
```

**Configurações:**
```typescript
getSettings()
updateSettings(settings)
```

---

## 🔍 Tipos de Dados (TypeScript)

```typescript
interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface Order {
  id: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: string;
  menuId?: number;
}

interface Menu {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  active: boolean;
}

interface Settings {
  showPrices: boolean;
  theme: string;
}

interface Theme {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  gradient: string;
  textPrimary: string;
}
```

---

## 🚀 Padrões de Desenvolvimento Frontend

### Componente Funcional

```typescript
import { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  // 1. Estado
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Efeitos
  useEffect(() => {
    loadData();
  }, []);

  // 3. Handlers
  const loadData = async () => {
    try {
      setIsLoading(true);
      const result = await getMenuItems();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Render
  return (
    <div>
      <h1>{title}</h1>
      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 Estilização com Tailwind

### Uso de Classes

```typescript
// ✅ BOM - Usar Tailwind classes
<button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
  Clique
</button>

// ✅ BOM - Usar dynamic classes
<div className={`${theme.gradient} p-4`}>...</div>

// ❌ RUIM - Inline styles
<button style={{ padding: '8px 16px', backgroundColor: 'orange' }}>
  Clique
</button>
```

---

**Versão**: 2.0  
**Última Atualização**: Janeiro 2026
