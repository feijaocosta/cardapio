import { useState, useEffect } from 'react';
import { 
  getActiveMenus, 
  getMenuItemsByMenuId, 
  addOrder, 
  getSettings, 
  AVAILABLE_THEMES,
  type MenuItem, 
  type Menu 
} from '../lib/api';
import { ShoppingCart, Plus, Minus, ChevronLeft, Image as ImageIcon } from 'lucide-react';

interface CustomerViewProps {
  onOrderPlaced?: () => void;
}

export function CustomerView({ onOrderPlaced }: CustomerViewProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({ showPrices: true, theme: 'orange' });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const loadedSettings = await getSettings();
        const loadedMenus = await getActiveMenus();
  
        setSettings(loadedSettings);
        setMenus(Array.isArray(loadedMenus) ? loadedMenus : []);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setMenus([]);
      }
    }
  
    loadInitialData();
  }, []);  

  useEffect(() => {
    if (!selectedMenu) return;
  
    async function loadMenuItems() {
      try {
        const items = await getMenuItemsByMenuId(selectedMenu.id);
        setMenuItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Erro ao carregar itens do cardápio:', error);
        setMenuItems([]);
      }
    }
  
    loadMenuItems();
  }, [selectedMenu]);  

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

  const handleBackToMenus = () => {
    setSelectedMenu(null);
    setQuantities({});
    setCustomerName('');
  };

  const total = calculateTotal();
  const hasItems = Object.values(quantities).some(q => q > 0);

  const theme = AVAILABLE_THEMES.find(t => t.id === settings.theme) || AVAILABLE_THEMES[0];

  // Menu Selection Screen
  if (!selectedMenu) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className={`${theme.textPrimary} mb-2 flex items-center gap-2`}>
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
                    onClick={() => setSelectedMenu(menu)}
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
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <button
            onClick={handleBackToMenus}
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
            <h1 className={`${theme.textPrimary} mb-2 flex items-center gap-2`}>
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

          <form onSubmit={handleSubmitOrder}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${settings.theme}-500`}
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
                        {settings.showPrices && (
                          <p className={`${theme.textPrimary} mt-1`}>
                            R$ {item.price.toFixed(2)}
                          </p>
                        )}
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
                          className={`w-8 h-8 ${theme.primary} ${theme.primaryHover} text-white rounded-full flex items-center justify-center transition-colors`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {hasItems && settings.showPrices && (
                  <div className={`bg-${settings.theme}-100 rounded-lg p-4 mb-6`}>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total:</span>
                      <span className={theme.textPrimary}>
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full ${theme.primary} ${theme.primaryHover} text-white py-3 rounded-lg transition-colors`}
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
