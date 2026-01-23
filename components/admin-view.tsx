import { useState, useEffect } from 'react';
import { getMenuItems, addMenuItem, removeMenuItem, getOrders, getMenus, addMenuWithLogo, removeMenu, type MenuItem, type Order, type Menu } from '../services/api';
import { Settings, Plus, Trash2, ShoppingBag, Clock, User, Package, X } from 'lucide-react';

interface AdminViewProps {
  refreshTrigger?: number;
}

export function AdminView({ refreshTrigger }: AdminViewProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeTab, setActiveTab] = useState<'menus' | 'menu' | 'orders'>('orders');
  
  // New item form
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  // New menu form
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDescription, setNewMenuDescription] = useState('');
  const [newMenuActive, setNewMenuActive] = useState(true);
  const [newMenuLogo, setNewMenuLogo] = useState<File | null>(null);
  const [menuLogoPreview, setMenuLogoPreview] = useState<string | null>(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

  const loadData = async () => {
    try {
      setMenuItems(await getMenuItems());
      setOrders(await getOrders());
      setMenus(await getMenus());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemName.trim() || !newItemPrice) {
      alert('Por favor, preencha nome e preço');
      return;
    }

    addMenuItem({
      name: newItemName.trim(),
      price: parseFloat(newItemPrice),
      description: newItemDescription.trim() || undefined,
    });

    setNewItemName('');
    setNewItemPrice('');
    setNewItemDescription('');
    loadData();
  };

  const handleRemoveItem = (id: number) => {
    if (confirm('Deseja remover este item do cardápio?')) {
      removeMenuItem(id);
      loadData();
    }
  };

  const handleMenuLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      // Validar tipo
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Formato inválido. Use JPEG, PNG ou WebP.');
        return;
      }

      setNewMenuLogo(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMenuLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMenuName.trim()) {
      alert('Por favor, preencha o nome do cardápio');
      return;
    }

    setIsLoadingMenu(true);
    try {
      await addMenuWithLogo(
        newMenuName.trim(),
        newMenuDescription.trim() || undefined,
        newMenuActive,
        newMenuLogo
      );

      setNewMenuName('');
      setNewMenuDescription('');
      setNewMenuActive(true);
      setNewMenuLogo(null);
      setMenuLogoPreview(null);
      loadData();
    } catch (error) {
      console.error('Erro ao criar cardápio:', error);
      alert('Erro ao criar cardápio. Tente novamente.');
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const handleRemoveMenu = (id: number) => {
    if (confirm('Deseja remover este cardápio?')) {
      removeMenu(id);
      loadData();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-slate-800 mb-6 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Painel Administrativo
          </h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-4 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-b-2 border-slate-800 text-slate-800'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Pedidos ({orders.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('menus')}
              className={`pb-3 px-4 transition-colors whitespace-nowrap ${
                activeTab === 'menus'
                  ? 'border-b-2 border-slate-800 text-slate-800'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Cardápios ({menus.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`pb-3 px-4 transition-colors whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'border-b-2 border-slate-800 text-slate-800'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Itens ({menuItems.length})
              </div>
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-slate-700 mb-4">Pedidos Realizados</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Nenhum pedido realizado ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 text-slate-800 mb-1">
                            <User className="w-4 h-4" />
                            {order.customerName}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Clock className="w-4 h-4" />
                            {formatDate(order.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Total</div>
                          <div className="text-green-600">
                            R$ {order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-200 pt-3">
                        <div className="text-sm text-gray-600 mb-2">Itens:</div>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-gray-600">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Menus Tab */}
          {activeTab === 'menus' && (
            <div>
              <h2 className="text-slate-700 mb-4">Gerenciar Cardápios</h2>

              {/* Add Menu Form */}
              <form onSubmit={handleAddMenu} className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-slate-700 mb-4">Adicionar Novo Cardápio</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Nome do Cardápio *
                    </label>
                    <input
                      type="text"
                      value={newMenuName}
                      onChange={(e) => setNewMenuName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Ex: Cardápio Principal"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={newMenuDescription}
                      onChange={(e) => setNewMenuDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Descrição do cardápio"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 text-sm">
                    Logo/Imagem do Cardápio
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleMenuLogoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        JPEG, PNG ou WebP. Máximo 5MB.
                      </p>
                    </div>
                    {menuLogoPreview && (
                      <div className="relative">
                        <img
                          src={menuLogoPreview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewMenuLogo(null);
                            setMenuLogoPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="menuActive"
                    checked={newMenuActive}
                    onChange={(e) => setNewMenuActive(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="menuActive" className="text-gray-700 text-sm">
                    Cardápio ativo
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingMenu}
                  className="bg-slate-700 hover:bg-slate-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {isLoadingMenu ? 'Criando...' : 'Adicionar Cardápio'}
                </button>
              </form>

              {/* Menus List */}
              <div className="space-y-3">
                {menus.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>Nenhum cardápio criado ainda</p>
                  </div>
                ) : (
                  menus.map(menu => (
                    <div
                      key={menu.id}
                      className="bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow gap-4"
                    >
                      <div className="flex gap-4 flex-1 min-w-0">
                        {getMenuLogoUrl(menu) && (
                          <img
                            src={getMenuLogoUrl(menu)!}
                            alt={menu.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 font-medium">{menu.name}</h3>
                          {menu.description && (
                            <p className="text-gray-600 text-sm">{menu.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                menu.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {menu.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMenu(menu.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Remover cardápio"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Menu Items Tab */}
          {activeTab === 'menu' && (
            <div>
              <h2 className="text-slate-700 mb-4">Gerenciar Itens do Cardápio</h2>
              
              {/* Add Item Form */}
              <form onSubmit={handleAddItem} className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-slate-700 mb-4">Adicionar Novo Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Nome do Item *
                    </label>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Ex: Pizza Calabresa"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 text-sm">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Descrição do item"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Item
                </button>
              </form>

              {/* Menu Items List */}
              <div className="space-y-3">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h3 className="text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      )}
                      <p className="text-green-600 mt-1">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
