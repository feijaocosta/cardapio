# 📋 Próximas Etapas: Configuração Manual do CI/CD

## ✅ O que foi feito automaticamente

- ✅ Branch `staging` criada e enviada ao GitHub
- ✅ Workflows GitHub Actions criados:
  - `.github/workflows/test.yml` - Testes automáticos
  - `.github/workflows/deploy-staging.yml` - Deploy em staging
  - `.github/workflows/deploy-prod.yml` - Deploy em produção
- ✅ Workflows commitados e enviados ao GitHub

---

## ⚠️ O que você precisa fazer manualmente

### **FASE 2: Configurar SSH (Manual)**

#### Tarefa 2.1: Gerar SSH Key no DreamHost
```bash
# 1. SSH no seu DreamHost
ssh seu_usuario@seu_dominio.com

# 2. Criar diretório .ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 3. Gerar nova chave
ssh-keygen -t ed25519 -f ~/.ssh/github-deploy -N ""

# 4. Ver a chave pública (copiar para GitHub)
cat ~/.ssh/github-deploy.pub

# 5. Ver a chave privada (copiar para GitHub Secrets)
cat ~/.ssh/github-deploy
```

#### Tarefa 2.2: Adicionar Deploy Key ao GitHub
1. Acesse: https://github.com/feijaocosta/cardapio
2. Vá para: **Settings → Deploy keys**
3. Clique: **Add deploy key**
4. Preencha:
   - **Title**: `DreamHost SSH Key`
   - **Key**: Cole a chave pública (cat ~/.ssh/github-deploy.pub)
   - ✅ Marque: **Allow write access**

#### Tarefa 2.3: Adicionar Secrets ao GitHub
1. Acesse: https://github.com/feijaocosta/cardapio
2. Vá para: **Settings → Secrets and variables → Actions**
3. Clique: **New repository secret** (4 vezes)

**Secret 1:**
```
Name: DREAMHOST_HOST
Value: seu_dominio.com (ou IP do DreamHost)
```

**Secret 2:**
```
Name: DREAMHOST_USER
Value: seu_usuario_dreamhost
```

**Secret 3:**
```
Name: DREAMHOST_SSH_KEY
Value: (Cole aqui a chave privada inteira - do -----BEGIN até -----END)
```

**Secret 4:**
```bash
# No seu computador local (não DreamHost):
ssh-keyscan seu_dominio.com >> ~/.ssh/known_hosts

# Ver o conteúdo
cat ~/.ssh/known_hosts | grep seu_dominio.com

Name: DREAMHOST_KNOWN_HOSTS
Value: (Cole aqui o resultado)
```

---

### **FASE 1.2 & 1.3: Proteger Branches (Manual)**

#### Tarefa 1.2: Proteger Branch `main`
1. Acesse: https://github.com/feijaocosta/cardapio
2. Vá para: **Settings → Branches**
3. Clique: **Add rule**
4. Preencha:
   - **Branch name pattern**: `main`
   - ✅ **Require pull request reviews before merging**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**

#### Tarefa 1.3: Proteger Branch `staging`
Repita o processo anterior, mas com pattern: `staging`

---

### **FASE 3: Setup DreamHost (Manual)**

#### Tarefa 3.1: Criar Diretórios
```bash
ssh seu_usuario@seu_dominio.com

mkdir -p ~/cardapio-staging
mkdir -p ~/cardapio-prod
mkdir -p ~/logs
touch ~/logs/app-staging.log
touch ~/logs/app-prod.log
```

#### Tarefa 3.2: Clonar Repositório (Staging)
```bash
cd ~/cardapio-staging
git clone https://github.com/feijaocosta/cardapio.git .
git checkout staging
git pull origin staging
```

#### Tarefa 3.3: Clonar Repositório (Produção)
```bash
cd ~/cardapio-prod
git clone https://github.com/feijaocosta/cardapio.git .
git checkout main
git pull origin main
```

#### Tarefa 3.4: Instalar Dependências (Staging)
```bash
cd ~/cardapio-staging
npm install
cd server && npm install && cd ..
npm run build
```

#### Tarefa 3.5: Instalar Dependências (Produção)
```bash
cd ~/cardapio-prod
npm install
cd server && npm install && cd ..
npm run build
```

#### Tarefa 3.6: Configurar Variáveis de Ambiente

**Em `~/cardapio-staging/.env`:**
```env
NODE_ENV=staging
PORT=3001
DATABASE_PATH=./cardapio-staging.db
REACT_APP_API_URL=http://staging.cardapio/api
```

**Em `~/cardapio-prod/.env`:**
```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=./cardapio-prod.db
REACT_APP_API_URL=https://cardapio.com/api
```

---

## 📋 Checklist do que falta fazer

### Configuração SSH
- [ ] SSH key gerada no DreamHost
- [ ] Deploy key adicionada ao GitHub
- [ ] Secrets adicionados ao GitHub (4 secrets)

### Proteger Branches
- [ ] Branch `main` protegida
- [ ] Branch `staging` protegida

### Setup DreamHost
- [ ] Diretórios criados
- [ ] Repositórios clonados (staging + prod)
- [ ] Dependências instaladas
- [ ] .env configurado

### Testes
- [ ] Workflows visíveis no GitHub Actions
- [ ] Fazer primeiro push em feature branch
- [ ] Verificar testes passando
- [ ] Fazer PR → staging
- [ ] Verificar deploy automático em staging
- [ ] Fazer PR → main
- [ ] Verificar deploy automático em produção

---

## 🔗 Links Úteis

- 📖 Plano completo: [PLANO_CICD_DREAMHOST.md](PLANO_CICD_DREAMHOST.md)
- 📖 Workflow: [WORKFLOW_DESENVOLVIMENTO.md](WORKFLOW_DESENVOLVIMENTO.md)
- 🔑 GitHub SSH Keys: https://github.com/settings/keys
- 🔑 GitHub Secrets: https://github.com/feijaocosta/cardapio/settings/secrets/actions

---

## 📊 Resumo do Progresso

```
✅ FASE 1 (Repositório):
   ✅ Criar branch staging
   ⏳ Proteger branches (manual no GitHub)

✅ FASE 4 (GitHub Actions):
   ✅ Criar workflows
   ✅ Fazer commit

⏳ FASE 2 (SSH):
   ⏳ Gerar chaves no DreamHost
   ⏳ Adicionar secrets ao GitHub

⏳ FASE 3 (DreamHost):
   ⏳ Criar diretórios
   ⏳ Clonar repositórios
   ⏳ Instalar dependências
   ⏳ Configurar .env

⏳ FASE 5 (Testes):
   ⏳ Fazer primeiro deploy

⏳ FASE 6 (Monitoramento):
   ⏳ Setup rollback e backups
```

**Tempo estimado para completar**: ~3-4 horas (principalmente esperar pelos testes)

**Status Atual**: 50% automático, 50% manual no DreamHost + GitHub

---

**Próximo passo**: Seguir as tarefas manuais acima, em ordem 🚀
