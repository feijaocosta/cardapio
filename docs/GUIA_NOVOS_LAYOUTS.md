# Guia: Adicionar Novos Layouts

⚠️ **IMPORTANTE**: Todos os novos layouts DEVEM ser colocados em `src/components/customer-views/` e NÃO na raiz do projeto!

## 📁 Estrutura Correta

```
src/
  └── components/
       └── customer-views/
            ├── index.ts                 ← Registro central de layouts
            ├── types.ts                 ← Tipos compartilhados
            ├── default.tsx              ← Layout padrão
            ├── modern.tsx               ← Layout moderno
            ├── seu-novo-layout.tsx      ← ✅ AQUI! (novo layout)
            └── outro-layout.tsx         ← ✅ AQUI! (outro novo layout)
```

⛔ **NÃO FAÇA ISSO**:
```
❌ components/
❌ customer-views/
❌ src/customer-views/
❌ Raiz do projeto / novo-layout.tsx
```

---

## 📝 Template Básico para um Novo Layout

Siga este template para criar um novo layout rapidamente:

```tsx
// filepath: src/components/customer-views/seu-layout.tsx
import { type CustomerViewLayoutProps } from './types';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

export function SeuLayout(props: CustomerViewLayoutProps) {
  const {
    menuItems,
    menus,
    customerName,
    quantities,
    showSuccess,
    isLoading,
    error,
    showPrice,
    onCustomerNameChange,
    onQuantityChange,
    onSubmitOrder,
    calculateTotal,
    getMenuLogoUrl,
  } = props;

  // Lógica local (se necessário)
  const total = calculateTotal();
  const hasItems = Object.values(quantities).some(q => q > 0);

  // Renderização
  return (
    <div className="min-h-screen bg-white">
      {/* Seu conteúdo aqui */}
    </div>
  );
}
```

## 🎨 Exemplos de Layouts para Adicionar

### 1. Layout "Minimal" (Compacto)

```tsx
// filepath: src/components/customer-views/minimal.tsx
import { type CustomerViewLayoutProps } from './types';
import { Plus, Minus } from 'lucide-react';

export function MinimalLayout({
  menuItems,
  customerName,
  quantities,
  showPrice,
  onCustomerNameChange,
  onQuantityChange,
  onSubmitOrder,
  calculateTotal,
  isLoading,
  error,
}: CustomerViewLayoutProps) {
  if (isLoading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  const hasItems = Object.values(quantities).some(q => q > 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={onSubmitOrder} className="space-y-4">
        <input
          type="text"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          placeholder="Nome"
          className="w-full px-3 py-2 border rounded"
          required
        />

        <div className="space-y-2">
          {menuItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-2 border-b">
              <span>{item.name}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onQuantityChange(item.id, -1)}
                  disabled={!quantities[item.id]}
                >
                  −
                </button>
                <span>{quantities[item.id] || 0}</span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasItems && (
          <div className="text-lg font-bold">
            Total: R$ {calculateTotal().toFixed(2)}
          </div>
        )}

        <button
          type="submit"
          disabled={!hasItems}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
}
```

### 2. Layout "Grid Premium" (Imagens grandes)

```tsx
// filepath: src/components/customer-views/premium.tsx
import { type CustomerViewLayoutProps } from './types';

export function PremiumLayout({
  menuItems,
  customerName,
  quantities,
  showPrice,
  onCustomerNameChange,
  onQuantityChange,
  onSubmitOrder,
  calculateTotal,
  isLoading,
  error,
}: CustomerViewLayoutProps) {
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  const hasItems = Object.values(quantities).some(q => q > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-900 mb-12 text-center">
          Seleções Premium
        </h1>

        <form onSubmit={onSubmitOrder} className="space-y-12">
          <input
            type="text"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Seu nome"
            className="w-full px-6 py-3 border-2 border-orange-300 rounded-lg"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-orange-900 mb-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  )}
                  {showPrice && (
                    <p className="text-2xl font-bold text-orange-600 mb-4">
                      R$ {item.price?.toFixed(2)}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onQuantityChange(item.id, -1)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded"
                      disabled={!quantities[item.id]}
                    >
                      −
                    </button>
                    <span className="font-bold text-lg">
                      {quantities[item.id] || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => onQuantityChange(item.id, 1)}
                      className="px-4 py-2 bg-orange-500 text-white rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasItems && (
            <div className="bg-orange-500 text-white p-6 rounded-xl text-center">
              <p className="text-sm opacity-90">TOTAL</p>
              <p className="text-4xl font-bold">
                R$ {calculateTotal().toFixed(2)}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!hasItems}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Fazer Pedido Premium
          </button>
        </form>
      </div>
    </div>
  );
}
```

## 🔧 Passo a Passo: Adicionar um Novo Layout

### 1️⃣ Criar o arquivo do layout

⚠️ **Lembre-se: sempre em `src/components/customer-views/`**

```bash
touch src/components/customer-views/meu-layout.tsx
```

### 2️⃣ Implementar o componente

Use o template acima e customize conforme necessário.

### 3️⃣ Registrar no index.ts

```tsx
// filepath: src/components/customer-views/index.ts
import { MeuLayout } from './meu-layout';

export type LayoutKey = 'default' | 'modern' | 'meu-layout';  // ← Adicionar aqui

export function getLayout(key: LayoutKey) {
  switch (key) {
    case 'default':
      return DefaultLayout;
    case 'modern':
      return ModernLayout;
    case 'meu-layout':
      return MeuLayout;  // ← Adicionar aqui
    default:
      return DefaultLayout;
  }
}
```

### 4️⃣ Usar no App.tsx ou em qualquer lugar

```tsx
<CustomerViewContainer layoutKey="meu-layout" />
```

## ✅ Checklist para Novo Layout

- [ ] Arquivo criado em `src/components/customer-views/`
- [ ] Nome do arquivo: `seu-layout.tsx` (minúsculo, com hífen)
- [ ] Implementa a interface `CustomerViewLayoutProps`
- [ ] Trata estados: `isLoading`, `error`, `showSuccess`
- [ ] Usa todos os handlers: `onSubmitOrder`, `onQuantityChange`, etc.
- [ ] Usa helpers: `calculateTotal()`, `getMenuLogoUrl()`
- [ ] Registrado no `LAYOUT_REGISTRY` em `index.ts`
- [ ] Adicionado ao tipo `LayoutKey`
- [ ] Testado com dados reais
- [ ] Responsivo (mobile, tablet, desktop)

## 🎭 Dicas de Design

### Paleta de Cores Recomendada
- **Primária**: Laranja (#f97316, #ea580c)
- **Secundária**: Azul (#3b82f6, #1d4ed8)
- **Sucesso**: Verde (#22c55e, #16a34a)
- **Fundo**: Branco ou tons claros

### Componentes Comuns
```tsx
// Botão de quantidade
<div className="flex items-center gap-2">
  <button onClick={() => onQuantityChange(id, -1)}>−</button>
  <span>{quantities[id]}</span>
  <button onClick={() => onQuantityChange(id, 1)}>+</button>
</div>

// Card de item
<div className="bg-white rounded-lg shadow p-4">
  {/* conteúdo */}
</div>

// Formulário
<form onSubmit={onSubmitOrder} className="space-y-4">
  {/* campos */}
</form>
```

## 🧪 Testando Seu Layout

1. **Local**: `<CustomerViewContainer layoutKey="meu-layout" />`
2. **Estados**: Teste com dados vazios, muitos itens, preços ocultos
3. **Responsividade**: Teste em mobile, tablet, desktop
4. **Performance**: Verifique com muitos itens (100+)

## 🚀 Publicar Novo Layout

Após validar seu layout:

1. Faça commit: `git commit -m "feat: add meu-layout"`
2. Atualize documentação se necessário
3. Considere adicionar ao settings para usuário escolher
