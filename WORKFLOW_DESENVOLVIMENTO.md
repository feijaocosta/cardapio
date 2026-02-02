# 🔄 Workflow de Desenvolvimento e Deploy

## 📌 Versão: 1.0 | Data: 30 de Janeiro de 2026

---

## 🎯 Objetivo

Este documento define **como trabalhamos** no projeto Cardápio:
- ✅ Fluxo de branches (feature → staging → main)
- ✅ Processo de commits e Pull Requests
- ✅ Testes automáticos e manuais
- ✅ Deploy contínuo com aprovação
- ✅ **Instruções claras para IAs**

**Público**: Todos (Desenvolvedores + IAs)

---

## 📊 Diagrama do Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEU DESENVOLVIMENTO                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
          git checkout -b feature/sua-feature
                            ↓
            (Você desenvolve e testa localmente)
                            ↓
                  git push origin feature/...
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│           GITHUB ACTIONS - TESTES AUTOMÁTICOS                    │
│  ✅ Lint (ESLint + Prettier)                                     │
│  ✅ Build (npm run build)                                        │
│  ✅ Integration Tests                                            │
│  ✅ TypeScript Check                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                   Testes passaram? ✅
                            ↓
        Open Pull Request: feature/... → staging
                            ↓
         (GitHub Actions dispara deploy staging)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              SERVIDOR STAGING (DreamHost)                        │
│  🌐 URL: staging.cardapio                                        │
│  📊 Banco: SQLite (dados de teste)                               │
│  🔄 Deploy Automático: Ativo                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
          Você testa manualmente em Staging
          (pedidos, layouts, funcionalidades)
                            ↓
                  Tudo OK? ✅ Sim
                            ↓
       Open Pull Request: staging → main
                            ↓
         (GitHub Actions dispara deploy produção)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│            SERVIDOR PRODUÇÃO (DreamHost)                         │
│  🌐 URL: cardapio.com                                            │
│  📊 Banco: SQLite (dados reais)                                  │
│  🔄 Deploy Automático: Ativo                                     │
│  👥 Usuários finais usando agora                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    ✅ FEITO!
```

---

## 🌳 Estratégia de Branches

### **Branches Principais (Protegidas)**

#### `main` 🔴 PRODUÇÃO
- **O quê**: Código que está ao vivo
- **Quando usar**: Após testes em staging
- **Quem pode mexer**: Ninguém direto (apenas via PR)
- **Deploy automático**: ✅ SIM
- **Proteção**: Requer PR + testes passando
- **URL**: `https://cardapio.com`

#### `staging` 🟡 VALIDAÇÃO
- **O quê**: Código em teste
- **Quando usar**: Antes de ir para produção
- **Quem pode mexer**: Ninguém direto (apenas via PR)
- **Deploy automático**: ✅ SIM
- **Proteção**: Requer testes passando
- **URL**: `staging.cardapio` (ou localhost:3001)
- **Banco de dados**: Isolado de produção

### **Branches de Feature (Temporários)**

#### `feature/nome-descritivo` 🟢 DESENVOLVIMENTO
- **O quê**: Uma nova funcionalidade
- **Quando usar**: Para cada feature/bugfix
- **Duração**: Até 1 PR
- **Deploy automático**: ❌ NÃO
- **Onde trabalhar**: Aqui é seu espaço

**Exemplos válidos:**
```
✅ feature/novo-layout-minimal
✅ feature/corrigir-validacao-pedidos
✅ feature/adicionar-desconto-items
✅ feature/melhorar-performance-api
❌ feature/teste (muito vago)
❌ feature/fix (muito vago)
```

---

## 📝 Convenção de Commits

Use o padrão **Conventional Commits** para clareza:

```
[tipo]: descrição
```

### **Tipos Válidos**

| Tipo | Uso | Exemplo |
|------|-----|------|
| `feat` | Nova funcionalidade | `feat: adicionar layout minimal` |
| `fix` | Correção de bug | `fix: corrigir validação de email` |
| `docs` | Documentação | `docs: atualizar README` |
| `style` | Formatação (sem lógica) | `style: ajustar indentação` |
| `refactor` | Refatoração | `refactor: reorganizar componentes` |
| `test` | Testes | `test: adicionar testes de pedidos` |
| `chore` | Manutenção | `chore: atualizar dependências` |

### **Exemplos Corretos**

```bash
git commit -m "feat: adicionar novo layout para mobile"
git commit -m "fix: corrigir erro ao salvar pedido"
git commit -m "docs: documentar nova API"
git commit -m "test: adicionar testes de validação"
git commit -m "refactor: simplificar componente Customer"
```

### **Exemplos Incorretos**

```bash
❌ git commit -m "alteracao"
❌ git commit -m "mudança no código"
❌ git commit -m "fix"
❌ git commit -m "WIP"
```

---

## 🔀 Processo Passo a Passo

### **PASSO 1: Criar Feature Branch**

```bash
# Atualizar master
git checkout main
git pull origin main

# Criar feature branch
git checkout -b feature/sua-feature-aqui

# Confirmar que está no branch correto
git branch
# output: * feature/sua-feature-aqui
#           main
#           staging
```

**Verificação:**
- ✅ Você vê o nome da branch com `*`
- ✅ Branch está criado localmente

---

### **PASSO 2: Desenvolver Localmente**

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: VSCode para editar código
code .
```

**Durante o desenvolvimento:**

- 📝 Escreva código limpo
- ✅ Teste no navegador (localhost:3000)
- 🧪 Rode testes locais: `npm run test`
- 🎨 Formate código: `npm run format`
- ✔️ Verifique tipos: `npm run type-check`

---

### **PASSO 3: Commit Local**

```bash
# Ver o que você mudou
git status

# Adicionar mudanças específicas
git add src/components/NewComponent.tsx
git add server/routes/api.ts

# Ou adicionar tudo (cuidado!)
git add .

# Commitar com mensagem descritiva
git commit -m "feat: adicionar novo layout para mobile"

# Ver histórico
git log --oneline
```

**Dicas:**
- ✅ Commits pequenos e lógicos
- ✅ Uma funcionalidade por commit
- ✅ Mensagem clara do que foi feito

---

### **PASSO 4: Push para GitHub**

```bash
# Enviar para GitHub
git push origin feature/sua-feature-aqui

# Primeira vez? Use:
git push -u origin feature/sua-feature-aqui
```

**O que acontece automaticamente:**
1. 🤖 GitHub Actions dispara testes
2. ✅ Lint, Build, Integration Tests rodam
3. 📊 Resultado aparece no GitHub

---

### **PASSO 5: Abrir Pull Request (PR)**

No GitHub, você verá:

```
🟢 Compare & pull request
   └─ feature/sua-feature → staging
```

**Preenchendo a PR:**

```
Título:
[STAGING] Adicionar novo layout minimal

Descrição:
## O que muda?
- Novo layout para visualização de menu
- Melhor responsividade em mobile

## Como testar?
1. Ir para Menu
2. Selecionar novo layout "Minimal"
3. Verificar se funciona bem

## Checklist:
- [x] Código formatado
- [x] Testes passando
- [x] Sem console errors
- [x] Documentação atualizada
```

**Importante:**
- Base branch: `staging` ← CORRETO
- Compare branch: `feature/sua-feature` ← CORRETO

---

### **PASSO 6: Testes Automáticos Rodando**

Aguarde na página da PR:

```
✅ All checks have passed
   ├─ GitHub Actions / test
   ├─ GitHub Actions / build
   └─ GitHub Actions / lint
```

**Se falhou:**
1. Veja qual teste falhou
2. Corrija o código localmente
3. Faça novo commit: `git commit -m "fix: corrigir erro de lint"`
4. Faça push: `git push origin feature/sua-feature`
5. A PR atualiza automaticamente

---

### **PASSO 7: Mergear para Staging**

Quando testes passaram:

```
🟢 Squash and merge
   └─ Isso limpa o histórico
```

**O que acontece automaticamente:**
1. ✅ PR é mergeada
2. 🤖 GitHub Actions dispara deploy
3. 📡 Servidor staging atualiza
4. 🌐 URL staging.cardapio tem novas mudanças

---

### **PASSO 8: Testar em Staging**

Acesse: `https://staging.cardapio` (ou `localhost:3001`)

**Testes recomendados:**
- ✅ Interface carrega
- ✅ Fazer um pedido completo
- ✅ Verificar dados salvando
- ✅ Testar em mobile
- ✅ Checar console (sem erros)

**Se encontrar bug:**
1. Volte para seu feature branch: `git checkout feature/sua-feature`
2. Corrija o código
3. Commits + push
4. Abra novo PR
5. Repita

---

### **PASSO 9: Mergear para Produção**

Quando tudo tiver OK em staging:

```
Open Pull Request: staging → main

Título:
[PRODUÇÃO] Adicionar novo layout minimal

Descrição:
Testado em staging ✅
Pronto para produção
```

**O que acontece automaticamente:**
1. ✅ PR é mergeada
2. 🤖 GitHub Actions dispara deploy
3. 📡 Servidor produção atualiza
4. 🌐 URL cardapio.com tem novas mudanças
5. 👥 Usuários finais veem novidade

---

### **PASSO 10: Monitorar Produção**

Após deploy em produção:

```bash
# Ver logs do servidor
ssh seu_usuario@dreamhost.com
cd /home/cardapio-prod
tail -f logs/app.log

# Se der problema, fazer rollback:
git revert <commit-hash>
git push origin main
# Deploy automático tira a mudança
```

---

## ⚠️ Regras Importantes

### ✅ FAÇA

```bash
✅ git checkout -b feature/descritiva
✅ git push origin feature/...
✅ Abrir PR feature → staging
✅ Testar em staging
✅ Abrir PR staging → main
✅ Testar em produção
✅ Commits descritivos
✅ Código limpo e testado
```

### ❌ NÃO FAÇA

```bash
❌ git push origin main (direto)
❌ git push origin staging (direto)
❌ Merge sem testes passando
❌ Commits com mensagens vagas
❌ Código não formatado
❌ Skipping testes automáticos
❌ Múltiplas features em 1 branch
❌ Rebase de branch protegida
```

---

## 🤖 Instruções para IAs (GitHub Copilot, Claude, etc)

### **Quando pedir código:**

```
"Crie um componente React para..."

✅ RESPOSTA ESPERADA:
- Código em TypeScript
- Seguindo padrões do projeto
- Com comentários
- Com testes unitários

❌ NÃO FAÇA:
- Sugerir fazer push direto em main
- Sugerir deletar branches
- Sugerir skipping testes
```

### **Quando pedir para fazer deploy:**

```
"Como faço deploy dessa feature?"

✅ RESPOSTA ESPERADA:
1. git add .
2. git commit -m "feat: descrição"
3. git push origin feature/seu-nome
4. Abrir PR em GitHub (feature → staging)
5. Aguardar testes
6. Mergear para staging
7. Testar em staging
8. Abrir PR (staging → main)
9. Mergear para main

❌ NÃO FAÇA:
- Sugerir git push origin main
- Sugerir fazer merge sem testes
- Sugerir deletar branches
```

### **Quando pedir para mexer em banco:**

```
"Como adiciono uma coluna na tabela X?"

✅ RESPOSTA ESPERADA:
- Criar migration em server/migrations/
- Não mexer direto em main
- Testar localmente
- Incluir em feature branch
- Seguir o workflow

❌ NÃO FAÇA:
- Sugerir SQL direto no database
- Sugerir deletar dados
- Sugerir rollback sem backup
```

---

## 🔗 Fluxo Rápido (TL;DR)

```bash
# 1. Criar branch
git checkout -b feature/minha-feature

# 2. Desenvolver e testar
# (seu código aqui)

# 3. Commit e push
git commit -m "feat: descrição"
git push origin feature/minha-feature

# 4. PR: feature → staging
# (GitHub Actions testa automaticamente)

# 5. Mergear para staging
# (Deploy automático em staging)

# 6. Testar em staging
# https://staging.cardapio

# 7. PR: staging → main
# (GitHub Actions testa automaticamente)

# 8. Mergear para main
# (Deploy automático em produção)

# ✅ FEITO!
```

---

## 📋 Checklist Antes de Mergear

### Antes de PR → Staging

- [ ] Código compilando sem erros
- [ ] Testes passando localmente
- [ ] Código formatado (`npm run format`)
- [ ] Sem console errors
- [ ] TypeScript sem warnings
- [ ] Commit message descritivo
- [ ] Feature testada localmente

### Antes de PR → Main

- [ ] Testado em staging ✅
- [ ] Sem bugs encontrados
- [ ] Performance OK
- [ ] Mobile responsivo
- [ ] Dados salvando correto
- [ ] Sem conflitos de merge

---

## 🆘 Troubleshooting

### "Meu PR está com conflito"

```bash
git fetch origin
git rebase origin/staging
# Resolver conflitos em seu editor
git add .
git rebase --continue
git push origin feature/minha-feature -f
```

### "Preciso atualizar minha branch com staging"

```bash
git fetch origin
git rebase origin/staging
git push origin feature/minha-feature -f
```

### "Fiz commit em branch errada"

```bash
# Se não fez push ainda:
git reset --soft HEAD~1  # Desfaz commit, mas mantém mudanças
git checkout -b feature/correta
git commit -m "feat: descrição"
git push origin feature/correta
```

### "Preciso deletar um branch local"

```bash
git branch -d feature/antiga
# Ou forçar (se não mergeado):
git branch -D feature/antiga
```

---

## 📊 Métricas do Workflow

| Métrica | Ideal | Seu Caso |
|---------|-------|----------|
| Tempo por feature | 1-3 dias | Variável |
| Commits por PR | 3-5 | Variável |
| Testes antes de merge | 100% | ✅ Automático |
| Tempo staging → produção | 1 dia | Você decide |
| Frequência de deploy | 1-2x/semana | Você decide |

---

## ✅ Próximas Etapas

1. ✅ Entender este workflow
2. ⏭️ Ler [PLANO_CICD_DREAMHOST.md](PLANO_CICD_DREAMHOST.md)
3. ⏭️ Implementar GitHub Actions
4. ⏭️ Configurar SSH no DreamHost
5. ⏭️ Fazer primeiro deploy

---

**Status**: ✅ Pronto para usar  
**Versão**: 1.0  
**Última atualização**: 30 de Janeiro de 2026

**Perguntas? Consulte PLANO_CICD_DREAMHOST.md** 🚀
