# 📄 README - Sistema de Pedidos v2.0

## 🎯 Bem-vindo!

Documentação consolidada e organizada para o Sistema de Pedidos com Backend (Express) + Frontend (React).

---

## 👨‍💻 Para Desenvolvedores

### 1️⃣ **[PROJETO_SINTESE.md](PROJETO_SINTESE.md)** ← COMECE AQUI
- Síntese executiva do projeto
- Stack tecnológico (React, Node.js, SQLite)
- Visão geral da arquitetura
- Funcionalidades principais
- ⏱️ Tempo: **5 minutos**

### 2️⃣ **[SETUP_AMBIENTE.md](SETUP_AMBIENTE.md)**
- Pré-requisitos (Node.js, npm)
- Instalação rápida (frontend + backend)
- Configuração de variáveis de ambiente
- Troubleshooting comum
- ⏱️ Tempo: **10 minutos**

### 3️⃣ **[GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md)**
- Convenções de código
- Padrões de componentes (React e Express)
- Estrutura de arquivos
- Validação e tratamento de erros
- TypeScript best practices
- ⏱️ Tempo: **20 minutos**

---

## 🏗️ Para Arquitetos & Leads

### 4️⃣ **[ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md)**
- Estrutura do servidor Express
- Database module (SQLite + migrations)
- Rotas da API (5 endpoints principais)
- Padrões de desenvolvimento backend
- ⏱️ Tempo: **15 minutos**

### 5️⃣ **[ARQUITETURA_FRONTEND.md](ARQUITETURA_FRONTEND.md)**
- Estrutura do React
- Componentes principais (App, CustomerView, AdminView)
- Fluxo de dados e renderização
- Sistema de temas
- ⏱️ Tempo: **15 minutos**

### 6️⃣ **[BANCO_DADOS.md](BANCO_DADOS.md)**
- Schema SQLite completo (7 tabelas)
- Relacionamentos (M2M, 1:M)
- Sistema de migrations
- Queries principais
- Backup e troubleshooting
- ⏱️ Tempo: **15 minutos**

---

## 📡 Documentação da API

### 7️⃣ **[API_ENDPOINTS.md](API_ENDPOINTS.md)**
- Endpoints REST da API (GET, POST, PUT, DELETE)
- Health Check
- Menus, Items, Orders, Settings
- Request/Response examples
- ⏱️ Tempo: **10 minutos**

---

## 🎨 Customização & Layouts

### 8️⃣ **[GUIA_NOVOS_LAYOUTS.md](GUIA_NOVOS_LAYOUTS.md)**
- Como adicionar novos layouts para a interface do cliente
- Template passo a passo
- Exemplos prontos (Minimal, Premium)
- Checklist de validação
- **⚠️ IMPORTANTE**: Localização correta: `src/components/customer-views/`
- ⏱️ Tempo: **15 minutos**

---

## 🚀 Começo Rápido

### ⚡ Se você tem 5 minutos:
```bash
# Ler:
PROJETO_SINTESE.md

# Fazer:
cd server && npm install && npm run dev
# (em outro terminal)
npm install && npm run dev
```

### ⏱️ Se você tem 30 minutos:
```
1. PROJETO_SINTESE.md (5 min)
2. SETUP_AMBIENTE.md (10 min)
3. Rodar projeto (10 min)
4. Explorar interface (5 min)
```

### 📚 Se você tem 2 horas (Completo):
```
1. PROJETO_SINTESE.md (5 min)
2. SETUP_AMBIENTE.md (10 min)
3. GUIA_DESENVOLVIMENTO.md (20 min)
4. ARQUITETURA_BACKEND.md (15 min)
5. ARQUITETURA_FRONTEND.md (15 min)
6. BANCO_DADOS.md (15 min)
7. API_ENDPOINTS.md (10 min)
8. Explorar código (25 min)
```

---

## 📊 Mapa de Navegação

```
START
  │
  ├─→ [PROJETO_SINTESE.md] ← Visão Geral
  │        │
  │        ├─→ Desenvolvedor?
  │        │   └─→ [SETUP_AMBIENTE.md]
  │        │       └─→ [GUIA_DESENVOLVIMENTO.md]
  │        │           ├─→ [ARQUITETURA_BACKEND.md]
  │        │           ├─→ [ARQUITETURA_FRONTEND.md]
  │        │           ├─→ [BANCO_DADOS.md]
  │        │           └─→ [API_ENDPOINTS.md]
  │        │
  │        └─→ Arquiteto/Lead?
  │            └─→ [ARQUITETURA_BACKEND.md]
  │                ├─→ [ARQUITETURA_FRONTEND.md]
  │                ├─→ [BANCO_DADOS.md]
  │                └─→ [API_ENDPOINTS.md]
  │
  └─→ Dúvidas?
      └─→ Consulte todos os arquivos (cada um tem troubleshooting)
```

---

## 🎯 Qual Documento Ler?

### "Quero entender o projeto rapidamente"
→ **[PROJETO_SINTESE.md](PROJETO_SINTESE.md)**

### "Preciso instalar e rodar agora"
→ **[SETUP_AMBIENTE.md](SETUP_AMBIENTE.md)**

### "Vou desenvolver features novas"
→ **[GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md)** + **[ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md)** + **[ARQUITETURA_FRONTEND.md](ARQUITETURA_FRONTEND.md)**

### "Preciso entender a arquitetura"
→ **[ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md)** + **[ARQUITETURA_FRONTEND.md](ARQUITETURA_FRONTEND.md)**

### "Preciso trabalhar com banco de dados"
→ **[BANCO_DADOS.md](BANCO_DADOS.md)**

### "Preciso usar a API"
→ **[API_ENDPOINTS.md](API_ENDPOINTS.md)**

### "Tenho um problema/erro"
→ Procure por "troubleshooting" em cada arquivo

---

## 📁 Estrutura dos 7 Documentos

```
Documentação/
│
├── 1. PROJETO_SINTESE.md
│   ├── Resumo Executivo
│   ├── Stack Tecnológico
│   ├── Arquitetura Geral
│   └── Links para Documentação
│
├── 2. SETUP_AMBIENTE.md
│   ├── Pré-requisitos
│   ├── Instalação Rápida
│   ├── Configuração Detalhada
│   └── Troubleshooting
│
├── 3. GUIA_DESENVOLVIMENTO.md
│   ├── Convenções de Código
│   ├── Estrutura de Arquivos
│   ├── Padrões de Componentes
│   └── Boas Práticas
│
├── 4. ARQUITETURA_BACKEND.md
│   ├── Visão Geral
│   ├── Estrutura de Pastas
│   ├── Entry Point
│   ├── Database Module
│   ├── Rotas da API
│   └── Padrões Backend
│
├── 5. ARQUITETURA_FRONTEND.md
│   ├── Visão Geral
│   ├── Estrutura de Pastas
│   ├── Componentes Principais
│   ├── Sistema de Temas
│   └── Integração com API
│
├── 6. BANCO_DADOS.md
│   ├── Schema Completo
│   ├── Relacionamentos
│   ├── Migrations
│   ├── Queries Principais
│   └── Backup & Troubleshooting
│
└── 7. API_ENDPOINTS.md
    ├── Health Check
    ├── Menus (GET, POST, PUT, DELETE)
    ├── Items (GET, POST, PUT, DELETE)
    ├── Orders (GET, POST, PUT)
    ├── Settings (GET, PUT)
    └── Exemplos de Request/Response
```

---

## ✨ Destaques de Cada Documento

### PROJETO_SINTESE.md
✅ Melhor para: Visão geral rápida  
📊 Contém: Diagramas, stack, limitações  
⏱️ Leitura: 5 minutos  

### SETUP_AMBIENTE.md
✅ Melhor para: Instalação e configuração  
🔧 Contém: Passo a passo, debugging  
⏱️ Leitura: 10 minutos  

### GUIA_DESENVOLVIMENTO.md
✅ Melhor para: Desenvolvimento consistente  
📝 Contém: Padrões, exemplos de código  
⏱️ Leitura: 20 minutos  

### ARQUITETURA_BACKEND.md
✅ Melhor para: Desenvolvimento do servidor  
🖥️ Contém: Rotas, database, migrations  
⏱️ Leitura: 15 minutos  

### ARQUITETURA_FRONTEND.md
✅ Melhor para: Desenvolvimento do cliente  
🎨 Contém: Componentes, temas, fluxos  
⏱️ Leitura: 15 minutos  

### BANCO_DADOS.md
✅ Melhor para: Trabalhar com dados  
💾 Contém: Schema, queries, backup  
⏱️ Leitura: 15 minutos  

### API_ENDPOINTS.md
✅ Melhor para: Integração com API  
📡 Contém: Endpoints, exemplos, status codes  
⏱️ Leitura: 10 minutos  

---

## 🎓 Ordem de Leitura Recomendada

### Para Novo Desenvolvedor
1. PROJETO_SINTESE.md
2. SETUP_AMBIENTE.md
3. GUIA_DESENVOLVIMENTO.md
4. ARQUITETURA_FRONTEND.md
5. ARQUITETURA_BACKEND.md
6. BANCO_DADOS.md
7. API_ENDPOINTS.md

### Para Arquiteto/Lead
1. PROJETO_SINTESE.md
2. ARQUITETURA_BACKEND.md
3. ARQUITETURA_FRONTEND.md
4. BANCO_DADOS.md
5. API_ENDPOINTS.md
6. GUIA_DESENVOLVIMENTO.md

### Para DevOps/Infra
1. PROJETO_SINTESE.md
2. SETUP_AMBIENTE.md
3. ARQUITETURA_BACKEND.md
4. BANCO_DADOS.md
5. API_ENDPOINTS.md

### Para Frontend Developer
1. PROJETO_SINTESE.md
2. SETUP_AMBIENTE.md
3. ARQUITETURA_FRONTEND.md
4. GUIA_DESENVOLVIMENTO.md
5. API_ENDPOINTS.md

### Para Backend Developer
1. PROJETO_SINTESE.md
2. SETUP_AMBIENTE.md
3. ARQUITETURA_BACKEND.md
4. BANCO_DADOS.md
5. GUIA_DESENVOLVIMENTO.md
6. API_ENDPOINTS.md

---

## 🔗 Links Rápidos

| Documento | Quando Usar | Tempo |
|-----------|------------|-------|
| [PROJETO_SINTESE.md](PROJETO_SINTESE.md) | Visão geral | 5 min |
| [SETUP_AMBIENTE.md](SETUP_AMBIENTE.md) | Instalar | 10 min |
| [GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md) | Desenvolver | 20 min |
| [ARQUITETURA_BACKEND.md](ARQUITETURA_BACKEND.md) | Backend | 15 min |
| [ARQUITETURA_FRONTEND.md](ARQUITETURA_FRONTEND.md) | Frontend | 15 min |
| [BANCO_DADOS.md](BANCO_DADOS.md) | Dados | 15 min |
| [API_ENDPOINTS.md](API_ENDPOINTS.md) | API | 10 min |

---

## 💡 Dicas Úteis

### Procurando algo específico?
Use `Ctrl+F` (ou `Cmd+F` no Mac) em cada documento para buscar

### Vendo muito código?
Pule a seção de código detalhado se preferir conceitos gerais

### Quer aprender fazendo?
Leia [SETUP_AMBIENTE.md](SETUP_AMBIENTE.md) e comece a rodar o projeto

---

## ✅ Próximos Passos

1. **Escolha seu documento** baseado no seu perfil acima
2. **Leia** o documento escolhido
3. **Implemente** o conhecimento
4. **Consulte** outros documentos conforme necessário

---

## 🆘 Ficou Perdido?

Se você não sabe por onde começar:

**Opção 1**: Leia todos na ordem (2 horas)
**Opção 2**: Comece com [PROJETO_SINTESE.md](PROJETO_SINTESE.md) e siga as recomendações
**Opção 3**: Procure por "troubleshooting" em cada documento
**Opção 4**: Abra uma issue ou procure por sua dúvida

---

**Versão**: 2.0  
**Data**: Janeiro 2026  
**Status**: ✅ Documentação Consolidada

**Bom desenvolvimento! 🚀**
