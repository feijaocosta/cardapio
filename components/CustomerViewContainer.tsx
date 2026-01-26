import { useState, useEffect } from 'react';
import { getMenuItems, addOrder, getMenus, getShowPrice, getTheme, type MenuItem, type Menu } from '../services/api';
import { getLayout, type LayoutKey } from './customer-views';
import { type CustomerViewLayoutProps } from './customer-views/types';

interface CustomerViewContainerProps {
  onOrderPlaced?: () => void;
}

export function CustomerViewContainer({ onOrderPlaced }: CustomerViewContainerProps) {
  // Estado de dados
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

  // Carregar dados na montagem do componente
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
        setLayoutKey(theme); // ✅ Usa o tema/layout do banco
        console.log('🎨 Layout carregado do banco:', theme);
        
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

  // Obter o componente de layout selecionado (default ou modern)
  const LayoutComponent = getLayout(layoutKey);

  // Props para passar ao layout
  const layoutProps: CustomerViewLayoutProps = {
    menuItems,
    menus,
    customerName,
    quantities,
    showSuccess,
    isLoading,
    error,
    showPrice,
    onCustomerNameChange: handleCustomerNameChange,
    onQuantityChange: handleQuantityChange,
    onSubmitOrder: handleSubmitOrder,
    calculateTotal,
    getMenuLogoUrl,
  };

  return <LayoutComponent {...layoutProps} />;
}
