import { useState, useEffect } from 'react';
import { getMenuItems, addOrder, getMenus, type MenuItem, type Menu } from '../services/api';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface CustomerViewProps {
  onOrderPlaced?: () => void;
}

export function CustomerView({ onOrderPlaced }: CustomerViewProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [items, menusList] = await Promise.all([
          getMenuItems(),
          getMenus()
        ]);
        setMenuItems(items);
        setMenus(menusList);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar cardápio. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const updateQuantity = (itemId: number, change: number) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0;
      const newValue = Math.max(0, current + change);
      return { ...prev, [itemId]: newValue };
    });
  };

  const calculateTotal = () => {
    return menuItems.reduce((total, item) => {
      const quantity = quantities[item.id] || 0;
      return total + (item.price * quantity);
    }, 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome');
      return;
    }

    const orderItems = menuItems
      .filter(item => (quantities[item.id] || 0) > 0)
      .map(item => ({
        itemId: item.id,
        quantity: quantities[item.id],
        unitPrice: item.price,
      }));

    if (orderItems.length === 0) {
      alert('Por favor, selecione pelo menos um item');
      return;
    }

    try {
      await addOrder({
        customerName: customerName.trim(),
        items: orderItems,
        total: calculateTotal(),
      });

      // Reset form
      setCustomerName('');
      setQuantities({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      if (onOrderPlaced) {
        onOrderPlaced();
      }
    } catch (err) {
      console.error('Erro ao fazer pedido:', err);
      alert('Erro ao fazer pedido. Tente novamente.');
    }
  };

  const getMenuLogoUrl = (menu: Menu) => {
    if (menu.logo_filename) {
      return `${API_BASE_URL}/uploads/${menu.logo_filename}`;
    }
    if (menu.logo) {
      return menu.logo;
    }
    return null;
  };

  const total = calculateTotal();
  const hasItems = Object.values(quantities).some(q => q > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Cardápios */}
        {menus.length > 0 && (
          <div className="mb-6">
            <h2 className="text-gray-700 font-medium mb-3">Cardápios Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {menus.map(menu => (
                <div
                  key={menu.id}
                  className="bg-white rounded-lg shadow p-3 text-center hover:shadow-md transition-shadow"
                >
                  {getMenuLogoUrl(menu) && (
                    <img
                      src={getMenuLogoUrl(menu)!}
                      alt={menu.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <h3 className="text-gray-900 font-medium text-sm">{menu.name}</h3>
                  {menu.description && (
                    <p className="text-gray-600 text-xs mt-1">{menu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-orange-600 mb-2 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            Cardápio
          </h1>
          <p className="text-gray-600 mb-6">Selecione os itens e faça seu pedido</p>

          {showSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Pedido realizado com sucesso!
            </div>
          )}

          <form onSubmit={handleSubmitOrder}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Digite seu nome"
                required
              />
            </div>

            {menuItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Nenhum item disponível no cardápio</p>
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
                        <p className="text-orange-600 mt-1">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
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
                          onClick={() => updateQuantity(item.id, 1)}
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
                      <span className="text-orange-600 font-bold text-lg">
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
