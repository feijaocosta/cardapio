# 📦 Guia de Instalação - Sistema de Pedidos

## Pré-requisitos

- **Node.js** versão 18.0 ou superior
- **npm** versão 9.0 ou superior (vem com Node.js)

---

## 🚀 Instalação Rápida

### 1. Clone ou Baixe o Projeto

Se você recebeu os arquivos em um ZIP:
```bash
# Extraia o ZIP e entre na pasta
cd sistema-pedidos
```

Se está usando Git:
```bash
git clone <url-do-repositorio>
cd sistema-pedidos
```

### 2. Instale as Dependências

```bash
npm install
```

Este comando irá instalar:
- React e React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- sql.js (SQLite para navegador)
- lucide-react (ícones)
- vite-plugin-static-copy (para copiar arquivos .wasm)

### 3. Execute em Modo Desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em: **http://localhost:5173**

### 4. Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão na pasta `dist/`

### 5. Visualizar Build de Produção

```bash
npm run preview
```

---

## 📁 Estrutura de Arquivos

```
sistema-pedidos/
├── src/
│   ├── components/
│   │   ├── admin-view.tsx       # Painel administrativo
│   │   └── customer-view.tsx    # Interface do cliente
│   ├── lib/
│   │   └── database.ts          # Lógica do banco SQLite
│   ├── styles/
│   │   └── globals.css          # Estilos globais
│   ├── App.tsx                  # Componente principal
│   └── main.tsx                 # Entry point
├── public/                      # Arquivos públicos
├── index.html                   # HTML principal
├── package.json                 # Dependências
├── tsconfig.json               # Config TypeScript
├── vite.config.ts              # Config Vite
├── postcss.config.js           # Config PostCSS
└── tailwind.config.js          # Config Tailwind (se existir)
```

---

## 🔧 Configuração do Vite

O arquivo `vite.config.ts` já está configurado para:

1. **Copiar arquivos .wasm do sql.js**
```typescript
viteStaticCopy({
  targets: [{
    src: 'node_modules/sql.js/dist/sql-wasm.wasm',
    dest: 'assets'
  }]
})
```

2. **Headers CORS para sql.js**
```typescript
server: {
  headers: {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp'
  }
}
```

---

## 🐛 Resolução de Problemas

### Erro: "Cannot find module 'sql.js'"

**Solução:**
```bash
npm install sql.js @types/sql.js
```

### Erro: "Cannot find module 'vite-plugin-static-copy'"

**Solução:**
```bash
npm install -D vite-plugin-static-copy
```

### Erro: "Module not found: Error: Can't resolve 'sql-wasm.wasm'"

**Solução:**
1. Verifique se o plugin vite-plugin-static-copy está instalado
2. Execute `npm run build` novamente
3. O arquivo .wasm deve estar em `dist/assets/sql-wasm.wasm`

### Erro ao carregar página em branco

**Solução:**
1. Abra o Console do navegador (F12)
2. Verifique erros de CORS
3. Em desenvolvimento, use `npm run dev` (não abra o index.html diretamente)
4. Em produção, use `npm run preview` ou sirva via servidor web

### localStorage está cheio

**Solução:**
```javascript
// Abra o Console do navegador e execute:
localStorage.removeItem('sqliteDb');
// Depois recarregue a página
```

---

## 🌐 Deploy

### Opção 1: Vercel (Recomendado)

1. Crie conta em https://vercel.com
2. Conecte seu repositório Git
3. Vercel detecta automaticamente o Vite
4. Deploy automático!

### Opção 2: Netlify

1. Crie conta em https://netlify.com
2. Arraste a pasta `dist/` após executar `npm run build`
3. Ou conecte seu repositório Git

### Opção 3: GitHub Pages

```bash
# Instale gh-pages
npm install -D gh-pages

# Adicione ao package.json:
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Execute:
npm run deploy
```

### Opção 4: Servidor Próprio

1. Execute `npm run build`
2. Copie a pasta `dist/` para seu servidor
3. Configure o servidor para:
   - Servir `index.html` para todas as rotas
   - Adicionar headers CORS corretos
   - Servir arquivos .wasm com MIME type correto

**Exemplo Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /caminho/para/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cross-Origin-Opener-Policy same-origin;
        add_header Cross-Origin-Embedder-Policy require-corp;
    }
    
    location ~* \.wasm$ {
        add_header Content-Type application/wasm;
    }
}
```

---

## 📱 Testando em Dispositivos Móveis

### Desenvolvimento Local

1. Execute `npm run dev`
2. Encontre seu IP local:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` ou `ip addr`
3. Acesse de outro dispositivo: `http://SEU_IP:5173`

### Ajustar Vite para aceitar conexões externas

```bash
npm run dev -- --host
```

Ou edite `vite.config.ts`:
```typescript
server: {
  host: true,
  port: 5173
}
```

---

## 🔐 Segurança

### Dados Locais

- Todos os dados são salvos no **localStorage** do navegador
- Não há servidor backend
- Dados persistem apenas no dispositivo do usuário

### Limitações

- **Máximo de ~5-10MB** de dados no localStorage
- Dados podem ser **apagados** ao limpar cache do navegador
- **Não é recomendado** para dados sensíveis ou críticos

### Backup de Dados

Para fazer backup manual:

1. Abra o Console do navegador (F12)
2. Execute:
```javascript
// Exportar dados
const backup = localStorage.getItem('sqliteDb');
console.log(backup);
// Copie o resultado

// Importar dados
localStorage.setItem('sqliteDb', 'COLE_AQUI_O_BACKUP');
location.reload();
```

---

## 🎓 Aprendendo Mais

### Tecnologias Utilizadas

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **sql.js**: https://sql.js.org
- **Lucide Icons**: https://lucide.dev

### Recursos de Aprendizado

- Tutorial React: https://react.dev/learn
- Documentação Vite: https://vitejs.dev/guide/
- Guia Tailwind: https://tailwindcss.com/docs
- TypeScript Handbook: https://www.typescriptlang.org/docs/

---

## 📋 Checklist de Instalação

- [ ] Node.js instalado (versão 18+)
- [ ] npm instalado
- [ ] Projeto baixado/clonado
- [ ] `npm install` executado com sucesso
- [ ] `npm run dev` funciona
- [ ] Página abre em http://localhost:5173
- [ ] Banco de dados SQLite inicializa
- [ ] Consegue alternar entre visão Cliente e Admin
- [ ] Consegue criar itens no admin
- [ ] Consegue fazer pedidos no cliente

---

## 🆘 Obtendo Ajuda

Se encontrar problemas:

1. **Verifique o Console**: Abra F12 e veja erros
2. **Limpe node_modules**: 
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. **Limpe cache do Vite**:
   ```bash
   rm -rf .vite
   npm run dev
   ```
4. **Reinicie tudo**:
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

---

## ✅ Sistema Funcionando?

Se tudo está funcionando, você deve conseguir:

- ✅ Abrir a interface do cliente
- ✅ Selecionar um cardápio
- ✅ Adicionar itens ao pedido
- ✅ Fazer um pedido
- ✅ Alternar para visão Admin
- ✅ Ver o pedido na lista
- ✅ Criar novos cardápios
- ✅ Adicionar/remover itens
- ✅ Alterar configurações e temas

**Parabéns! 🎉 O sistema está pronto para uso!**

---

**Versão**: 2.0  
**Última Atualização**: Dezembro 2024
