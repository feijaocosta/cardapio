import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuItems, addOrder, getMenus, getShowPrice, getTheme, type MenuItem, type Menu } from '../services/api';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { getLayout, type LayoutKey } from '../src/components/customer-views';
import { type LayoutProps } from '../src/components/customer-views/types';

interface CustomerViewProps {
  onOrderPlaced?: () => void;
}

export function CustomerView({ onOrderPlaced }: CustomerViewProps) {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrice, setShowPrice] = useState(true);
  const [layoutKey, setLayoutKey] = useState<LayoutKey>('default');

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [items, menusList, showPriceConfig, theme] = await Promise.all([
          getMenuItems(),
          getMenus(),
          getShowPrice(),
          getTheme(),
        ]);

        console.log('📊 DEBUG customer-view.tsx - Theme carregado:', theme);
        console.log('📊 DEBUG customer-view.tsx - Type de theme:', typeof theme);

        setMenuItems(items);
        setMenus(menusList);
        setShowPrice(showPriceConfig);
        setLayoutKey(theme || 'default');

        console.log('📊 DEBUG customer-view.tsx - layoutKey definido como:', theme || 'default');
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
      const price = item.price || 0;
      return total + (price * quantity);
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
        unitPrice: item.price || 0,
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

  const handleSelectMenu = (menu: Menu) => {
    navigate(`/menu/${menu.id}`);
  };

  const total = calculateTotal();
  const hasItems = Object.values(quantities).some(q => q > 0);

  // Obter o componente de layout selecionado
  const LayoutComponent = getLayout(layoutKey);
  console.log('📊 DEBUG customer-view.tsx - LayoutComponent:', LayoutComponent?.name);

  // Props para passar ao layout
  const layoutProps: LayoutProps = {
    menus,
    selectedMenu: null,
    menuItems,
    customerName,
    quantities,
    showSuccess,
    showPrice,
    onSelectMenu: handleSelectMenu,
    onBackToMenus: () => {},
    onCustomerNameChange: (name: string) => setCustomerName(name),
    onQuantityChange: updateQuantity,
    onSubmitOrder: handleSubmitOrder,
    calculateTotal,
  };

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
      <div className="max-w-6xl mx-auto">
        <LayoutComponent {...layoutProps} />
      </div>
    </div>
  );
}
