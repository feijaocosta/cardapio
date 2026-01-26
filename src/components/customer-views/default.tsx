import { ShoppingCart, Plus, Minus, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { type LayoutProps } from './types';

export function DefaultLayout({
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

  // Menu Selection Screen
  if (!selectedMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-orange-600 mb-2 flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              Selecione um Cardápio
            </h1>
            <p className="text-gray-600 mb-6">Escolha o cardápio desejado para fazer seu pedido</p>

            {menus.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Nenhum cardápio disponível no momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menus.map(menu => (
                  <button
                    key={menu.id}
                    onClick={() => onSelectMenu(menu)}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 text-left transition-all border-2 border-transparent hover:border-gray-300"
                  >
                    {menu.logo ? (
                      <div className="mb-4">
                        <img 
                          src={menu.logo} 
                          alt={menu.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex items-center justify-center h-32 bg-gray-200 rounded-lg">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <h3 className="text-gray-900 mb-2">{menu.name}</h3>
                    {menu.description && (
                      <p className="text-gray-600 text-sm">{menu.description}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Order Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <button
            onClick={onBackToMenus}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar aos cardápios
          </button>

          <div className="mb-6">
            {selectedMenu.logo ? (
              <img 
                src={selectedMenu.logo} 
                alt={selectedMenu.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : null}
            <h1 className="text-orange-600 mb-2 flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              {selectedMenu.name}
            </h1>
            {selectedMenu.description && (
              <p className="text-gray-600">{selectedMenu.description}</p>
            )}
          </div>

          {showSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Pedido realizado com sucesso!
            </div>
          )}

          <form onSubmit={onSubmitOrder}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Digite seu nome"
                required
              />
            </div>

            {menuItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Este cardápio não possui itens disponíveis</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {menuItems.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-gray-900">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                        {showPrice && item.price !== undefined && (
                          <p className="text-orange-600 mt-1">
                            R$ {item.price.toFixed(2)}
                          </p>
                        )}
                        {!showPrice && item.price !== undefined && (
                          <p className="text-gray-500 text-xs mt-1 italic">
                            (Consulte pelo telefone)
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.id, -1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          disabled={!quantities[item.id]}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantities[item.id] || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.id, 1)}
                          className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {hasItems && (
                  <div className="bg-orange-100 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Total:</span>
                      <span className="text-orange-600 font-bold">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!hasItems}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Fazer Pedido
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
