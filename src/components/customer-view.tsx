import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuItems, addOrder, getMenus, getShowPrice, getTheme, type MenuItem, type Menu } from '../services/api';
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
  const [showPrice, setShowPrice] = useState(true);
  const [layoutKey, setLayoutKey] = useState<LayoutKey>('default');

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
        setMenuItems(items);
        setMenus(menusList);
        setShowPrice(showPriceConfig);
        setLayoutKey(theme || 'default');
        console.log('🎨 Layout de listagem carregado:', theme);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSelectMenu = (menuId: number) => {
    navigate(`/menu/${menuId}`);
  };

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

  // Obter o componente de layout selecionado
  const LayoutComponent = getLayout(layoutKey);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <LayoutComponent {...layoutProps} />
      </div>
    </div>
  );
}