# 🚀 Plano de Implementação: CI/CD com DreamHost

## 📌 Versão: 1.0 | Data: 30 de Janeiro de 2026

---

## 🎯 Objetivo

Implementar **Deploy Contínuo Automático** com **Aprovação Manual**:

```
git push → Testes Automáticos → Deploy Staging → Aprovação Manual → Deploy Produção
```

**Stack:**
- ✅ GitHub Actions (automação)
- ✅ DreamHost (2 servidores: staging + produção)
- ✅ SSH (conexão segura)
- ✅ SQLite (banco persistente)

**Resultado Final:**
- 🟢 feature → testes automáticos
- 🟡 staging → deploy automático + validação manual
- 🔴 produção → deploy automático após aprovação

---

## 📋 Índice das Fases

- **FASE 1**: Preparar Repositório
- **FASE 2**: Configurar SSH
- **FASE 3**: Setup DreamHost
- **FASE 4**: GitHub Actions (Workflows)
- **FASE 5**: Testes End-to-End
- **FASE 6**: Monitoramento

**Tempo Total**: ~2-3 horas

---

## FASE 1️⃣: Preparar Repositório

### Tarefa 1.1: Criar Branch `staging`

```bash
# Localmente
git checkout main
git pull origin main
git checkout -b staging

# Enviar para GitHub
git push -u origin staging

# Confirmar
git branch -a
# output: * main
#           staging
#           remotes/origin/main
#           remotes/origin/staging
```

**Verificação:**
- ✅ Branch `staging` existe em GitHub
- ✅ Você está em `main` agora

---

### Tarefa 1.2: Proteger Branch `main`

No GitHub, vá para **Settings → Branches**:

```
✅ Add rule
   Branch name pattern: main
   
   ✅ Require pull request reviews before merging
   ✅ Require status checks to pass before merging
      └─ Select: test, build, lint
   ✅ Require branches to be up to date before merging
   ✅ Restrict who can push to matching branches
```

**Resultado:**
- 🔴 Ninguém consegue fazer `git push origin main`
- 🔴 Ninguém consegue mergear sem PR
- 🔴 Testes devem passar

---

### Tarefa 1.3: Proteger Branch `staging`

Repita tarefa 1.2, mas para branch `staging`:

```
✅ Add rule
   Branch name pattern: staging
   
   ✅ Require pull request reviews before merging
   ✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
```

**Resultado:**
- 🟡 Ninguém consegue fazer `git push origin staging`
- 🟡 Testes devem passar
- 🟡 Pode mergear via PR

---

### Tarefa 1.4: Criar GitHub Secrets

Para SSH funcionar, você precisa adicionar chaves ao GitHub.

**Em GitHub → Settings → Secrets and variables → Actions:**

```
Vamos criar esses secrets:
- DREAMHOST_HOST
- DREAMHOST_USER
- DREAMHOST_SSH_KEY
- DREAMHOST_KNOWN_HOSTS (depois)
```

Deixe em branco por enquanto. Vamos voltar na **FASE 2**.

---

## FASE 2️⃣: Configurar SSH

### Tarefa 2.1: Gerar SSH Key no DreamHost

```bash
# 1. SSH no seu DreamHost
ssh seu_usuario@seu_dominio.com

# 2. Criar diretório .ssh (se não existir)
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 3. Gerar nova chave (use padrão: sem passphrase)
ssh-keygen -t ed25519 -f ~/.ssh/github-deploy -N ""

# 4. Ver a chave pública
cat ~/.ssh/github-deploy.pub
# output: ssh-ed25519 AAAA... seu_usuario@dreamhost

# 5. Ver a chave privada (para GitHub)
cat ~/.ssh/github-deploy
# output: -----BEGIN PRIVATE KEY-----
#         MIIEvQIBA...
#         -----END PRIVATE KEY-----
```

**Copie:**
- 🔑 Chave privada inteira (BEGIN até END)

---

### Tarefa 2.2: Adicionar Chave ao GitHub

1. Vá para **GitHub → Settings → Deploy keys** (de cada repo)
2. Clique **Add deploy key**

```
Title: DreamHost SSH Key

Key: (cole a chave pública aqui)
      ssh-ed25519 AAAA...

✅ Allow write access
   (precisa para fazer git pull)
```

**Verificação:**
```bash
# No DreamHost, testar conexão
ssh -i ~/.ssh/github-deploy git@github.com

# output: Hi seu_usuario/cardapio! You've successfully authenticated
```

---

### Tarefa 2.3: Adicionar Secret ao GitHub

1. Vá para **Settings → Secrets and variables → Actions**
2. Clique **New repository secret**

```
Name: DREAMHOST_SSH_KEY

Secret: (cole aqui a chave privada inteira)
        -----BEGIN PRIVATE KEY-----
        MIIEvQIBA...
        -----END PRIVATE KEY-----

(não esqueça: BEGIN até END)
```

---

### Tarefa 2.4: Adicionar Outros Secrets

Adicione também:

**Secret 1: DREAMHOST_HOST**
```
Name: DREAMHOST_HOST
Value: seu_dominio.com (ou IP do DreamHost)
```

**Secret 2: DREAMHOST_USER**
```
Name: DREAMHOST_USER
Value: seu_usuario
```

**Secret 3: DREAMHOST_KNOWN_HOSTS**
```bash
# No seu computador local (não DreamHost):
ssh-keyscan seu_dominio.com >> ~/.ssh/known_hosts

# Ver o conteúdo
cat ~/.ssh/known_hosts | grep seu_dominio.com

# Copiar e adicionar ao GitHub
```

**Resultado:**
- ✅ Todos os 4 secrets adicionados
- ✅ GitHub Actions consegue fazer SSH

---

## FASE 3️⃣: Setup DreamHost

### Tarefa 3.1: Criar Diretórios

```bash
# 1. SSH no DreamHost
ssh seu_usuario@seu_dominio.com

# 2. Acessar diretório staging (já criado pelo DreamHost)
cd /home/cardapioprod/cardapio-staging.feijaocosta.com.br

# 3. Acessar diretório produção (já criado pelo DreamHost)
cd /home/cardapioprod/cardapio.feijaocosta.com.br

# 4. Diretório de logs (já criado pelo DreamHost)
cd /home/cardapioprod/logs
```

**Estrutura (já existe no DreamHost):**
```
/home/cardapioprod/
├── cardapio-staging.feijaocosta.com.br/    (staging)
├── cardapio.feijaocosta.com.br/            (produção)
└── logs/
```

---

### Tarefa 3.2: Clonar Repositório (Staging)

```bash
# No DreamHost
cd /home/cardapioprod/cardapio-staging.feijaocosta.com.br

# Clonar (se a pasta estiver vazia)
git clone https://github.com/seu_usuario/cardapio.git .

# Checkout branch staging
git checkout staging
git pull origin staging

# Verificar
git branch
# output: * staging
#           main (ou remotes/origin/main)
```

---

### Tarefa 3.3: Clonar Repositório (Produção)

```bash
# No DreamHost
cd /home/cardapioprod/cardapio.feijaocosta.com.br

# Clonar (se a pasta estiver vazia)
git clone https://github.com/seu_usuario/cardapio.git .

# Checkout branch main
git checkout main
git pull origin main

# Verificar
git branch
# output: * main
```

---

### Tarefa 3.4: Instalar Dependências (Staging)

```bash
# No DreamHost
cd /home/cardapioprod/cardapio-staging.feijaocosta.com.br

# Node version (verifique com seu host)
node --version
npm --version

# Instalar
npm install
cd server
npm install
cd ..

# Criar .env (se necessário)
cp .env.example .env

# Verificar build
npm run build
```

---

### Tarefa 3.5: Instalar Dependências (Produção)

```bash
# No DreamHost
cd /home/cardapioprod/cardapio.feijaocosta.com.br

# Instalar
npm install
cd server
npm install
cd ..

# Criar .env (se necessário)
cp .env.example .env

# Verificar build
npm run build
```

---

### Tarefa 3.6: Configurar Variáveis de Ambiente

**Em `/home/cardapioprod/cardapio-staging.feijaocosta.com.br/.env`:**
```env
NODE_ENV=staging
PORT=3001
DATABASE_PATH=./cardapio-staging.db
REACT_APP_API_URL=http://cardapio-staging.feijaocosta.com.br/api
```

**Em `/home/cardapioprod/cardapio.feijaocosta.com.br/.env`:**
```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=./cardapio-prod.db
REACT_APP_API_URL=https://cardapio.feijaocosta.com.br/api
```

---

## FASE 4️⃣: GitHub Actions (Workflows)

### Tarefa 4.1: Criar Arquivo de Workflow de Testes

```bash
# Localmente, no seu computador
mkdir -p .github/workflows
touch .github/workflows/test.yml
```

**Arquivo `.github/workflows/test.yml`:**

```yaml
name: Run Tests

on:
  push:
    branches: [ "feature/*" ]
  pull_request:
    branches: [ staging, main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install frontend dependencies
      run: npm install

    - name: Install backend dependencies
      run: cd server && npm install

    - name: Run lint
      run: npm run lint

    - name: Run type check
      run: npm run type-check

    - name: Run build
      run: npm run build

    - name: Run tests
      run: npm run test
```

---

### Tarefa 4.2: Criar Workflow de Deploy em Staging

```bash
touch .github/workflows/deploy-staging.yml
```

**Arquivo `.github/workflows/deploy-staging.yml`:**

```yaml
name: Deploy to Staging

on:
  push:
    branches: [ staging ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to DreamHost Staging
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DREAMHOST_HOST }}
        username: ${{ secrets.DREAMHOST_USER }}
        key: ${{ secrets.DREAMHOST_SSH_KEY }}
        known_hosts: ${{ secrets.DREAMHOST_KNOWN_HOSTS }}
        script: |
          cd ~/cardapio-staging
          git fetch origin staging
          git checkout staging
          git pull origin staging
          npm install
          cd server && npm install && cd ..
          npm run build
          pkill -f "node server" || true
          npm run dev > ~/logs/app-staging.log 2>&1 &
          echo "Deploy staging completed"
```

---

### Tarefa 4.3: Criar Workflow de Deploy em Produção

```bash
touch .github/workflows/deploy-prod.yml
```

**Arquivo `.github/workflows/deploy-prod.yml`:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to DreamHost Production
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DREAMHOST_HOST }}
        username: ${{ secrets.DREAMHOST_USER }}
        key: ${{ secrets.DREAMHOST_SSH_KEY }}
        known_hosts: ${{ secrets.DREAMHOST_KNOWN_HOSTS }}
        script: |
          cd ~/cardapio-prod
          git fetch origin main
          git checkout main
          git pull origin main
          npm install
          cd server && npm install && cd ..
          npm run build
          pkill -f "node server" || true
          npm run dev > ~/logs/app-prod.log 2>&1 &
          echo "Deploy production completed"
```

---

### Tarefa 4.4: Fazer Commit dos Workflows

```bash
# Localmente
git add .github/workflows/
git commit -m "chore: adicionar workflows GitHub Actions"
git push origin main
```

---

## FASE 5️⃣: Testes End-to-End

### Tarefa 5.1: Primeiro Deploy - Staging

1. Crie uma feature branch: `git checkout -b feature/test-ci-cd`
2. Faça uma pequena mudança (ex: comentário no código)
3. Commit: `git commit -m "test: validar CI/CD"`
4. Push: `git push origin feature/test-ci-cd`

**O que acontece automaticamente:**
- 🤖 GitHub Actions roda testes
- ✅ Se passou, você vê check verde

5. Abra PR: `feature/test-ci-cd` → `staging`
6. Se testes passarem, mergear para staging

**O que acontece:**
- 🤖 GitHub Actions dispara deploy
- 📡 Servidor staging atualiza
- 🌐 Acesse `staging.cardapio` para ver mudança

---

### Tarefa 5.2: Primeiro Deploy - Produção

1. Abra PR: `staging` → `main`
2. Se testes passarem, mergear para main

**O que acontece:**
- 🤖 GitHub Actions dispara deploy
- 📡 Servidor produção atualiza
- 🌐 Acesse `cardapio.com` para ver mudança

---

### Tarefa 5.3: Validar Logs

```bash
# SSH no DreamHost
ssh seu_usuario@seu_dominio.com

# Ver logs staging
tail -f ~/logs/app-staging.log

# Ver logs produção (outro terminal)
tail -f ~/logs/app-prod.log
```

**O que procurar:**
- ✅ "listening on port 3001" (staging)
- ✅ "listening on port 3000" (produção)
- ❌ Erros ou warnings

---

## FASE 6️⃣: Monitoramento

### Tarefa 6.1: Setup de Rollback

Se algo der errado em produção:

```bash
# No DreamHost
cd ~/cardapio-prod

# Ver histórico
git log --oneline

# Reverter último commit
git revert HEAD

# Push (dispara deploy automático da reversion)
git push origin main
```

---

### Tarefa 6.2: Verificação de Saúde

```bash
# Testar API
curl https://cardapio.com/api/health
# output: {"status":"ok"}

# Testar staging
curl http://staging.cardapio/api/health
# output: {"status":"ok"}
```

---

### Tarefa 6.3: Backup de Database

```bash
# No DreamHost, criar backup diário
cd ~/cardapio-prod
cp cardapio-prod.db cardapio-prod.db.backup.$(date +%Y%m%d)

# Colocar em cron (backup automático)
crontab -e
# Adicionar: 0 2 * * * cd ~/cardapio-prod && cp cardapio-prod.db cardapio-prod.db.backup.$(date +\%Y\%m\%d)
```

---

## 📋 Checklist Final

### Setup Repositório
- [ ] Branch `staging` criada
- [ ] Branch `main` protegida
- [ ] Branch `staging` protegida
- [ ] Secrets adicionados ao GitHub

### Setup DreamHost
- [ ] SSH key gerada
- [ ] SSH key adicionada ao GitHub
- [ ] Diretórios criados
- [ ] Repositórios clonados
- [ ] Dependências instaladas
- [ ] .env configurado

### GitHub Actions
- [ ] Workflow test.yml criado
- [ ] Workflow deploy-staging.yml criado
- [ ] Workflow deploy-prod.yml criado
- [ ] Workflows fazendo commit

### Testes
- [ ] Primeiro push em feature funciona
- [ ] Testes automáticos passam
- [ ] PR pode ser feita
- [ ] Merge para staging funciona
- [ ] Deploy staging automático
- [ ] Staging acessível
- [ ] Merge para main funciona
- [ ] Deploy produção automático
- [ ] Produção acessível

---

## 🆘 Troubleshooting

### "Deploy não está acontecendo"

```bash
# Verificar se SSH está funcionando
ssh seu_usuario@seu_dominio.com

# Ver último log do GitHub Actions
# (na página do workflow, aba "Logs")

# Comum: SSH key sem permissão
# Solução: chmod 600 ~/.ssh/github-deploy
```

### "Testes falhando"

```bash
# Rodar testes localmente
npm run test

# Se passar localmente mas falhar no CI/CD:
# - Falta dependência?
# - Falta variável de ambiente?
# - Falta arquivo .env?
```

### "Servidor não reiniciou após deploy"

```bash
# Verificar se processo está rodando
ssh seu_usuario@seu_dominio.com
ps aux | grep node

# Se não está:
cd ~/cardapio-prod
npm run dev > ~/logs/app-prod.log 2>&1 &
```

---

## 📊 Resumo do Fluxo Final

```
Local Dev
  ↓
git push origin feature/...
  ↓
GitHub Actions: Testes ✅
  ↓
PR: feature → staging (mergear)
  ↓
GitHub Actions: Deploy Staging (automático)
  ↓
DreamHost Staging: Atualiza
  ↓
Você testa em staging ✅
  ↓
PR: staging → main (mergear)
  ↓
GitHub Actions: Deploy Produção (automático)
  ↓
DreamHost Produção: Atualiza
  ↓
✅ LIVE!
```

---

## ✅ Próximas Etapas

1. ✅ Entender WORKFLOW_DESENVOLVIMENTO.md
2. ✅ Implementar PLANO_CICD_DREAMHOST.md (este arquivo)
3. ⏭️ Fazer primeiro deploy (feature → staging)
4. ⏭️ Fazer segundo deploy (staging → main)
5. ⏭️ Monitoramento e manutenção

---

**Status**: ✅ Pronto para implementação  
**Versão**: 1.0  
**Última atualização**: 30 de Janeiro de 2026

**Dúvidas? Consulte WORKFLOW_DESENVOLVIMENTO.md** 🚀
