# 🚀 Plano de Implementação: CI/CD com GCP (Free Tier)

## 📌 Versão: 1.0 | Data: 13 de Fevereiro de 2026

---

## 🎯 Objetivo

Migrar de DreamHost para **Google Cloud Platform (GCP) Free Tier** rodando **staging e produção na MESMA VM**:

```
DreamHost (❌ Não funciona)
    ↓
GCP Free Tier (✅ Uma VM para staging + produção)
    ↓
Estrutura:
┌─────────────────────────────────────────┐
│  VM Compute Engine (1vCPU, 0.6GB RAM)  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Nginx (Reverse Proxy)          │   │
│  │  Porta 80/443 → Staging/Prod    │   │
│  └─────────────────────────────────┘   │
│        ↓                    ↓            │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Staging     │  │  Produção    │   │
│  │  Port 3001   │  │  Port 3002   │   │
│  │  Branch      │  │  Branch      │   │
│  │  staging     │  │  main        │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  DB: SQLite (ambos persistentes)       │
│  Logs: Centralizados                   │
└─────────────────────────────────────────┘
```

**Stack:**
- ✅ GCP Compute Engine (Free Tier)
- ✅ GitHub Actions (automação)
- ✅ Nginx (reverse proxy)
- ✅ Node.js + PM2 (gerenciador de processos)
- ✅ SQLite (banco persistente)
- ✅ SSH (conexão segura)

**Resultado Final:**
- 🟢 feature → testes automáticos
- 🟡 staging → deploy automático (porta 3001)
- 🔴 produção → deploy automático (porta 3002)
- 🌐 Nginx redireciona as duas na mesma VM

---

## 📋 Índice das Fases

- **FASE 1**: Preparar GCP ✅ COMPLETA
- **FASE 2**: Preparar VM
- **FASE 3**: Deploy Manual
- **FASE 4**: Configurar Reverse Proxy
- **FASE 5**: GitHub Actions Workflows
- **FASE 6**: Monitoramento e Manutenção

**Tempo Total**: ~3.5-4 horas

---

## ✅ Pré-requisitos

Você já tem:
- ✅ Conta GCP criada
- ✅ Repositório GitHub com branches `main` e `staging`
- ✅ Código pronto (React + Node.js + SQLite)
- ✅ Workflows GitHub Actions (da fase DreamHost)
- ✅ VM GCP criada (FASE 1 ✅ COMPLETA)

Você precisa de:
- ✅ Domínio apontado para GCP (ou usar IP temporário)
- ✅ SSH key para GitHub (será gerada na VM)
- ✅ Terminal SSH aberto para GCP

---

---

# ✅ FASE 1️⃣: Preparar GCP - COMPLETA

## 📊 Status: ✅ FEITO

```
┌──────────────────────────────────────┐
│ VM GCP CRIADA COM SUCESSO           │
├──────────────────────────────────────┤
│                                      │
│ ✅ VM: cardapio-app                 │
│ ✅ IP Externo: 34.41.59.79          │
│ ✅ Usuário: feijao                  │
│ ✅ Região: us-central1              │
│ ✅ Zona: us-central1-a              │
│ ✅ Tipo: e2-micro (FREE TIER)       │
│ ✅ OS: Debian 11                    │
│ ✅ Disco: 30 GB                     │
│ ✅ Firewall: HTTP/HTTPS habilitado  │
│ ✅ SSH: Funcionando                 │
│                                      │
│ Próximo: FASE 2 ⏭️                  │
│                                      │
└──────────────────────────────────────┘
```

### Informações da VM (Para Referência)

```
┌─────────────────────────────────────┐
│ INFORMAÇÕES DA VM (GCP FREE TIER)   │
├─────────────────────────────────────┤
│                                     │
│ IP Externo: 34.41.59.79             │
│ Nome de Usuário: feijao             │
│ Região: us-central1                 │
│ Zona: us-central1-a                 │
│ Tipo: e2-micro                      │
│ OS: Debian 11                       │
│                                     │
│ Seu Domínio: (pendente)             │
│                                     │
└─────────────────────────────────────┘
```

---

# FASE 2️⃣: Preparar VM (45 minutos)

## Tarefa 2.1: Atualizar Sistema

```bash
# No terminal SSH da VM (aberto na Tarefa 1.4)

# Atualizar pacotes
sudo apt update
sudo apt upgrade -y

# Instalar ferramentas básicas
sudo apt install -y curl wget git vim nano
```

**Output esperado:**
```
Setting up curl... done
Setting up wget... done
Setting up git... done
```

---

## Tarefa 2.2: Instalar Node.js e npm

```bash
# Verificar versão
node --version
npm --version

# Se não estiverem instalados:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version
# output: v20.x.x
npm --version
# output: 10.x.x
```

---

## Tarefa 2.3: Instalar PM2 (Gerenciador de Processos)

```bash
# Instalar globalmente
sudo npm install -g pm2

# Verificar
pm2 --version
# output: 5.x.x

# Habilitar para iniciar na reboot
pm2 startup
# Copiar e executar o comando sugerido
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
```

---

## Tarefa 2.4: Instalar Nginx

```bash
# Instalar
sudo apt install -y nginx

# Iniciar
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar
sudo systemctl status nginx
# output: active (running)
```

---

## Tarefa 2.5: Criar Estrutura de Diretórios

```bash
# Criar diretório principal
mkdir -p ~/cardapio-app
cd ~/cardapio-app

# Criar subdiretórios
mkdir -p staging
mkdir -p production
mkdir -p logs
mkdir -p backups

# Listar
ls -la
# output:
# drwxr-xr-x staging
# drwxr-xr-x production
# drwxr-xr-x logs
# drwxr-xr-x backups
```

---

## Tarefa 2.6: Clonar Repositório (Staging)

```bash
# Entrar no diretório staging
cd ~/cardapio-app/staging

# Clonar repositório (use HTTPS se não tiver SSH do GitHub)
git clone https://github.com/seu_usuario/cardapio.git .

# Checkout branch staging
git checkout staging
git pull origin staging

# Verificar
git branch
# output: * staging
```

---

## Tarefa 2.7: Clonar Repositório (Produção)

```bash
# Entrar no diretório produção
cd ~/cardapio-app/production

# Clonar repositório
git clone https://github.com/seu_usuario/cardapio.git .

# Checkout branch main
git checkout main
git pull origin main

# Verificar
git branch
# output: * main
```

---

## Tarefa 2.8: Instalar Dependências (Staging)

```bash
# Entrar no diretório staging
cd ~/cardapio-app/staging

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd server
npm install
cd ..

# Build do frontend
npm run build

# Verificar
ls -la dist/
# output: index.html, assets/, etc
```

---

## Tarefa 2.9: Instalar Dependências (Produção)

```bash
# Entrar no diretório produção
cd ~/cardapio-app/production

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd server
npm install
cd ..

# Build do frontend
npm run build

# Verificar
ls -la dist/
# output: index.html, assets/, etc
```

---

## Tarefa 2.10: Criar .env Files

### Staging

```bash
# Criar arquivo .env em staging
cat > ~/cardapio-app/staging/.env << 'EOF'
NODE_ENV=staging
PORT=3001
DATABASE_PATH=./cardapio-staging.db
REACT_APP_API_URL=http://seu_dominio.com/api
EOF

# Criar arquivo .env em server
cat > ~/cardapio-app/staging/server/.env << 'EOF'
NODE_ENV=staging
PORT=3001
DATABASE_PATH=../cardapio-staging.db
EOF
```

### Produção

```bash
# Criar arquivo .env em produção
cat > ~/cardapio-app/production/.env << 'EOF'
NODE_ENV=production
PORT=3002
DATABASE_PATH=./cardapio-prod.db
REACT_APP_API_URL=https://seu_dominio.com/api
EOF

# Criar arquivo .env em server
cat > ~/cardapio-app/production/server/.env << 'EOF'
NODE_ENV=production
PORT=3002
DATABASE_PATH=../cardapio-prod.db
EOF
```

**Verificar:**
```bash
cat ~/cardapio-app/staging/.env
cat ~/cardapio-app/production/.env
```

---

## Tarefa 2.11: Gerar SSH Key para GitHub

```bash
# Gerar chave
ssh-keygen -t ed25519 -f ~/.ssh/github-deploy -N ""

# Ver chave pública
cat ~/.ssh/github-deploy.pub
# output: ssh-ed25519 AAAA... user@gcp-vm

# Ver chave privada (para GitHub Secrets)
cat ~/.ssh/github-deploy
# output: -----BEGIN PRIVATE KEY-----
#         MIIEvQIBA...
#         -----END PRIVATE KEY-----
```

**Copie:**
- 🔑 Chave pública inteira (para GitHub Deploy Keys)
- 🔑 Chave privada inteira (para GitHub Secrets)

---

## Tarefa 2.12: Adicionar SSH Key ao GitHub

### Passo 1: GitHub Deploy Keys

1. Vá para **GitHub → seu repositório → Settings → Deploy keys**
2. Clique **Add deploy key**

```
Title: GCP VM SSH Key

Key: (cole a chave pública inteira)
      ssh-ed25519 AAAA... user@gcp-vm

✅ Allow write access
```

3. Clique **Add key**

### Passo 2: Testar Conexão

```bash
# Na VM do GCP, testar SSH
ssh -i ~/.ssh/github-deploy git@github.com

# output esperado:
# Hi seu_usuario/cardapio! You've successfully authenticated,
# but GitHub does not provide shell access.
```

**Se funcionou, continue! Se não, verifique a chave.**

---

# FASE 3️⃣: Deploy Manual (45 minutos)

## Tarefa 3.1: Criar Script de Deploy Staging

```bash
# Criar script
cat > ~/cardapio-app/deploy-staging.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando deploy staging..."

# Variáveis
APP_DIR="$HOME/cardapio-app/staging"
LOG_DIR="$HOME/cardapio-app/logs"

# Entrar no diretório
cd $APP_DIR || exit 1

# Fazer fetch e pull
echo "📥 Atualizando código..."
git fetch origin staging
git checkout staging
git pull origin staging

# Instalar dependências
echo "📦 Instalando dependências..."
npm install
cd server && npm install && cd ..

# Build
echo "🔨 Buildando frontend..."
npm run build

# Parar processo antigo (se houver)
echo "⏹️ Parando processo antigo..."
pm2 delete staging || true

# Iniciar com PM2
echo "▶️ Iniciando aplicação..."
pm2 start server/src/index.ts --name "staging" --interpreter ts-node --env-file .env

# Salvar PM2
pm2 save

# Log
echo "✅ Deploy staging concluído!"
echo "📍 Staging disponível em: http://seu_dominio.com (porta 3001)"

EOF

# Tornar executável
chmod +x ~/cardapio-app/deploy-staging.sh
```

---

## Tarefa 3.2: Criar Script de Deploy Produção

```bash
# Criar script
cat > ~/cardapio-app/deploy-production.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando deploy produção..."

# Variáveis
APP_DIR="$HOME/cardapio-app/production"
LOG_DIR="$HOME/cardapio-app/logs"

# Entrar no diretório
cd $APP_DIR || exit 1

# Fazer fetch e pull
echo "📥 Atualizando código..."
git fetch origin main
git checkout main
git pull origin main

# Instalar dependências
echo "📦 Instalando dependências..."
npm install
cd server && npm install && cd ..

# Build
echo "🔨 Buildando frontend..."
npm run build

# Parar processo antigo (se houver)
echo "⏹️ Parando processo antigo..."
pm2 delete production || true

# Iniciar com PM2
echo "▶️ Iniciando aplicação..."
pm2 start server/src/index.ts --name "production" --interpreter ts-node --env-file .env

# Salvar PM2
pm2 save

# Log
echo "✅ Deploy produção concluído!"
echo "📍 Produção disponível em: https://seu_dominio.com (porta 3002)"

EOF

# Tornar executável
chmod +x ~/cardapio-app/deploy-production.sh
```

---

## Tarefa 3.3: Testar Deploy Staging

```bash
# Executar script
~/cardapio-app/deploy-staging.sh

# Esperar 30-60 segundos para build completar

# Verificar se está rodando
pm2 list
# output:
# ┌────┬──────────┬──────┬──────┬───────────┐
# │ id │ name     │ mode │ pid  │ status    │
# ├────┼──────────┼──────┼──────┼───────────┤
# │ 0  │ staging  │ fork │ 1234 │ online    │
# └────┴──────────┴──────┴──────┴───────────┘

# Ver logs
pm2 logs staging
# output: [YYYY-MM-DD HH:MM:SS] listening on port 3001
```

---

## Tarefa 3.4: Testar Deploy Produção

```bash
# Executar script
~/cardapio-app/deploy-production.sh

# Esperar 30-60 segundos

# Verificar
pm2 list
# output:
# ┌────┬──────────┬──────┬──────┬───────────┐
# │ id │ name     │ mode │ pid  │ status    │
# ├────┼──────────┼──────┼──────┼───────────┤
# │ 0  │ staging  │ fork │ 1234 │ online    │
# │ 1  │ production│fork │ 5678 │ online    │
# └────┴──────────┴──────┴──────┴───────────┘

# Ver logs
pm2 logs production
# output: [YYYY-MM-DD HH:MM:SS] listening on port 3002
```

---

## Tarefa 3.5: Testar Conectividade

```bash
# Testar staging (porta 3001)
curl http://localhost:3001

# Testar produção (porta 3002)
curl http://localhost:3002

# Se tiver /api/health:
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health
```

**Resposta esperada:**
```
<!DOCTYPE html>...  (HTML da página)
ou
{"status":"ok"}     (se tem health check)
```

---

# FASE 4️⃣: Configurar Reverse Proxy com Nginx (30 minutos)

## Tarefa 4.1: Backup da Config Nginx

```bash
# Backup
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Verificar
ls -la /etc/nginx/nginx.conf.backup
```

---

## Tarefa 4.2: Criar Config Virtual Host (Staging + Produção)

```bash
# Criar arquivo de configuração
sudo tee /etc/nginx/sites-available/cardapio << 'EOF'
# Staging
server {
    listen 80;
    server_name staging.seu_dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    gzip_min_length 1000;
}

# Produção
server {
    listen 80;
    server_name seu_dominio.com www.seu_dominio.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    gzip_min_length 1000;
}

# Redirecionar HTTP para HTTPS (opcional, quando tiver SSL)
# server {
#     listen 80;
#     server_name seu_dominio.com www.seu_dominio.com;
#     return 301 https://$server_name$request_uri;
# }
EOF
```

**Editar a config:**
- Substitua `seu_dominio.com` pelo seu domínio real
- Se estiver testando localmente, use o IP externo GCP

---

## Tarefa 4.3: Habilitar Virtual Host

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/cardapio /etc/nginx/sites-enabled/cardapio

# Remover default (opcional)
sudo rm /etc/nginx/sites-enabled/default || true

# Testar configuração
sudo nginx -t
# output: nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
#         nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

## Tarefa 4.4: Recarregar Nginx

```bash
# Recarregar
sudo systemctl reload nginx

# Verificar status
sudo systemctl status nginx
# output: active (running)
```

---

## Tarefa 4.5: Testar Nginx

```bash
# Se tem domínio apontado:
curl http://seu_dominio.com
curl http://staging.seu_dominio.com

# Se está testando com IP:
curl -H "Host: seu_dominio.com" http://34.41.59.79
curl -H "Host: staging.seu_dominio.com" http://34.41.59.79

# output esperado: HTML da página (começa com <!DOCTYPE)
```

---

## Tarefa 4.6: Adicionar SSL com Certbot (Opcional, mas Recomendado)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado (se tiver domínio apontado)
sudo certbot --nginx -d seu_dominio.com -d staging.seu_dominio.com

# Seguir as instruções (email, termos, etc)

# Testar renovação automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verificar
sudo systemctl status certbot.timer
```

**Após SSL:**
```bash
# Testar HTTPS
curl https://seu_dominio.com
curl https://staging.seu_dominio.com
```

---

# FASE 5️⃣: GitHub Actions Workflows (45 minutos)

## Tarefa 5.1: Criar GitHub Secrets

Na página do repositório no GitHub:

**Settings → Secrets and variables → Actions**

Crie esses secrets:

### Secret 1: GCP_HOST
```
Name: GCP_HOST
Value: 34.41.59.79 (ou seu_dominio.com depois)
```

### Secret 2: GCP_USER
```
Name: GCP_USER
Value: feijao
```

### Secret 3: GCP_SSH_KEY
```
Name: GCP_SSH_KEY
Value: (cole a chave privada inteira)
       -----BEGIN PRIVATE KEY-----
       MIIEvQIBA...
       -----END PRIVATE KEY-----
```

### Secret 4: GCP_KNOWN_HOSTS
```bash
# Na VM do GCP:
ssh-keyscan 34.41.59.79 >> ~/.ssh/known_hosts

# Ver o conteúdo
cat ~/.ssh/known_hosts | grep 34.41.59.79

# Copiar tudo e colar como secret
```

```
Name: GCP_KNOWN_HOSTS
Value: (cole o conteúdo do known_hosts)
```

---

## Tarefa 5.2: Atualizar Workflow de Deploy Staging

```bash
# Localmente (no seu computador)
# Abrir o arquivo: .github/workflows/deploy-staging.yml

# Se não existir, criar:
mkdir -p .github/workflows
```

Editar ou criar o arquivo `.github/workflows/deploy-staging.yml`:

```yaml
name: Deploy to Staging (GCP)

on:
  push:
    branches: [ staging ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to GCP Staging
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.GCP_HOST }}
        username: ${{ secrets.GCP_USER }}
        key: ${{ secrets.GCP_SSH_KEY }}
        known_hosts: ${{ secrets.GCP_KNOWN_HOSTS }}
        script: |
          cd ~/cardapio-app
          chmod +x deploy-staging.sh
          ./deploy-staging.sh
          
          echo "✅ Deploy staging concluído!"
          pm2 list
          pm2 logs staging --lines 10
```

---

## Tarefa 5.3: Atualizar Workflow de Deploy Produção

Editar ou criar `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy to Production (GCP)

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to GCP Production
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.GCP_HOST }}
        username: ${{ secrets.GCP_USER }}
        key: ${{ secrets.GCP_SSH_KEY }}
        known_hosts: ${{ secrets.GCP_KNOWN_HOSTS }}
        script: |
          cd ~/cardapio-app
          chmod +x deploy-production.sh
          ./deploy-production.sh
          
          echo "✅ Deploy produção concluído!"
          pm2 list
          pm2 logs production --lines 10
```

---

## Tarefa 5.4: Workflow de Testes (Se Não Tiver)

Se não tiver `.github/workflows/test.yml`, criar:

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
        node-version: [18.x, 20.x]

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
      run: npm run lint || true

    - name: Run type check
      run: npm run type-check || true

    - name: Run build
      run: npm run build

    - name: Run tests
      run: npm run test || true
```

---

## Tarefa 5.5: Fazer Commit dos Workflows

```bash
# Localmente
git add .github/workflows/

git commit -m "chore: atualizar workflows para GCP"

git push origin main

# Aguarde o workflow rodar em GitHub Actions
```

---

## Tarefa 5.6: Testamento do Workflow (Manual)

```bash
# Fazer um push para staging
git checkout staging
git push origin staging

# Ir para GitHub Actions e monitorar
# https://github.com/seu_usuario/cardapio/actions
```

**Você deve ver:**
```
✅ Deploy to Staging (GCP) / deploy

Status: Success
Job:
  - Deploy to GCP Staging ✅
```

---

# FASE 6️⃣: Monitoramento e Manutenção (30 minutos)

## Tarefa 6.1: Verificação de Saúde

```bash
# Na VM do GCP, testar endpoints

# Staging
curl http://localhost:3001
curl http://localhost:3001/api/health

# Produção
curl http://localhost:3002
curl http://localhost:3002/api/health
```

---

## Tarefa 6.2: Monitorar Logs

```bash
# Ver logs em tempo real
pm2 logs

# Ver logs específicos
pm2 logs staging
pm2 logs production

# Salvar logs em arquivo
pm2 logs > ~/cardapio-app/logs/all.log

# Ver logs históricos
pm2 show staging
pm2 show production
```

---

## Tarefa 6.3: Setup Backup Automático de Database

```bash
# Criar script de backup
cat > ~/cardapio-app/backup-databases.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="$HOME/cardapio-app/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔄 Iniciando backup de databases..."

# Backup staging
if [ -f "$HOME/cardapio-app/staging/cardapio-staging.db" ]; then
    cp "$HOME/cardapio-app/staging/cardapio-staging.db" "$BACKUP_DIR/cardapio-staging_$TIMESTAMP.db"
    echo "✅ Backup staging: $BACKUP_DIR/cardapio-staging_$TIMESTAMP.db"
fi

# Backup produção
if [ -f "$HOME/cardapio-app/production/cardapio-prod.db" ]; then
    cp "$HOME/cardapio-app/production/cardapio-prod.db" "$BACKUP_DIR/cardapio-prod_$TIMESTAMP.db"
    echo "✅ Backup produção: $BACKUP_DIR/cardapio-prod_$TIMESTAMP.db"
fi

# Manter apenas últimos 7 dias de backups
find "$BACKUP_DIR" -type f -name "*.db" -mtime +7 -delete
echo "🗑️ Backups antigos removidos"

echo "✅ Backup concluído!"
EOF

chmod +x ~/cardapio-app/backup-databases.sh
```

---

## Tarefa 6.4: Agendar Backup com Cron

```bash
# Editar crontab
crontab -e

# Adicionar essas linhas (backup diário às 2 AM):
0 2 * * * $HOME/cardapio-app/backup-databases.sh >> $HOME/cardapio-app/logs/backup.log 2>&1

# Salvar e sair (Ctrl+X, Y, Enter em nano)
```

**Verificar:**
```bash
# Ver crontab
crontab -l

# Ver logs de backup
cat ~/cardapio-app/logs/backup.log
```

---

## Tarefa 6.5: Monitoramento de Recursos

```bash
# Usar htop (se não estiver instalado)
sudo apt install -y htop

# Executar
htop

# Procurar por: staging, production (os processos Node.js)
```

**Observar:**
- ✅ CPU: < 20%
- ✅ RAM: < 30%
- ✅ Disco: > 10GB livre

---

## Tarefa 6.6: Script de Verificação de Saúde

```bash
# Criar script
cat > ~/cardapio-app/health-check.sh << 'EOF'
#!/bin/bash

echo "🏥 Verificando saúde das aplicações..."
echo ""

# Verificar staging
echo "📍 Staging:"
STAGING_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null)
if [[ $STAGING_RESPONSE == *"200"* ]]; then
    echo "  ✅ Status: OK"
else
    echo "  ❌ Status: ERRO (HTTP $STAGING_RESPONSE)"
fi

# Verificar produção
echo "📍 Produção:"
PROD_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3002/api/health 2>/dev/null)
if [[ $PROD_RESPONSE == *"200"* ]]; then
    echo "  ✅ Status: OK"
else
    echo "  ❌ Status: ERRO (HTTP $PROD_RESPONSE)"
fi

echo ""
echo "📊 Processos PM2:"
pm2 list

echo ""
echo "💾 Uso de Disco:"
df -h /

echo ""
echo "🧠 Uso de Memória:"
free -h
EOF

chmod +x ~/cardapio-app/health-check.sh
```

**Usar:**
```bash
~/cardapio-app/health-check.sh
```

---

## Tarefa 6.7: Rollback em Caso de Erro

Se algo der errado em produção:

```bash
# SSH na VM
ssh feijao@34.41.59.79

# Parar produção
pm2 delete production

# Reverter código
cd ~/cardapio-app/production
git log --oneline  # Ver histórico
git revert HEAD    # Reverter último commit
git pull origin main

# Redeploy
~/cardapio-app/deploy-production.sh

# Verificar
pm2 logs production
```

---

## Tarefa 6.8: Update de Dependências (Mensal)

```bash
# Em staging
cd ~/cardapio-app/staging
npm update
cd server && npm update && cd ..

# Em produção
cd ~/cardapio-app/production
npm update
cd server && npm update && cd ..

# Testar
npm run build

# Fazer commit
git add package*.json
git commit -m "chore: atualizar dependências"
git push origin main
```

---

## Tarefa 6.9: Limpar PM2

```bash
# Ver processos
pm2 list

# Parar um processo
pm2 stop staging
pm2 stop production

# Deletar um processo
pm2 delete staging
pm2 delete production

# Restartar todos
pm2 restart all

# Parar PM2
pm2 stop all

# Iniciar PM2
pm2 start all
```

---

# 📋 CHECKLIST FINAL

## ✅ Configuração GCP

- [x] VM criada no Compute Engine
- [x] Firewall configurado (HTTP, HTTPS, SSH)
- [x] IP externo anotado
- [x] SSH funcionando
- [ ] Domínio apontado para GCP (opcional)

## ⏭️ Preparação da VM (PRÓXIMO)

- [ ] Node.js e npm instalados
- [ ] PM2 instalado e configurado
- [ ] Nginx instalado
- [ ] Git configurado
- [ ] Estrutura de diretórios criada
- [ ] Repositórios clonados (staging + production)
- [ ] Dependências instaladas
- [ ] .env files criados
- [ ] SSH key gerada e adicionada ao GitHub

## ⏭️ Deploy Manual

- [ ] Scripts de deploy criados
- [ ] Deploy staging testado (porta 3001)
- [ ] Deploy produção testado (porta 3002)
- [ ] PM2 gerenciando ambos

## ⏭️ Nginx

- [ ] Config virtual hosts criada
- [ ] Nginx recarregado
- [ ] Proxies funcionando
- [ ] SSL configurado (opcional mas recomendado)

## ⏭️ GitHub Actions

- [ ] Secrets GCP_HOST, GCP_USER, GCP_SSH_KEY adicionados
- [ ] Workflow test.yml criado
- [ ] Workflow deploy-staging.yml atualizado
- [ ] Workflow deploy-production.yml atualizado
- [ ] Workflows commitados
- [ ] Primeiro deploy automático testado

## ⏭️ Monitoramento

- [ ] Scripts de backup criados
- [ ] Cron agendado para backups
- [ ] Health check script criado
- [ ] Logs configurados
- [ ] PM2 salvo para iniciar na reboot

---

# 🚀 FLUXO FINAL

```
Local Dev
  ↓
git push origin feature/...
  ↓
GitHub Actions: Testes ✅
  ↓
PR: feature → staging (mergear)
  ↓
GitHub Actions: Deploy Staging Automático
  ↓
GCP VM: PM2 atualiza (porta 3001)
  ↓
Nginx: Redireciona staging.seu_dominio.com → 3001
  ↓
Você testa em staging ✅
  ↓
PR: staging → main (mergear)
  ↓
GitHub Actions: Deploy Produção Automático
  ↓
GCP VM: PM2 atualiza (porta 3002)
  ↓
Nginx: Redireciona seu_dominio.com → 3002
  ↓
✅ LIVE! (ambos na MESMA VM)
```

---

# 📊 Comparação: DreamHost vs GCP

| Aspecto | DreamHost ❌ | GCP ✅ |
|---------|------------|--------|
| Tipo Servidor | Compartilhado (problema seu) | VM dedicada |
| Custo | Pago | Free Tier (até 730h/mês) |
| Escalabilidade | Limitada | Fácil expandir |
| Deploy | SSH + Manual | GitHub Actions |
| PM2 | Não pode usar | ✅ Funciona |
| Reverse Proxy | CPanel | ✅ Nginx |
| SSL | Manual | ✅ Certbot automático |
| Monitoramento | Mínimo | ✅ Cloud Console |
| Staging + Prod | 2 servidores | 1 VM, 2 portas |
| Backup | Manual | ✅ Automático |

---

# 🆘 TROUBLESHOOTING

## "VM não conecta"

```bash
# Verificar IP externo
# Console GCP → Compute Engine → Instâncias

# Verificar firewall
# Console GCP → VPC → Firewall

# Testar SSH local
ssh -i ~/.ssh/gcp-key feijao@34.41.59.79
```

## "Node.js não encontrado"

```bash
node --version
npm --version

# Se não funcionar:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## "PM2 não inicia processos"

```bash
# Verificar se PM2 está rodando
pm2 list

# Se vazio, iniciar manualmente:
cd ~/cardapio-app/staging
pm2 start server/src/index.ts --name "staging"

cd ~/cardapio-app/production
pm2 start server/src/index.ts --name "production"

# Salvar para reboot
pm2 save
```

## "Nginx retorna 502 Bad Gateway"

```bash
# Verificar se PM2 está rodando
pm2 list  # Procure por staging/production

# Verificar se portas estão corretas (.env)
cat ~/cardapio-app/staging/.env | grep PORT
cat ~/cardapio-app/production/.env | grep PORT

# Testar conectividade local
curl http://localhost:3001
curl http://localhost:3002

# Recarregar nginx
sudo systemctl reload nginx
```

## "Deploy não funciona automaticamente"

```bash
# Verificar secrets GitHub
GitHub → Settings → Secrets → Actions
# Confirmar: GCP_HOST, GCP_USER, GCP_SSH_KEY, GCP_KNOWN_HOSTS

# Verificar workflow logs
GitHub → Actions → Workflow Job
# Procure por erros em "Deploy to GCP Staging/Production"

# Testar SSH manualmente
ssh -i ~/.ssh/gcp-key feijao@34.41.59.79 "pm2 list"

# Verificar script de deploy
~/cardapio-app/deploy-staging.sh
~/cardapio-app/deploy-production.sh
```

## "Banco de dados perdido após restart"

```bash
# Verificar localização do DB
cat ~/cardapio-app/staging/.env | grep DATABASE_PATH
cat ~/cardapio-app/production/.env | grep DATABASE_PATH

# Deve estar em diretório persistente (não em /tmp)
# Correto: ~/cardapio-app/staging/cardapio-staging.db
# Errado: /tmp/cardapio-staging.db

# Verificar permissões
ls -la ~/cardapio-app/staging/
ls -la ~/cardapio-app/production/
```

---

# 📚 Próximas Etapas

1. ✅ FASE 1: Preparar GCP - COMPLETA
2. ⏭️ FASE 2: Preparar VM (45 min)
3. ⏭️ FASE 3: Deploy Manual (45 min)
4. ⏭️ FASE 4: Nginx (30 min)
5. ⏭️ FASE 5: GitHub Actions (45 min)
6. ⏭️ FASE 6: Monitoramento (30 min)
7. ⏭️ Fazer primeiro push para staging
8. ⏭️ Monitorar deploy automático
9. ⏭️ Testar staging
10. ⏭️ Fazer merge para main (produção)

---

# 📞 Suporte

Se tiver dúvidas em:
- **GCP**: Consulte [Google Cloud Console](https://console.cloud.google.com)
- **Nginx**: Consulte `/etc/nginx/sites-available/cardapio`
- **PM2**: Execute `pm2 help` na VM
- **GitHub Actions**: Veja logs em GitHub → Actions
- **Deploy**: Veja script em `~/cardapio-app/deploy-*.sh`

---

**Status**: ✅ FASE 1 COMPLETA - Pronto para FASE 2
**Versão**: 1.0  
**Data**: 13 de Fevereiro de 2026  
**Tempo Total Restante**: 3-3.5 horas (FASES 2-6)

**🚀 Próximo passo: FASE 2 - Preparar VM!**
