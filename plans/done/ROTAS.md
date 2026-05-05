# 📋 Plano de Implementação de Router

**Arquivo para abrir em nova janela de conversa**

---

## ✅ Status Atual Confirmado

- ❌ **NÃO há `react-router-dom`** no package.json
- ❌ **Navegação é feita por `useState`** (client-side state)
- ❌ **URL nunca muda** durante a navegação
- ✅ **Projeto usa React 18.2.0 + Vite + TypeScript**

---

## 🎯 Objetivo Final

**Implementar React Router para que:**
1. ✅ URL mude conforme navegação (`/`, `/menu/:menuId`, `/admin`)
2. ✅ Barra superior (navbar) **ONLY apareça em `/admin`**
3. ✅ Cliente vê interface limpa em `/` e `/menu/:menuId`
4. ✅ Admin vê barra de controle em `/admin/*`

---

## 📦 Fase 1: Instalação

### Terminal (na raiz do projeto):
```bash
npm install react-router-dom
```

### Verificar package.json:
```json
"dependencies": {
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x.x",  // ← Nova linha
  ...
}
```

---

## 🏗️ Fase 2: Estrutura de Arquivos

Criar/modificar estes arquivos:

```
src/
├── App.tsx                          (MODIFICAR)
├── main.tsx                         (MODIFICAR - envolver com BrowserRouter)
├── routes/
│   └── router.tsx                   (CRIAR)
├── views/
│   ├── CustomerView.tsx             (CRIAR ou extrair de App.tsx)
│   └── AdminView.tsx                (CRIAR ou extrair de App.tsx)
├── components/
│   ├── Navbar.tsx                   (MODIFICAR - adicionar verificação de rota)
│   └── customer-views/
│       └── image-based.tsx          (JÁ EXISTE)
└── ...
```

---

## 📝 Fase 3: Implementação (Ordem de Execução)

### **PASSO 1: Criar `src/routes/router.tsx`**

```tsx
import { RouteObject } from 'react-router-dom';
import CustomerView from '../views/CustomerView';
import AdminView from '../views/AdminView';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <CustomerView />,
  },
  {
    path: '/menu/:menuId',
    element: <CustomerView />,
  },
  {
    path: '/admin/*',
    element: <AdminView />,
  },
  {
    path: '*',
    element: <div>Página não encontrada - 404</div>,
  },
];
```

---

### **PASSO 2: Modificar main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

---

### **PASSO 3: Modificar App.tsx**

```tsx
import { Routes, Route } from 'react-router-dom'
import { routes } from './routes/router'

export default function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}
```

---

### **PASSO 4: Criar `src/views/CustomerView.tsx`**

```tsx
import { useParams } from 'react-router-dom'
import { ImageBasedLayout } from '../components/customer-views/image-based'
// import outros componentes necessários...
import { useState } from 'react'

export default function CustomerView() {
  const { menuId } = useParams()
  
  // TODO: Aqui vai toda a lógica que estava em App.tsx antes
  // useState para menus, selectedMenu, quantities, etc
  
  return (
    <ImageBasedLayout
      menus={menus}
      selectedMenu={selectedMenu}
      menuItems={menuItems}
      customerName={customerName}
      quantities={quantities}
      showSuccess={showSuccess}
      showPrice={showPrice}
      onSelectMenu={onSelectMenu}
      onBackToMenus={onBackToMenus}
      onCustomerNameChange={onCustomerNameChange}
      onQuantityChange={onQuantityChange}
      onSubmitOrder={onSubmitOrder}
      calculateTotal={calculateTotal}
    />
  )
}
```

---

### **PASSO 5: Criar `src/views/AdminView.tsx`**

```tsx
import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
// import outras views admin...

export default function AdminView() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          {/* Suas rotas admin aqui */}
          <Route path="/" element={<div>Admin Home</div>} />
          <Route path="/menus" element={<div>Gerenciar Cardápios</div>} />
          {/* ... */}
        </Routes>
      </main>
    </div>
  )
}
```

---

### **PASSO 6: Modificar `src/components/Navbar.tsx`**

```tsx
import { useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  // ❌ Navbar NÃO aparece em rotas do cliente
  if (location.pathname === '/' || location.pathname.startsWith('/menu/')) {
    return null
  }

  // ✅ Navbar só aparece em /admin
  return (
    <nav className="bg-stone-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sistema de Pedidos</h1>
        <div className="flex gap-4">
          {/* Seus botões aqui */}
          <button>Cardápios</button>
          <button>Pedidos</button>
          {/* ... */}
        </div>
      </div>
    </nav>
  )
}
```

---

## 🧪 Fase 4: Testes Locais

Após implementar, testar estas URLs no navegador:

```
✅ http://localhost:5173/              → Deve mostrar seleção de cardápios (SEM navbar)
✅ http://localhost:5173/menu/1        → Deve mostrar cardápio (SEM navbar)
✅ http://localhost:5173/admin         → Deve mostrar admin COM navbar
✅ http://localhost:5173/admin/menus   → Deve mostrar admin COM navbar
❌ http://localhost:5173/xyz           → Deve mostrar 404
```

---

## 🔄 Fase 5: Ajustes na Lógica de Navegação

### **Em `ImageBasedLayout` ou `CustomerView`:**

Trocar de:
```tsx
onSelectMenu={() => setSelectedMenu(menu)}
onBackToMenus={() => setSelectedMenu(null)}
```

Para:
```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

onSelectMenu={(menu) => navigate(`/menu/${menu.id}`)}
onBackToMenus={() => navigate('/')}
```

---

## ⚠️ Checklist de Implementação

- [ ] Instalar `react-router-dom`
- [ ] Criar arquivo `src/routes/router.tsx`
- [ ] Modificar main.tsx (envolver com `BrowserRouter`)
- [ ] Modificar App.tsx (usar `Routes` do router)
- [ ] Criar `src/views/CustomerView.tsx` (mover lógica do App)
- [ ] Criar `src/views/AdminView.tsx` (estrutura admin)
- [ ] Modificar `src/components/Navbar.tsx` (verificar rota com `useLocation`)
- [ ] Atualizar navegação com `useNavigate`
- [ ] Testar todas as URLs
- [ ] Verificar que navbar só aparece em `/admin`

---

## 📚 Dependências do Plano

**Preciso que você forneça:**
1. Arquivo App.tsx completo (atual)
2. Arquivo `src/components/Navbar.tsx` (ou onde está a barra)
3. Confirmação: Toda lógica de estado está em App.tsx?

---

## 🚀 Próximo Passo

**Abra uma NOVA janela de conversa** com:
1. Este arquivo como contexto
2. Os 3 arquivos solicitados acima
3. Sua resposta às 3 perguntas

**Mensagem para começar nova conversa:**
> "Vou implementar React Router no projeto. Aqui está o plano. Estou fornecendo App.tsx, Navbar.tsx e confirmando a estrutura."

---

**Data**: 26 de janeiro de 2026  
**Status**: 📋 Pronto para Nova Conversa