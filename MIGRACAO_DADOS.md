# 🔄 Guia de Migração e Backup de Dados

## 📦 Backup Manual dos Dados

### Exportar Dados do Navegador

1. Abra o site onde o sistema está rodando
2. Pressione **F12** para abrir as DevTools
3. Vá para a aba **Console**
4. Execute o seguinte código:

```javascript
// Exportar dados do banco SQLite
const backup = localStorage.getItem('sqliteDb');
if (backup) {
  // Criar arquivo para download
  const blob = new Blob([backup], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-sqlite-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('✅ Backup realizado com sucesso!');
} else {
  console.log('❌ Nenhum dado encontrado para backup');
}
```

5. Um arquivo será baixado com o nome `backup-sqlite-YYYY-MM-DD.json`
6. Guarde este arquivo em local seguro

### Importar Dados para o Navegador

1. Abra o site onde deseja restaurar os dados
2. Pressione **F12** para abrir as DevTools
3. Vá para a aba **Console**
4. Copie o conteúdo do arquivo de backup
5. Execute:

```javascript
// Cole o conteúdo do backup entre as aspas
const backupData = `COLE_AQUI_O_CONTEUDO_DO_ARQUIVO`;

// Importar para o localStorage
localStorage.setItem('sqliteDb', backupData);
console.log('✅ Dados importados com sucesso!');

// Recarregar a página
location.reload();
```

---

## 🔄 Migração entre Navegadores

### Do Chrome para Firefox (ou vice-versa)

1. **No navegador de origem**:
   - Execute o script de exportação acima
   - Baixe o arquivo de backup

2. **No navegador de destino**:
   - Abra o sistema
   - Execute o script de importação
   - Cole o conteúdo do backup

---

## 🌐 Migração entre Dispositivos

### Do Desktop para Mobile

1. **No Desktop**:
   - Faça o backup dos dados
   - Envie o arquivo para seu email ou serviço de nuvem

2. **No Mobile**:
   - Acesse o sistema
   - Use um editor de texto para copiar o conteúdo do backup
   - Execute o script de importação no console do navegador mobile
   - (Dica: Use o modo desktop no navegador mobile para acessar DevTools)

---

## 📊 Script Avançado de Backup

### Backup com Estatísticas

```javascript
// Exportar com informações detalhadas
const backup = localStorage.getItem('sqliteDb');
if (backup) {
  const size = new Blob([backup]).size;
  const sizeKB = (size / 1024).toFixed(2);
  const sizeMB = (size / 1024 / 1024).toFixed(2);
  
  console.log('📊 Informações do Backup:');
  console.log(`   Tamanho: ${sizeKB} KB (${sizeMB} MB)`);
  console.log(`   Data: ${new Date().toLocaleString('pt-BR')}`);
  
  // Download
  const blob = new Blob([backup], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.href = url;
  a.download = `backup-sqlite-${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('✅ Backup realizado com sucesso!');
}
```

---

## 🔍 Verificar Integridade dos Dados

### Verificar o que está armazenado

```javascript
// Ver estatísticas do banco
const backup = localStorage.getItem('sqliteDb');
if (backup) {
  try {
    const data = JSON.parse(backup);
    const size = data.length;
    console.log('📊 Estatísticas do Banco:');
    console.log(`   Registros no array: ${size}`);
    console.log(`   Tamanho total: ${(new Blob([backup]).size / 1024).toFixed(2)} KB`);
    
    // Verificar se há outros dados no localStorage
    console.log('\n📦 Outros dados no localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== 'sqliteDb') {
        const value = localStorage.getItem(key);
        console.log(`   ${key}: ${(new Blob([value]).size / 1024).toFixed(2)} KB`);
      }
    }
  } catch (e) {
    console.error('❌ Erro ao analisar dados:', e);
  }
}
```

---

## 🗑️ Limpar Dados

### Limpar apenas o banco de dados

```javascript
// Limpar somente dados do SQLite
if (confirm('⚠️ Tem certeza que deseja limpar todos os dados do banco?')) {
  localStorage.removeItem('sqliteDb');
  console.log('✅ Banco de dados limpo!');
  location.reload();
}
```

### Limpar todos os dados do localStorage

```javascript
// ATENÇÃO: Isto remove TODOS os dados do site
if (confirm('⚠️ ATENÇÃO: Isto irá limpar TODOS os dados do site. Continuar?')) {
  localStorage.clear();
  console.log('✅ Todos os dados foram limpos!');
  location.reload();
}
```

---

## 🔧 Migração de Versões

### De Versão 1.0 para 2.0

A migração é automática! Quando você abre o sistema pela primeira vez após atualizar:

1. O sistema detecta o banco antigo
2. Cria automaticamente as novas tabelas:
   - `menus` (cardápios)
   - `menu_menu_items` (relacionamento)
   - `settings` (configurações)
3. Cria um cardápio padrão "Cardápio Geral"
4. Associa todos os itens existentes a este cardápio
5. Define configurações padrão (preços visíveis, tema laranja)

**Nenhuma ação manual necessária!**

### Verificar se a Migração Funcionou

```javascript
// Executar no console após atualizar
console.log('🔍 Verificando migração...');

// Tentar acessar funções do novo sistema
import('./src/lib/database.js').then(db => {
  db.initDatabase().then(() => {
    const menus = db.getMenus();
    const settings = db.getSettings();
    console.log('✅ Migração bem-sucedida!');
    console.log('   Cardápios:', menus.length);
    console.log('   Configurações:', settings);
  }).catch(err => {
    console.error('❌ Erro na migração:', err);
  });
});
```

---

## 📅 Backup Automático (Futuro)

### Exemplo de implementação

```javascript
// Adicionar ao código (futuro)
function autoBackup() {
  const lastBackup = localStorage.getItem('lastBackup');
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  if (!lastBackup || (now - parseInt(lastBackup)) > dayInMs) {
    const backup = localStorage.getItem('sqliteDb');
    // Enviar para servidor, email, ou download automático
    localStorage.setItem('lastBackup', now.toString());
    console.log('✅ Backup automático realizado');
  }
}

// Executar ao carregar a página
autoBackup();
```

---

## 🆘 Recuperação de Emergência

### Se perdeu os dados

1. **Verifique lixeira do navegador**:
   - Chrome: chrome://settings/clearBrowserData
   - Firefox: about:preferences#privacy
   - Pode haver dados em cache

2. **Verifique outros dispositivos**:
   - Se usou sincronização do navegador
   - Dados podem estar em outro dispositivo

3. **Histórico de downloads**:
   - Se fez backup antes
   - Verifique pasta de Downloads

### Se o banco está corrompido

```javascript
// Tentar reparar banco corrompido
const backup = localStorage.getItem('sqliteDb');
if (backup) {
  try {
    // Tentar parsear
    const data = JSON.parse(backup);
    console.log('✅ Banco parece estar íntegro');
  } catch (e) {
    console.error('❌ Banco corrompido!');
    console.log('💡 Tentando recuperar...');
    
    // Criar backup do corrompido
    localStorage.setItem('sqliteDb_corrupted', backup);
    
    // Limpar e reiniciar
    localStorage.removeItem('sqliteDb');
    console.log('✅ Banco limpo. Recarregue a página para reiniciar.');
  }
}
```

---

## 📱 Exportar para JSON Legível

### Converter dados do SQLite para JSON legível

```javascript
// ATENÇÃO: Isto requer o sistema estar rodando
// Execute no console da página

import('./src/lib/database.js').then(async (db) => {
  await db.initDatabase();
  
  const data = {
    menus: db.getMenus(),
    items: db.getMenuItems(),
    orders: db.getOrders(),
    settings: db.getSettings(),
    exported: new Date().toISOString()
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `export-readable-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('✅ Exportação legível concluída!');
});
```

---

## 🔐 Segurança dos Backups

### Boas Práticas

1. **Não compartilhe backups publicamente**
   - Contém dados dos seus clientes
   - Pode conter informações sensíveis

2. **Armazene em local seguro**
   - Serviço de nuvem privado
   - Disco externo
   - Pen drive criptografado

3. **Faça backups regulares**
   - Diariamente se tiver muito movimento
   - Semanalmente para uso moderado
   - Mensalmente para pouco uso

4. **Teste a restauração**
   - Faça backup
   - Teste restaurar em outro navegador
   - Confirme que tudo funciona

---

## 📋 Checklist de Backup

- [ ] Exportei os dados do localStorage
- [ ] Salvei o arquivo de backup
- [ ] Testei a importação em outro navegador
- [ ] Armazenei o backup em local seguro
- [ ] Documentei a data do último backup
- [ ] Configurei lembretes para backups futuros

---

**Última Atualização**: Dezembro 2024  
**Versão**: 2.0
