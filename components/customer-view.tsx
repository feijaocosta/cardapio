import { useState, useEffect } from 'react';
import { getMenuItems, addOrder, type MenuItem } from '../lib/storage';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface CustomerViewProps {
  onOrderPlaced?: () => void;
}

export function CustomerView({ onOrderPlaced }: CustomerViewProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setMenuItems(getMenuItems());
  }, []);

  const updateQuantity = (itemId: string, change: number) => {
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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome');
      return;
    }

    const orderItems = menuItems
      .filter(item => (quantities[item.id] || 0) > 0)
      .map(item => ({
        menuItemId: item.id,
        name: item.name,
        quantity: quantities[item.id],
        price: item.price,
      }));

    if (orderItems.length === 0) {
      alert('Por favor, selecione pelo menos um item');
      return;
    }

    addOrder({
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
  };

  const total = calculateTotal();
  const hasItems = Object.values(quantities).some(q => q > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
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
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                      disabled={!quantities[item.id]}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">
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
                  <span className="text-gray-700">Total:</span>
                  <span className="text-orange-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors"
            >
              Fazer Pedido
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
