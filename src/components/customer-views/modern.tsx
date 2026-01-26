import { ShoppingCart, Plus, Minus, ChevronLeft, Image as ImageIcon, X } from 'lucide-react';
import { type LayoutProps } from './types';

export function ModernLayout({
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
  const cartItems = menuItems.filter(item => (quantities[item.id] || 0) > 0);

  // Menu Selection Screen
  if (!selectedMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-400" />
              Cardápio Digital
            </h1>
            <p className="text-slate-400">Escolha um cardápio para fazer seu pedido</p>
          </div>

          {menus.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Nenhum cardápio disponível no momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {menus.map(menu => (
                <button
                  key={menu.id}
                  onClick={() => onSelectMenu(menu)}
                  className="bg-slate-700 hover:bg-slate-600 rounded-xl overflow-hidden transition-all transform hover:scale-105 border border-slate-600 hover:shadow-lg"
                >
                  {menu.logo ? (
                    <img 
                      src={menu.logo} 
                      alt={menu.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-slate-600">
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1">{menu.name}</h3>
                    {menu.description && (
                      <p className="text-slate-400 text-xs line-clamp-2">{menu.description}</p>
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

  // Order Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBackToMenus}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar aos cardápios
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-700 mb-6">
              {selectedMenu.logo ? (
                <img 
                  src={selectedMenu.logo} 
                  alt={selectedMenu.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : null}
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
                {selectedMenu.name}
              </h1>
              {selectedMenu.description && (
                <p className="text-slate-400">{selectedMenu.description}</p>
              )}
            </div>

            <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-700">
              {showSuccess && (
                <div className="bg-green-900 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
                  ✓ Pedido realizado com sucesso!
                </div>
              )}

              {menuItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>Este cardápio não possui itens disponíveis</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {menuItems.map(item => (
                    <div
                      key={item.id}
                      className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors border border-slate-600"
                    >
                      <h3 className="text-white font-semibold text-sm mb-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-slate-400 text-xs mb-2 line-clamp-2">{item.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {showPrice && item.price !== undefined && (
                            <p className="text-blue-400 font-bold text-sm">
                              R$ {item.price.toFixed(2)}
                            </p>
                          )}
                          {!showPrice && item.price !== undefined && (
                            <p className="text-slate-500 text-xs italic">Consulte preço</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onQuantityChange(item.id, -1)}
                            className="w-6 h-6 bg-slate-600 hover:bg-red-600 rounded flex items-center justify-center transition-colors text-white"
                            disabled={!quantities[item.id]}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-white text-sm font-medium">
                            {quantities[item.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => onQuantityChange(item.id, 1)}
                            className="w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center transition-colors text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Cart */}
          <div className="lg:col-span-1">
            <form onSubmit={onSubmitOrder} className="space-y-4">
              {/* Customer Name */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => onCustomerNameChange(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Digite seu nome"
                  required
                />
              </div>

              {/* Cart Summary */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-white font-semibold mb-4 text-sm">Seu Pedido</h3>
                
                {cartItems.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">
                    Carrinho vazio
                  </p>
                ) : (
                  <>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm bg-slate-700 p-2 rounded">
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-slate-400 text-xs">
                              {quantities[item.id]}x {showPrice ? `R$ ${item.price?.toFixed(2)}` : 'Consulte'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const current = quantities[item.id] || 0;
                              if (current > 0) {
                                onQuantityChange(item.id, -current);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-600 pt-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Total:</span>
                        <span className="text-blue-400 font-bold text-lg">
                          R$ {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!hasItems}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-semibold text-sm"
              >
                {hasItems ? 'Confirmar Pedido' : 'Selecione itens'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
