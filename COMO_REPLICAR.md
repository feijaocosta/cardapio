# 🎯 Como Replicar o Projeto Fora do Figma

## Opção 1: Copiar Manualmente (Recomendado)

### Passo 1: Criar estrutura
```bash
mkdir sistema-pedidos
cd sistema-pedidos
mkdir -p src/lib src/components src/styles
```

### Passo 2: Copiar arquivos

Você precisa criar 13 arquivos. Todos os códigos completos estão disponíveis em:

📄 **CODIGO_COMPLETO_TODOS_ARQUIVOS.txt** - Contém TODOS os códigos para copiar e colar

#### Arquivos da raiz:
1. `package.json` - Dependências do projeto
2. `tsconfig.json` - Configuração TypeScript
3. `tsconfig.node.json` - Configuração TypeScript Node
4. `vite.config.ts` - Configuração Vite
5. `postcss.config.js` - Configuração PostCSS/Tailwind
6. `index.html` - HTML principal
7. `.gitignore` - Arquivos ignorados pelo Git

#### Arquivos src/:
8. `src/main.tsx` - Entry point React
9. `src/App.tsx` - Componente principal
10. `src/lib/database.ts` - **Lógica SQLite (IMPORTANTE)**
11. `src/components/customer-view.tsx` - Visão do cliente
12. `src/components/admin-view.tsx` - Visão admin
13. `src/styles/globals.css` - Estilos globais

### Passo 3: Instalar e rodar
```bash
npm install
npm run dev
```

Abra: http://localhost:5173

---

## Opção 2: Arquivos Disponíveis no Figma Make

Se você está vendo isso no Figma Make, os seguintes arquivos já estão criados e podem ser copiados:

### ✅ Arquivos disponíveis:
- `/package.json`
- `/tsconfig.json`
- `/tsconfig.node.json`
- `/vite.config.ts`
- `/postcss.config.js`
- `/index.html`
- `/.gitignore`
- `/src/main.tsx`
- `/src/App.tsx`
- `/src/lib/database.ts` ⭐ **SQLITE AQUI**
- `/src/components/customer-view.tsx`
- `/src/components/admin-view.tsx`
- `/src/styles/globals.css`

### Como copiar:
1. Abra cada arquivo no Figma Make
2. Copie todo o conteúdo
3. Cole no arquivo correspondente no seu projeto local

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sql.js": "^1.10.3",           ← SQLite WebAssembly
    "lucide-react": "^0.300.0"      ← Ícones
  }
}
```

---

## 🗄️ Sobre o SQLite

### O que é sql.js?
- SQLite compilado para WebAssembly
- Roda 100% no navegador (sem servidor)
- Usa queries SQL reais (SELECT, INSERT, etc)
- Persiste dados no localStorage

### Estrutura do Banco:

**menu_items** (Cardápio)
```sql
CREATE TABLE menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT
);
```

**orders** (Pedidos)
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  total REAL NOT NULL,
  date TEXT NOT NULL
);
```

**order_items** (Itens dos Pedidos)
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 🐛 Problemas Comuns

### Erro: "Cannot find module 'sql.js'"
```bash
npm install sql.js @types/sql.js
```

### Erro: TypeScript
```bash
npm install -D typescript @types/react @types/react-dom @types/sql.js
```

### Erro: Tailwind não funciona
```bash
npm install -D tailwindcss@4.0.0 postcss autoprefixer
```

### Banco não persiste
- Verifique se o localStorage não está bloqueado
- Abra DevTools > Application > Local Storage
- Procure por chave "sqliteDb"

---

## ✅ Checklist Final

- [ ] Node.js 18+ instalado
- [ ] 13 arquivos criados
- [ ] `npm install` sem erros
- [ ] `npm run dev` inicia
- [ ] Navegador abre em localhost:5173
- [ ] Visão Cliente funciona
- [ ] Visão Admin funciona
- [ ] Pode adicionar itens no cardápio
- [ ] Pode fazer pedidos
- [ ] Dados persistem após F5

---

## 📚 Documentação Adicional

- **README.md** - Documentação completa do projeto
- **SETUP_COMPLETO.md** - Guia detalhado de setup
- **CODIGO_COMPLETO_TODOS_ARQUIVOS.txt** - Todos os códigos para copiar
- **GUIA_COMPLETO_REPLICACAO.md** - Guia passo a passo

---

## 🎉 Sucesso!

Depois de seguir estes passos, você terá um sistema de pedidos completo funcionando com:

✅ SQLite real (via WebAssembly)  
✅ Persistência de dados  
✅ Visão Cliente (Cardápio)  
✅ Visão Admin (Gestão + Pedidos)  
✅ React + TypeScript  
✅ Tailwind CSS  

---

## 📞 Suporte

Se tiver problemas:
1. Verifique a versão do Node.js: `node --version` (deve ser 18+)
2. Delete node_modules e reinstale: `rm -rf node_modules && npm install`
3. Limpe o cache do navegador
4. Verifique o console do navegador (F12)

---

**Desenvolvido com ❤️ usando Figma Make**
