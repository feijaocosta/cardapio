# 🛠️ Setup do Ambiente

## 📋 Pré-requisitos

- **Node.js**: 18.0 ou superior
- **npm**: 9.0 ou superior
- **Git**: Para clonar/versionamento
- **Navegador moderno**: Chrome, Firefox, Safari, Edge

---

## 🚀 Instalação Rápida

### 1. Clonar/Extrair Projeto

```bash
git clone <url-repositorio>
cd cardapio
```

### 2. Instalar Frontend

```bash
npm install
```

### 3. Instalar Backend

```bash
cd server
npm install
cd ..
```

### 4. Configurar Variáveis de Ambiente

```bash
# Backend (server/.env)
cd server
cat > .env << EOF
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
EOF
cd ..
```

### 5. Iniciar Aplicação

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
# Será exibido: "Servidor rodando em http://localhost:3000"
```

**Terminal 2 - Frontend**:
```bash
npm run dev
# Será exibido: "Local: http://localhost:5173"
```

### 6. Verificar

```bash
# Frontend
open http://localhost:5173

# Backend Health Check
curl http://localhost:3000/health
# Resposta: { "status": "ok" }
```

---

## 🔧 Configuração Detalhada

### Frontend Setup (vite.config.ts)

```typescript
// Variáveis de ambiente
VITE_API_URL=http://localhost:3000  // Desenvolvimento
VITE_API_URL=https://api.exemplo.com  // Produção
```

### Backend Setup (server/.env)

```
# Desenvolvimento
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database.sqlite

# Produção
PORT=8080
NODE_ENV=production
DATABASE_PATH=/var/lib/cardapio/database.sqlite
```

---

## 📦 Dependências Principais

### Frontend
```json
{
  "react": "^18.2.0",
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "tailwindcss": "^4.0.0"
}
```

### Backend
```json
{
  "express": "^4.18.0",
  "sqlite": "^5.0.0",
  "sqlite3": "^5.1.0",
  "typescript": "^5.3.0",
  "dotenv": "^16.3.0"
}
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Mudar porta frontend
npm run dev -- --port 3001

# Mudar porta backend
# Editar server/.env: PORT=3001
```

### Erro: "Cannot find module"

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

### API Connection Error

1. Verifique se backend está rodando: `curl http://localhost:3000/health`
2. Verifique CORS em `server/src/index.ts`
3. Verifique `VITE_API_URL` no frontend

### Database Lock Error

```bash
# Remover lock do SQLite
cd server
rm -f database.sqlite-shm database.sqlite-wal
npm run dev
```

---

## 📱 Desenvolvimento Local

### Acessar de Outro Dispositivo

```bash
# Terminal Backend
cd server
npm run dev -- --host

# Terminal Frontend
npm run dev -- --host

# Encontrar seu IP
# macOS/Linux: ifconfig | grep "inet "
# Windows: ipconfig

# Acessar do outro dispositivo
http://SEU_IP:5173
```

---

## ✅ Checklist

- [ ] Node.js 18+ instalado
- [ ] npm install (frontend) completado
- [ ] cd server && npm install completado
- [ ] server/.env configurado
- [ ] Backend rodando em :3000
- [ ] Frontend rodando em :5173
- [ ] Consegue acessar interface
- [ ] Consegue fazer pedido teste
- [ ] Admin consegue listar pedido

---

**Status**: ✅ Pronto para Desenvolvimento
