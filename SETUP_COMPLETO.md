# Setup Completo - Sistema de Pedidos

## 📋 Lista Completa de Arquivos Necessários

Para replicar este projeto fora do Figma Make, você precisa criar os seguintes arquivos:

### Arquivos de Configuração (Raiz)
```
/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── postcss.config.js
├── index.html
├── .gitignore
└── README.md
```

### Arquivos de Código (src/)
```
src/
├── main.tsx
├── App.tsx
├── lib/
│   └── database.ts
├── components/
│   ├── customer-view.tsx
│   └── admin-view.tsx
└── styles/
    └── globals.css
```

## 🛠️ Passo a Passo Completo

### 1. Criar a estrutura de pastas

```bash
mkdir sistema-pedidos
cd sistema-pedidos
mkdir -p src/lib src/components src/styles
```

### 2. Copiar todos os arquivos

Copie o conteúdo de cada arquivo listado abaixo para seu respectivo caminho.

### 3. Instalar dependências

```bash
npm install
```

Isso irá instalar automaticamente:
- react@^18.2.0
- react-dom@^18.2.0
- sql.js@^1.10.3
- lucide-react@^0.300.0
- E todas as devDependencies necessárias

### 4. Executar o projeto

```bash
npm run dev
```

Abra http://localhost:5173 no navegador.

## 📦 Dependências do package.json

### Dependencies (Produção)
- **react**: Framework UI
- **react-dom**: Renderização React no DOM
- **sql.js**: SQLite compilado para WebAssembly
- **lucide-react**: Biblioteca de ícones

### DevDependencies (Desenvolvimento)
- **@types/react**: Tipos TypeScript para React
- **@types/react-dom**: Tipos TypeScript para ReactDOM
- **@types/sql.js**: Tipos TypeScript para sql.js
- **@vitejs/plugin-react**: Plugin Vite para React
- **typescript**: Compilador TypeScript
- **vite**: Build tool e dev server
- **tailwindcss**: Framework CSS
- **autoprefixer**: PostCSS plugin
- **postcss**: Processador CSS

## 🎯 Diferenças vs Figma Make

### No Figma Make:
- Usa localStorage simples
- Estrutura de pastas sem `src/`
- Configuração interna do Vite

### Fora do Figma (Este setup):
- Usa SQLite real (sql.js)
- Estrutura de pastas padrão React (`src/`)
- Configuração completa do Vite, TypeScript e PostCSS
- Controle total sobre dependências

## 🗄️ SQLite vs LocalStorage

### Vantagens do SQLite (sql.js):
✅ Queries SQL reais (SELECT, INSERT, UPDATE, DELETE)
✅ Relacionamentos entre tabelas (FOREIGN KEYS)
✅ Suporte a transações
✅ Estrutura de dados normalizada
✅ Mais robusto para dados complexos

### Como funciona:
1. sql.js carrega o SQLite compilado em WebAssembly
2. Banco roda completamente no navegador (client-side)
3. Dados são persistidos no localStorage automaticamente
4. Sem necessidade de servidor backend

## 🔍 Verificação do Setup

Após instalar, verifique se tudo está funcionando:

```bash
# 1. Verificar instalação
npm list

# 2. Verificar TypeScript
npx tsc --version

# 3. Iniciar dev server
npm run dev

# 4. Build para produção (teste)
npm run build
```

## 🐛 Troubleshooting

### Erro: "Cannot find module 'sql.js'"
```bash
npm install sql.js
```

### Erro: Tailwind CSS não funciona
```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

### Erro: Tipos TypeScript
```bash
npm install -D @types/react @types/react-dom @types/sql.js
```

### Browser não carrega sql.js
Verifique se há bloqueio CORS. O sql.js carrega de:
`https://sql.js.org/dist/sql-wasm.wasm`

Para produção, baixe e sirva localmente:
```bash
npm install sql.js
# Os arquivos WASM estarão em node_modules/sql.js/dist/
```

## 📝 Customização para Produção

### 1. Hospedar sql.js localmente

Edite `src/lib/database.ts`:

```typescript
const SQL = await initSqlJs({
  locateFile: (file) => `/sql-wasm/${file}` // Caminho local
});
```

Copie os arquivos WASM:
```bash
mkdir public/sql-wasm
cp node_modules/sql.js/dist/sql-wasm.wasm public/sql-wasm/
cp node_modules/sql.js/dist/sql-wasm.js public/sql-wasm/
```

### 2. Aumentar limite de dados

Por padrão, localStorage tem limite de ~5MB. Para mais dados:
- Use IndexedDB ao invés de localStorage
- Ou implemente um backend real com banco de dados

### 3. Adicionar autenticação

Para sistema real, adicione:
- Login de usuário
- Proteção da área admin
- JWT tokens
- Backend API

## 🚀 Próximos Passos Sugeridos

1. **Backend Real**: Node.js + Express + SQLite/PostgreSQL
2. **Autenticação**: Clerk, Auth0 ou Firebase Auth
3. **API REST**: Endpoints para CRUD de pedidos e menu
4. **Deploy**: Vercel (frontend) + Railway/Render (backend)
5. **Recursos Avançados**:
   - Notificações em tempo real
   - Sistema de impressão de pedidos
   - Dashboard com gráficos
   - Exportar relatórios

## 📞 Suporte

Se tiver problemas:
1. Verifique as versões do Node.js (18+)
2. Delete `node_modules` e `package-lock.json`, reinstale
3. Limpe o cache do navegador
4. Verifique o console do navegador para erros

## ✅ Checklist Final

- [ ] Node.js 18+ instalado
- [ ] Todas as pastas criadas
- [ ] Todos os arquivos copiados
- [ ] `npm install` executado com sucesso
- [ ] `npm run dev` inicia sem erros
- [ ] Navegador abre em localhost:5173
- [ ] Consegue adicionar itens no admin
- [ ] Consegue fazer pedidos como cliente
- [ ] Dados persistem após refresh da página

---

**Pronto!** Seu sistema de pedidos está funcionando localmente com SQLite real! 🎉
