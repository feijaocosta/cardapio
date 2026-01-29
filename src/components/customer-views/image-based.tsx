import { ShoppingCart, Plus, Minus, ChevronLeft, Leaf, Coffee } from 'lucide-react';
import { type LayoutProps } from './types';
import { type MenuItem } from '../../../services/api';

/**
 * Instituto Atos Layout - Premium & Elegant Design
 * 
 * Inspirado no design refinado e sofisticado da imagem de referência do Instituto Atos.
 * 
 * Características principais:
 * - Paleta de cores neutra com destaque em ouro/dourado
 * - Layout em DUAS COLUNAS para itens do cardápio
 * - Elementos decorativos botanicais (folhas, flores minimalistas)
 * - Tipografia elegante com serif para títulos
 * - Organização por categorias com visual separado
 * - Design premium minimalista
 * - Estrutura magazine/jornal com texto + imagens decorativas
 */

// Decorative botanical elements - SVG icons
const DecorativeFlower = () => (
  <svg className="w-12 h-12 text-amber-300 opacity-40" viewBox="0 0 100 100" fill="currentColor">
    <circle cx="50" cy="50" r="8" />
    <circle cx="50" cy="20" r="6" />
    <circle cx="80" cy="50" r="6" />
    <circle cx="50" cy="80" r="6" />
    <circle cx="20" cy="50" r="6" />
    <circle cx="70" cy="30" r="5" opacity="0.6" />
    <circle cx="70" cy="70" r="5" opacity="0.6" />
    <circle cx="30" cy="30" r="5" opacity="0.6" />
    <circle cx="30" cy="70" r="5" opacity="0.6" />
  </svg>
);

export function ImageBasedLayout({
  menus,
  selectedMenu,
  menuItems,
  customerName,
  quantities,
  showSuccess,
  showPrice,
  onSelectMenu,
  onBackToMenus,
  onCustomerNameChange,
  onQuantityChange,
  onSubmitOrder,
  calculateTotal,
}: LayoutProps) {
  const total = calculateTotal();
  const hasItems = Object.values(quantities).some(q => q > 0);

  // Agrupa itens por categorias
  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.name?.split(/[-:]/)[0]?.trim() || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categories = Object.keys(groupedItems);

  // Menu Selection Screen
  if (!selectedMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 p-4 md:p-8">
        {/* Background decorative circles */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-amber-200 rounded-full opacity-5 -mr-48 -mt-48 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-80 h-80 bg-amber-100 rounded-full opacity-5 -ml-40 -mb-40 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-serif text-stone-900 mb-4 tracking-widest">
              Instituto Atos
            </h1>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-400" />
              <DecorativeFlower />
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
            <p className="text-stone-600 font-light tracking-widest text-base">
              CARDÁPIO DIGITAL PREMIUM
            </p>
          </div>

          {menus.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center border border-amber-100">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30 text-stone-400" />
              <p className="text-stone-600 font-light">Nenhum cardápio disponível no momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map(menu => (
                <button
                  key={menu.id}
                  onClick={() => onSelectMenu(menu)}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-amber-100 hover:border-amber-400 text-left"
                >
                  {menu.logo ? (
                    <div className="overflow-hidden h-40">
                      <img 
                        src={menu.logo} 
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-50">
                      <DecorativeFlower />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-serif text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                      {menu.name}
                    </h3>
                    {menu.description && (
                      <p className="text-stone-600 text-sm font-light line-clamp-2">{menu.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Order Screen - TWO-COLUMN LAYOUT WITH DECORATIVE ELEMENTS
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 p-4 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-amber-200 rounded-full opacity-5 -mr-48 -mt-48 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-amber-100 rounded-full opacity-5 -ml-40 -mb-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header com botão voltar */}
        <button
          onClick={onBackToMenus}
          className="flex items-center gap-2 text-stone-600 hover:text-amber-700 mb-8 transition-colors font-light text-sm tracking-wide"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar aos Cardápios
        </button>

        {/* Menu Title Section */}
        <div className="mb-12 text-center relative">
          {selectedMenu.logo ? (
            <div className="mb-8 rounded-lg overflow-hidden max-w-2xl mx-auto">
              <img 
                src={selectedMenu.logo} 
                alt={selectedMenu.name}
                className="w-full h-64 object-cover"
              />
            </div>
          ) : null}
          
          <h1 className="text-5xl md:text-6xl font-serif text-stone-900 mb-4 tracking-wide">
            {selectedMenu.name}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400" />
            <Leaf className="w-5 h-5 text-amber-400 opacity-60" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          
          {selectedMenu.description && (
            <p className="text-stone-600 font-light leading-relaxed max-w-2xl mx-auto text-base">
              {selectedMenu.description}
            </p>
          )}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 rounded-lg p-4 mb-8 flex items-center gap-3 max-w-2xl mx-auto">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">✓</div>
            <p className="text-emerald-900 font-light">Seu pedido foi realizado com sucesso!</p>
          </div>
        )}

        {/* Menu Items - TWO COLUMN LAYOUT */}
        {menuItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-amber-100 max-w-4xl mx-auto">
            <p className="text-stone-600 font-light">Este cardápio não possui itens disponíveis</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {categories.map((category, categoryIndex) => (
              <div key={category} className="space-y-4">
                {/* Category Header with decorative element */}
                <div className="flex items-center gap-3 mb-6">
                  {categoryIndex % 2 === 0 ? <DecorativeFlower /> : <Leaf className="w-6 h-6 text-amber-400 opacity-40" />}
                  <h2 className="text-lg font-serif text-stone-900 tracking-widest border-b-2 border-amber-200 pb-2 flex-1">
                    {category.toUpperCase()}
                  </h2>
                </div>

                {/* Items in this category - CARD STYLE */}
                <div className="space-y-4">
                  {groupedItems[category].map((item: MenuItem) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm border border-amber-100 p-4 hover:shadow-md hover:border-amber-300 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-3">
                        {/* Item Info */}
                        <div className="flex-1">
                          <h3 className="text-stone-900 font-medium text-base tracking-wide mb-1">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-stone-600 text-xs font-light leading-relaxed mb-2">
                              {item.description}
                            </p>
                          )}
                          {showPrice && item.price !== undefined && (
                            <p className="text-amber-700 font-semibold text-sm">
                              R$ {item.price.toFixed(2)}
                            </p>
                          )}
                          {!showPrice && item.price !== undefined && (
                            <p className="text-stone-500 text-xs italic font-light">
                              
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls - Circular buttons */}
                        <div className="flex items-center gap-2 bg-stone-100 rounded-full p-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => onQuantityChange(item.id, -1)}
                            className="w-7 h-7 bg-stone-200 hover:bg-red-300 text-stone-700 hover:text-white rounded-full flex items-center justify-center transition-all text-sm font-medium"
                            disabled={!quantities[item.id]}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-stone-900 font-semibold text-sm">
                            {quantities[item.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => onQuantityChange(item.id, 1)}
                            className="w-7 h-7 bg-amber-400 hover:bg-amber-500 text-white rounded-full flex items-center justify-center transition-all text-sm font-medium"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Form - Below the menu items */}
        <form onSubmit={onSubmitOrder} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-amber-100 space-y-6">
            {/* Decorative separator */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-amber-200" />
              <Coffee className="w-5 h-5 text-amber-400 opacity-50" />
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-amber-200" />
            </div>

            {/* Customer Name Section */}
            <div>
              <label className="block text-stone-900 font-serif text-sm mb-3 tracking-wide">
                DADOS DO CLIENTE
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 bg-stone-50 text-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-light text-sm"
                placeholder="Seu nome completo"
                required
              />
            </div>

            {/* Order Summary */}
            {menuItems.filter(item => (quantities[item.id] || 0) > 0).length > 0 && (
              <div>
                <h3 className="text-stone-900 font-serif text-sm mb-3 tracking-wide">
                  RESUMO DO PEDIDO
                </h3>
                <div className="bg-stone-50 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
                  {menuItems
                    .filter(item => (quantities[item.id] || 0) > 0)
                    .map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="text-stone-700">
                          {quantities[item.id]}x {item.name}
                        </span>
                        {showPrice && item.price !== undefined && (
                          <span className="text-amber-700 font-semibold">
                            R$ {(item.price * (quantities[item.id] || 0)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    ))}
                </div>

                {/* Total */}
                {showPrice && (
                <div className="border-t-2 border-amber-200 mt-3 pt-3 flex justify-between items-center">
                <span className="text-stone-700 font-light">Total:</span>
                <span className="text-amber-700 font-serif text-2xl">
                  R$ {total.toFixed(2)}
                </span>
              </div>
              )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!hasItems}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:from-stone-300 disabled:to-stone-300 disabled:cursor-not-allowed text-white py-4 rounded-lg transition-all duration-300 font-semibold text-base tracking-wide shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {hasItems ? 'CONFIRMAR PEDIDO' : 'Selecione Itens'}
            </button>

            {/* Decorative footer element */}
            <div className="flex justify-center pt-2">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-50" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
