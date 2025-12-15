# Todos os Arquivos - Sistema de Pedidos com SQLite

Copie cada bloco de código para o arquivo correspondente.

---

## 📄 package.json
```json
{
  "name": "sistema-pedidos",
  "version": "1.0.0",
  "description": "Sistema de pedidos com visão cliente e admin usando React e SQLite",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sql.js": "^1.10.3",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/sql.js": "^1.4.9",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## 📄 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 📄 tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 📄 vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['sql.js']
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});
```

---

## 📄 postcss.config.js
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

---

## 📄 index.html
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Pedidos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 📄 .gitignore
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## 📄 src/main.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## 📄 src/App.tsx
```typescript
import { useState, useEffect } from 'react';
import { CustomerView } from './components/customer-view';
import { AdminView } from './components/admin-view';
import { Store, Settings } from 'lucide-react';
import { initDatabase } from './lib/database';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initDatabase().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleOrderPlaced = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando banco de dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-800 flex items-center gap-2">
              Sistema de Pedidos
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setView('customer')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'customer'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Store className="w-4 h-4" />
                Cliente
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'admin'
                    ? 'bg-slate-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {view === 'customer' ? (
        <CustomerView onOrderPlaced={handleOrderPlaced} />
      ) : (
        <AdminView refreshTrigger={refreshTrigger} />
      )}
    </div>
  );
}
```

---

## 📄 src/lib/database.ts

**IMPORTANTE**: Este é o arquivo principal que usa SQLite!

Copie o conteúdo completo do próximo bloco...

(continua no próximo comentário devido ao tamanho)
