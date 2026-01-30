// 🔍 GUIA DE DEBUG - VERIFICAR NO CONSOLE DO NAVEGADOR (F12)
// ============================================================

// 1. Abra http://localhost:5173/
// 2. Abra o Console (F12)
// 3. Procure por estas mensagens:

// ✅ Se está carregando o tema correto:
console.log('📊 DEBUG customer-view.tsx - Theme carregado: modern');

// ✅ Se está selecionando o layout correto:
console.log('🎨 getLayout() chamado com key: modern');
console.log('✅ Retornando ModernLayout');

// ============================================================
// CHECKLIST DO QUE PROCURAR:
// ============================================================

// Na rota / (listagem):
// [ ] "📊 DEBUG customer-view.tsx - Theme carregado: modern" (ou outro tema)
// [ ] "🎨 getLayout() chamado com key: modern"
// [ ] "✅ Retornando ModernLayout" (ou outro layout)

// Na rota /menu/1 (cardápio específico):
// [ ] "🍽️ Renderizando cardápio específico: 1"
// [ ] "📋 Cardápio selecionado: ..." (nome do cardápio)

// Ao clicar em "Voltar aos Cardápios":
// [ ] "🔍 CustomerViewPage - menuId: undefined"
// [ ] "📋 Renderizando listagem de cardápios"
// [ ] "📊 DEBUG customer-view.tsx - Theme carregado: ..." (deve carregar novamente!)
// [ ] O layout deve ser o CORRETO (não mais "default")

// ============================================================
// SE AINDA ESTIVER ERRADO:
// ============================================================
// 1. Qual tema mostra no console? (default/modern/image-based)
// 2. Qual layout está sendo renderizado?
// 3. O tema está diferente quando volta de /menu/:menuId?
