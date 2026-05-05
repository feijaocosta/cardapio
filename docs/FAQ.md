# ❓ Perguntas Frequentes (FAQ)

## 🚀 Instalação e Configuração

### Como instalo o sistema?

```bash
npm install
npm run dev
```

Veja o guia completo em [INSTALACAO.md](/INSTALACAO.md)

### Por que o sistema não abre no navegador?

- Certifique-se de que está executando `npm run dev`
- Não abra o `index.html` diretamente
- Acesse http://localhost:5173 no navegador
- Verifique se a porta 5173 não está ocupada

### Como faço build para produção?

```bash
npm run build
npm run preview
```

Os arquivos estarão em `dist/`

---

## 💾 Banco de Dados e Dados

### Onde os dados são salvos?

Os dados são salvos no **localStorage** do navegador. Cada navegador e dispositivo mantém seus próprios dados.

### Quanto espaço tenho disponível?

- **localStorage**: ~5-10MB (dependendo do navegador)
- **Recomendado**: Até 1000 pedidos sem problemas
- **Limite prático**: Monitore o uso de espaço

### Como faço backup dos dados?

Veja o guia completo em [MIGRACAO_DADOS.md](/MIGRACAO_DADOS.md)

**Resumo rápido**:
```javascript
// No console do navegador (F12)
const backup = localStorage.getItem('sqliteDb');
console.log(backup); // Copie este valor
```

### Os dados são sincronizados entre dispositivos?

**Não**. Cada navegador/dispositivo mantém seus próprios dados. Para sincronizar:
1. Faça backup no dispositivo A
2. Importe no dispositivo B

### Posso usar um banco de dados real?

Este projeto usa SQLite no navegador. Para banco real:
1. Adicione backend (Node.js, Python, etc.)
2. Configure PostgreSQL, MySQL, etc.
3. Modifique `/src/lib/database.ts` para fazer chamadas API

---

## 🎨 Customização e Temas

### Como adiciono mais temas de cores?

Edite `/src/lib/database.ts`:

```typescript
export const AVAILABLE_THEMES: Theme[] = [
  // ... temas existentes ...
  {
    id: 'meutema',
    name: 'Meu Tema',
    primary: 'bg-cyan-500',
    primaryHover: 'hover:bg-cyan-600',
    gradient: 'from-cyan-50 to-teal-50',
    textPrimary: 'text-cyan-600'
  }
];
```

### Como personalizo as cores completamente?

Edite `/src/styles/globals.css` e adicione suas classes Tailwind personalizadas.

### Posso mudar o logo do sistema?

Sim! Cada cardápio pode ter seu próprio logo. Configure na aba "Cardápios" do admin.

### Como adiciono fontes personalizadas?

Em `/src/styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=SuaFonte&display=swap');

body {
  font-family: 'SuaFonte', sans-serif;
}
```

---

## 📱 Funcionalidades

### Como adiciono um novo cardápio?

1. Acesse "Visão Admin"
2. Clique na aba "Cardápios"
3. Preencha o formulário "Criar Novo Cardápio"
4. Adicione itens ao cardápio

### Um item pode estar em vários cardápios?

**Sim!** Um mesmo item pode ser adicionado a quantos cardápios você quiser.

### Como desativo um cardápio temporariamente?

Na aba "Cardápios", clique no ícone de olho (👁️) para ativar/desativar.

### Posso ocultar os preços?

Sim! Na aba "Configurações", use o toggle "Exibir Preços no Cardápio".

### Como adiciono imagens aos itens?

Atualmente, apenas cardápios suportam logos. Para adicionar imagens a itens:
1. Use a descrição com emoji: "🍕 Pizza deliciosa"
2. Ou modifique o código para suportar campo de imagem

---

## 🔒 Segurança e Privacidade

### Os dados são seguros?

- Dados ficam **apenas no navegador** do usuário
- **Não há servidor** que armazena dados
- **Não há comunicação** com servidores externos
- **Risco**: Se limpar cache, perde os dados

### Posso usar para dados sensíveis?

**Não recomendado**. Este sistema:
- Não tem autenticação
- Não tem criptografia
- Dados podem ser acessados por qualquer um com acesso ao navegador

### Como protejo o painel admin?

Atualmente não há proteção. Para adicionar:
1. Implemente sistema de login
2. Use autenticação JWT
3. Adicione backend com controle de acesso

---

## 🌐 Deploy e Hospedagem

### Onde posso hospedar gratuitamente?

- **Vercel**: https://vercel.com (recomendado)
- **Netlify**: https://netlify.com
- **GitHub Pages**: https://pages.github.com
- **Cloudflare Pages**: https://pages.cloudflare.com

### Como faço deploy no Vercel?

1. Crie conta em vercel.com
2. Conecte seu repositório GitHub
3. Vercel detecta automaticamente Vite
4. Deploy automático!

### Preciso de servidor?

**Não!** É uma aplicação totalmente frontend. Qualquer hospedagem de arquivos estáticos funciona.

### Como configuro domínio próprio?

Depende da plataforma:
- **Vercel/Netlify**: Configure DNS nas configurações
- **GitHub Pages**: Configure em Settings > Pages
- Veja documentação da plataforma escolhida

---

## 🐛 Problemas Comuns

### Erro: "Cannot find module 'sql.js'"

```bash
npm install sql.js @types/sql.js
```

### Erro: "sql-wasm.wasm not found"

```bash
npm install -D vite-plugin-static-copy
npm run build
```

### Página em branco após deploy

1. Verifique o console (F12) por erros
2. Certifique-se de fazer `npm run build` antes
3. Verifique se os arquivos .wasm estão em `dist/assets/`

### Dados sumiram depois de limpar cache

- **Solução**: Restaure do backup
- **Prevenção**: Faça backups regulares (veja [MIGRACAO_DADOS.md](/MIGRACAO_DADOS.md))

### Sistema lento com muitos pedidos

- **Causa**: localStorage tem limite de performance
- **Solução temporária**: Exporte pedidos antigos
- **Solução permanente**: Migre para backend real

---

## 📊 Desempenho

### Quantos pedidos o sistema suporta?

- **Recomendado**: Até 1000 pedidos
- **Máximo teórico**: ~5000-10000 (dependendo do navegador)
- **Limitação**: Tamanho do localStorage (5-10MB)

### Como limpo pedidos antigos?

Atualmente não há função automática. Para implementar:
1. Adicione botão "Limpar Pedidos Antigos"
2. Execute: `db.run('DELETE FROM orders WHERE date < ?', [dataLimite])`

### O sistema funciona offline?

**Sim**, após o primeiro carregamento! Exceto:
- Carregar logos externos (URLs)
- CDN do sql.js (em dev mode)

---

## 🔄 Atualizações

### Como atualizo para nova versão?

1. Faça backup dos dados
2. Baixe nova versão do código
3. Execute `npm install`
4. Execute `npm run dev`
5. Dados serão migrados automaticamente

### Perco dados ao atualizar?

**Não**, desde que:
- Não limpe o cache do navegador
- Não mude de navegador/dispositivo
- Faça backup antes (recomendado)

### Como sei qual versão estou usando?

Veja em `package.json`:
```json
{
  "version": "2.0.0"
}
```

---

## 💡 Dicas e Truques

### Como adiciono mais campos aos itens?

1. Edite `database.ts`:
```typescript
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string; // NOVO CAMPO
  imageUrl?: string; // NOVO CAMPO
}
```

2. Atualize o schema SQL:
```typescript
db.run(`
  ALTER TABLE menu_items 
  ADD COLUMN category TEXT;
`);
```

3. Atualize os componentes para usar os novos campos

### Como exporto relatório de pedidos?

```javascript
// No console do navegador
import('./src/lib/database.js').then(async (db) => {
  await db.initDatabase();
  const orders = db.getOrders();
  
  const csv = [
    ['ID', 'Cliente', 'Total', 'Data'].join(','),
    ...orders.map(o => 
      [o.id, o.customerName, o.total, o.date].join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pedidos.csv';
  a.click();
});
```

### Como adiciono campo de observações ao pedido?

Modifique:
1. Interface `Order` em `database.ts`
2. Tabela `orders` (adicione coluna `notes`)
3. Formulário em `customer-view.tsx`
4. Exibição em `admin-view.tsx`

---

## 🎯 Casos de Uso Específicos

### Posso usar para delivery?

Sim, mas considere:
- Adicionar campo de endereço
- Status do pedido (preparando, enviando, entregue)
- Sistema de notificações
- Integração com WhatsApp/Telegram

### Posso integrar com impressora térmica?

Sim, através de:
- Bibliotecas JavaScript para impressão
- WebUSB API (Chrome)
- Ou botão "Imprimir" simples do navegador

### Posso adicionar pagamento online?

Sim, integre com:
- Stripe: https://stripe.com
- Mercado Pago: https://mercadopago.com.br
- PagSeguro: https://pagseguro.uol.com.br
- PayPal: https://paypal.com

---

## 📞 Suporte e Comunidade

### Onde reporto bugs?

- Abra uma Issue no GitHub
- Ou documente o erro e contexto

### Posso contribuir com o projeto?

Sim! Pull requests são bem-vindos.

### Posso usar comercialmente?

Sim! Licença MIT permite uso comercial.

### Preciso dar créditos?

Não é obrigatório, mas é apreciado! 😊

---

## 🔮 Roadmap Futuro

### Funcionalidades planejadas:

- [ ] Sistema de autenticação
- [ ] Backend opcional (Node.js/Express)
- [ ] App mobile (React Native)
- [ ] Notificações push
- [ ] Relatórios avançados
- [ ] Multi-idioma
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Impressão de pedidos
- [ ] QR Code para cardápios

---

## 📚 Recursos Adicionais

- [INSTALACAO.md](/INSTALACAO.md) - Guia de instalação
- [ATUALIZACOES.md](/ATUALIZACOES.md) - Changelog detalhado
- [MIGRACAO_DADOS.md](/MIGRACAO_DADOS.md) - Backup e migração
- [README.md](/README.md) - Visão geral do projeto

---

**Não encontrou sua pergunta?**

Abra uma Issue no GitHub ou crie uma discussão!

---

**Última Atualização**: Dezembro 2024  
**Versão**: 2.0
