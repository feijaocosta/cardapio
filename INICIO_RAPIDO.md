# ⚡ Início Rápido - 5 Minutos para o Primeiro Pedido

## 🎯 Objetivo
Ter o sistema funcionando e fazer seu primeiro pedido em menos de 5 minutos!

---

## ✅ Passo 1: Instalação (1 minuto)

```bash
# 1. Entre na pasta do projeto
cd sistema-pedidos

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm run dev
```

✅ **Sucesso**: Você verá uma mensagem como:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 👀 Passo 2: Abra no Navegador (10 segundos)

1. Abra seu navegador
2. Acesse: **http://localhost:5173**
3. Você verá a tela de "Selecione um Cardápio"

✅ **Sucesso**: Interface carregada!

---

## 🎨 Passo 3: Configure o Visual (30 segundos)

1. Clique em **"Alternar para Visão Admin"** no canto superior direito
2. Clique na aba **"Configurações"**
3. Escolha um tema de cor (experimente alguns!)
4. Veja a pré-visualização mudar em tempo real

✅ **Sucesso**: Tema personalizado!

---

## 📋 Passo 4: Crie um Cardápio Personalizado (1 minuto)

1. Clique na aba **"Cardápios"**
2. Preencha o formulário:
   - **Nome**: "Meu Cardápio"
   - **Descrição**: "Cardápio de teste"
   - **URL do Logo** (opcional): deixe em branco
3. Clique em **"Criar Cardápio"**

✅ **Sucesso**: Cardápio criado!

---

## 🍕 Passo 5: Adicione Seus Próprios Itens (1 minuto)

1. Clique na aba **"Itens"**
2. Preencha o formulário:
   - **Nome**: "Minha Pizza Especial"
   - **Preço**: 45.90
   - **Descrição**: "Pizza com ingredientes especiais"
3. Clique em **"Adicionar Item"**

Repita para mais alguns itens se desejar!

✅ **Sucesso**: Itens criados!

---

## 🔗 Passo 6: Associe Itens ao Cardápio (1 minuto)

1. Ainda na aba **"Cardápios"**
2. Encontre "Meu Cardápio" que você criou
3. Clique no ícone de **edição** (lápis)
4. Veja a seção "Adicionar Itens"
5. Clique no **"+"** ao lado de cada item que deseja adicionar

✅ **Sucesso**: Cardápio com itens!

---

## 🛒 Passo 7: Faça Seu Primeiro Pedido (1 minuto)

1. Clique em **"Alternar para Visão Cliente"**
2. Você verá "Meu Cardápio" na lista
3. Clique nele
4. Digite seu nome: "Teste Cliente"
5. Adicione quantidades aos itens (botão **+**)
6. Veja o total calculado
7. Clique em **"Fazer Pedido"**

✅ **Sucesso**: Pedido realizado! 🎉

---

## 🎯 Passo 8: Veja o Pedido no Admin (30 segundos)

1. Clique em **"Alternar para Visão Admin"**
2. A aba **"Pedidos"** já estará selecionada
3. Veja seu pedido no topo da lista!

✅ **Sucesso**: Sistema completo funcionando!

---

## 🚀 O Que Fazer Agora?

### Opção 1: Personalize Mais 🎨
- Experimente diferentes temas
- Adicione mais cardápios (Kids, Executivo, etc.)
- Crie mais itens variados
- Adicione logos aos cardápios

### Opção 2: Teste Funcionalidades 🧪
- Faça mais pedidos
- Teste ocultar/mostrar preços
- Ative/desative cardápios
- Adicione um item em múltiplos cardápios

### Opção 3: Faça Deploy 🌐
- Escolha uma plataforma (Vercel, Netlify)
- Faça deploy para o mundo ver
- Compartilhe com amigos/clientes

---

## 📊 Checklist Completo

- [ ] Instalou as dependências (`npm install`)
- [ ] Iniciou o servidor (`npm run dev`)
- [ ] Acessou http://localhost:5173
- [ ] Alternou para Visão Admin
- [ ] Escolheu um tema de cores
- [ ] Criou um cardápio personalizado
- [ ] Adicionou itens ao cardápio
- [ ] Associou itens ao cardápio
- [ ] Voltou para Visão Cliente
- [ ] Fez um pedido de teste
- [ ] Viu o pedido no Admin

✅ **Tudo marcado?** Você dominou o básico!

---

## 🎓 Próximos Passos de Aprendizado

1. **Leia a FAQ**: [FAQ.md](/FAQ.md)
2. **Entenda o Banco**: [MIGRACAO_DADOS.md](/MIGRACAO_DADOS.md)
3. **Veja as Atualizações**: [ATUALIZACOES.md](/ATUALIZACOES.md)
4. **Guia de Deploy**: [INSTALACAO.md](/INSTALACAO.md) seção Deploy

---

## 💡 Dicas Pro

### Atalhos Úteis

- **F12**: Abrir DevTools (console)
- **Ctrl+Shift+R**: Recarregar sem cache
- **Ctrl+R**: Recarregar página

### Comandos Úteis

```bash
# Ver logs detalhados
npm run dev -- --debug

# Build otimizado
npm run build

# Testar build de produção
npm run preview

# Limpar cache
rm -rf node_modules .vite
npm install
```

### Scripts de Console

```javascript
// Ver dados do banco (F12 > Console)
localStorage.getItem('sqliteDb')

// Fazer backup rápido
const backup = localStorage.getItem('sqliteDb');
console.log('Backup:', backup);

// Limpar dados
localStorage.removeItem('sqliteDb');
location.reload();
```

---

## 🐛 Problemas Comuns Neste Estágio

### "npm: command not found"
**Solução**: Instale Node.js de https://nodejs.org

### Porta 5173 já está em uso
**Solução**: 
```bash
# Use outra porta
npm run dev -- --port 3000
```

### Página em branco
**Solução**:
1. Abra F12 e veja erros
2. Verifique se executou `npm install`
3. Tente `npm run dev` novamente

### Não vejo os dados
**Solução**:
1. Verifique se está no mesmo navegador
2. Não use modo anônimo/privado
3. Verifique localStorage (F12 > Application > Local Storage)

---

## 🎯 Teste de 1 Minuto

**Desafio**: Consegue fazer isto em 1 minuto?

1. Crie um novo cardápio "Express"
2. Adicione 3 itens ao cardápio
3. Faça um pedido com 2 itens
4. Veja o pedido no admin

⏱️ **Cronômetro**: Pronto? Vai!

---

## 🌟 Parabéns!

Você completou o início rápido! Agora você sabe:

- ✅ Instalar e executar o sistema
- ✅ Navegar entre Cliente e Admin
- ✅ Criar e gerenciar cardápios
- ✅ Adicionar e organizar itens
- ✅ Fazer e visualizar pedidos
- ✅ Personalizar temas e configurações

**Continue explorando e divirta-se! 🚀**

---

## 📞 Precisa de Ajuda?

- 📖 [FAQ.md](/FAQ.md) - Perguntas frequentes
- 📚 [README.md](/README.md) - Documentação completa
- 🔧 [INSTALACAO.md](/INSTALACAO.md) - Guia técnico
- 💬 Abra uma Issue no GitHub

---

**Tempo Total Estimado**: ⏱️ **5 minutos**  
**Dificuldade**: 🟢 **Fácil**  
**Pré-requisitos**: Node.js instalado  

**Versão**: 2.0  
**Última Atualização**: Dezembro 2024

---

## 🎁 Bônus: GIF Tutorial

```
[Aqui você pode adicionar GIFs ou screenshots mostrando cada passo]

1. Terminal executando npm run dev
2. Tela inicial do sistema
3. Painel admin com configurações
4. Criando um cardápio
5. Adicionando itens
6. Fazendo um pedido
7. Visualizando no admin
```

---

**Pronto para o próximo nível?**  
Explore funcionalidades avançadas em [ATUALIZACOES.md](/ATUALIZACOES.md)! 🚀
