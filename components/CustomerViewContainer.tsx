import { useState, useEffect } from 'react';
import { getMenuItemsByMenuId, addOrder, getMenus, getShowPrice, getTheme, type MenuItem, type Menu } from '../services/api';
import { getLayout, type LayoutKey } from '../src/components/customer-views';
import { type LayoutProps } from '../src/components/customer-views/types';

interface CustomerViewContainerProps {
  onOrderPlaced?: () => void;
  menuId: number;
  onBackToMenus: () => void;
}

export function CustomerViewContainer({ onOrderPlaced, menuId, onBackToMenus }: CustomerViewContainerProps) {
  // Estado de dados
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [layoutKey, setLayoutKey] = useState<LayoutKey>('default');

  // Carregar dados na montagem do componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [menusList, showPriceConfig, theme] = await Promise.all([
          getMenus(),
          getShowPrice(),
          getTheme(),
        ]);
        
        setShowPrice(showPriceConfig);
        setLayoutKey(theme || 'default');
        
        // Carregar cardápio específico
        const menu = menusList.find(m => m.id === menuId);
        setCurrentMenu(menu || null);
        
        if (menu) {
          const items = await getMenuItemsByMenuId(menuId);
          setMenuItems(items);
          console.log('📋 Cardápio selecionado:', menu.name, 'com', items.length, 'itens');
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [menuId]);

  // Handlers de negócio
  const handleCustomerNameChange = (name: string) => {
    setCustomerName(name);
  };

  const handleQuantityChange = (itemId: number, change: number) => {
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
        menuId: menuId,
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
    menus: currentMenu ? [currentMenu] : [],
    selectedMenu: currentMenu,
    menuItems,
    customerName,
    quantities,
    showSuccess,
    showPrice,
    onSelectMenu: () => {},
    onBackToMenus: onBackToMenus, // ✅ Passa a função de volta corretamente
    onCustomerNameChange: (name: string) => setCustomerName(name),
    onQuantityChange: handleQuantityChange,
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
