import { useState, useEffect } from 'react';
import { 
  getMenuItems, 
  addMenuItem, 
  removeMenuItem, 
  getOrders, 
  getMenus,
  addMenu,
  updateMenu,
  removeMenu,
  getMenuItemsByMenuId,
  addItemToMenu,
  removeItemFromMenu,
  getSettings,
  updateSettings,
  AVAILABLE_THEMES,
  type MenuItem, 
  type Order,
  type Menu 
} from '../../services/api';
import { 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Clock, 
  User, 
  Package, 
  BookOpen,
  Image as ImageIcon,
  Palette,
  Eye,
  EyeOff,
  Edit
} from 'lucide-react';

interface AdminViewProps {
  refreshTrigger?: number;
}

export function AdminView({ refreshTrigger }: AdminViewProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'items' | 'menus' | 'settings'>('orders');
  const [settings, setSettings] = useState({ showPrices: true, theme: 'orange' });
  const [isLoading, setIsLoading] = useState(true);
  
  // New item form
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  // New menu form
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDescription, setNewMenuDescription] = useState('');
  const [newMenuLogo, setNewMenuLogo] = useState('');
  const [selectedMenuForEdit, setSelectedMenuForEdit] = useState<Menu | null>(null);

  const loadData = async () => {
    try {
      const [items, ordersList, menusList, settingsData] = await Promise.all([
        getMenuItems(),
        getOrders(),
        getMenus(),
        getSettings()
      ]);
      setMenuItems(items);
      setOrders(ordersList);
      setMenus(menusList);
      setSettings(settingsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    loadData().then(() => setIsLoading(false));
  }, [refreshTrigger]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemName.trim() || !newItemPrice) {
      alert('Por favor, preencha nome e preço');
      return;
    }

    try {
      await addMenuItem({
        name: newItemName.trim(),
        price: parseFloat(newItemPrice),
        description: newItemDescription.trim() || undefined,
      });

      setNewItemName('');
      setNewItemPrice('');
      setNewItemDescription('');
      await loadData();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item. Por favor, tente novamente.');
    }
  };

  const handleRemoveItem = async (id: number) => {
    if (confirm('Deseja remover este item? Ele será removido de todos os cardápios.')) {
      try {
        await removeMenuItem(id);
        await loadData();
      } catch (error) {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover item. Por favor, tente novamente.');
      }
    }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMenuName.trim()) {
      alert('Por favor, preencha o nome do cardápio');
      return;
    }

    try {
      await addMenu({
        name: newMenuName.trim(),
        description: newMenuDescription.trim() || undefined,
        logo: newMenuLogo.trim() || undefined,
        active: true,
      });

      setNewMenuName('');
      setNewMenuDescription('');
      setNewMenuLogo('');
      await loadData();
    } catch (error) {
      console.error('Erro ao adicionar cardápio:', error);
      alert('Erro ao adicionar cardápio. Por favor, tente novamente.');
    }
  };

  const handleRemoveMenu = async (id: number) => {
    if (confirm('Deseja remover este cardápio?')) {
      try {
        await removeMenu(id);
        await loadData();
      } catch (error) {
        console.error('Erro ao remover cardápio:', error);
        alert('Erro ao remover cardápio. Por favor, tente novamente.');
      }
    }
  };

  const handleToggleMenuActive = async (menu: Menu) => {
    try {
      await updateMenu(menu.id, { active: !menu.active });
      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar cardápio:', error);
      alert('Erro ao atualizar cardápio. Por favor, tente novamente.');
    }
  };

  const handleUpdateSettings = async (key: 'showPrices' | 'theme', value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await updateSettings({ [key]: value });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      // Reverte a mudança local em caso de erro
      setSettings(settings);
      alert('Erro ao salvar configurações. Por favor, tente novamente.');
    }
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

  const theme = AVAILABLE_THEMES.find(t => t.id === settings.theme) || AVAILABLE_THEMES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-slate-800 mb-6 flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" />
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
                <BookOpen className="w-5 h-5" />
                Cardápios ({menus.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`pb-3 px-4 transition-colors whitespace-nowrap ${
                activeTab === 'items'
                  ? 'border-b-2 border-slate-800 text-slate-800'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Itens ({menuItems.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-4 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-b-2 border-slate-800 text-slate-800'
                  : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Configurações
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
                <h3 className="text-slate-700 mb-4">Criar Novo Cardápio</h3>
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
                      placeholder="Ex: Cardápio Kids"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      URL do Logo (opcional)
                    </label>
                    <input
                      type="text"
                      value={newMenuLogo}
                      onChange={(e) => setNewMenuLogo(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="https://exemplo.com/logo.jpg"
                    />
                  </div>
                </div>
                <div className="mb-4">
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
                <button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Criar Cardápio
                </button>
              </form>

              {/* Menus List */}
              <div className="space-y-3">
                {menus.map(menu => (
                  <MenuCard 
                    key={menu.id} 
                    menu={menu}
                    allMenuItems={menuItems}
                    onToggleActive={() => handleToggleMenuActive(menu)}
                    onRemove={() => handleRemoveMenu(menu.id)}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Items Tab */}
          {activeTab === 'items' && (
            <div>
              <h2 className="text-slate-700 mb-4">Gerenciar Itens</h2>
              
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

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-slate-700 mb-4">Configurações do Sistema</h2>
              
              <div className="space-y-6">
                {/* Show Prices Setting */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-700 mb-2 flex items-center gap-2">
                        {settings.showPrices ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        Exibir Preços no Cardápio
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Controla se os preços são exibidos para os clientes ao fazer pedidos
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpdateSettings('showPrices', !settings.showPrices)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.showPrices ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.showPrices ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Theme Setting */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-slate-700 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Tema de Cores
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Escolha o esquema de cores para a interface do cliente
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {AVAILABLE_THEMES.map(themeOption => (
                      <button
                        key={themeOption.id}
                        onClick={() => handleUpdateSettings('theme', themeOption.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.theme === themeOption.id
                            ? 'border-slate-800 bg-white'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-full h-12 rounded ${themeOption.primary} mb-2`}></div>
                        <p className="text-sm text-gray-700">{themeOption.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-slate-700 mb-4">Pré-visualização</h3>
                  <div className={`bg-gradient-to-br ${theme.gradient} p-6 rounded-lg`}>
                    <div className="bg-white rounded-lg p-4 max-w-md">
                      <h4 className={`${theme.textPrimary} mb-3`}>Exemplo de Item</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-900">Pizza Margherita</p>
                        <p className="text-gray-600 text-sm">Molho, mussarela e manjericão</p>
                        {settings.showPrices && (
                          <p className={`${theme.textPrimary} mt-1`}>R$ 35,90</p>
                        )}
                      </div>
                      <button className={`w-full ${theme.primary} ${theme.primaryHover} text-white py-2 rounded-lg mt-3 transition-colors`}>
                        Botão de Exemplo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Menu Card Component
interface MenuCardProps {
  menu: Menu;
  allMenuItems: MenuItem[];
  onToggleActive: () => void;
  onRemove: () => void;
  onUpdate: () => void;
}

function MenuCard({ menu, allMenuItems, onToggleActive, onRemove, onUpdate }: MenuCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function loadMenuItems() {
      if (isExpanded) {
        try {
          const items = await getMenuItemsByMenuId(menu.id);
          setMenuItems(items);
          
          const itemIds = new Set(items.map(i => i.id));
          const available = allMenuItems.filter(i => !itemIds.has(i.id));
          setAvailableItems(available);
        } catch (error) {
          console.error('Erro ao carregar itens do cardápio:', error);
        }
      }
    }
    loadMenuItems();
  }, [isExpanded, menu.id, allMenuItems]);

  const handleAddItem = async (itemId: number) => {
    try {
      await addItemToMenu(menu.id, itemId);
      await onUpdate();
      
      // Atualiza as listas localmente
      const items = await getMenuItemsByMenuId(menu.id);
      setMenuItems(items);
      const itemIds = new Set(items.map(i => i.id));
      const available = allMenuItems.filter(i => !itemIds.has(i.id));
      setAvailableItems(available);
    } catch (error) {
      console.error('Erro ao adicionar item ao cardápio:', error);
      alert('Erro ao adicionar item. Por favor, tente novamente.');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (confirm('Remover este item do cardápio?')) {
      try {
        await removeItemFromMenu(menu.id, itemId);
        await onUpdate();
        
        // Atualiza as listas localmente
        const items = await getMenuItemsByMenuId(menu.id);
        setMenuItems(items);
        const itemIds = new Set(items.map(i => i.id));
        const available = allMenuItems.filter(i => !itemIds.has(i.id));
        setAvailableItems(available);
      } catch (error) {
        console.error('Erro ao remover item do cardápio:', error);
        alert('Erro ao remover item. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {menu.logo && (
              <img 
                src={menu.logo} 
                alt={menu.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-gray-900 mb-1">{menu.name}</h3>
            {menu.description && (
              <p className="text-gray-600 text-sm mb-2">{menu.description}</p>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-2 py-1 rounded ${menu.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {menu.active ? 'Ativo' : 'Inativo'}
              </span>
              <span className="text-gray-600">
                {menuItems.length} {menuItems.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onToggleActive}
              className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title={menu.active ? 'Desativar' : 'Ativar'}
            >
              {menu.active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-50 rounded-lg transition-colors"
              title="Gerenciar itens"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Remover cardápio"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <h4 className="text-slate-700 mb-3">Itens do Cardápio</h4>
          
          {menuItems.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">Nenhum item adicionado ainda</p>
          ) : (
            <div className="space-y-2 mb-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded p-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <h4 className="text-slate-700 mb-3">Adicionar Itens</h4>
          {availableItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Todos os itens já foram adicionados</p>
          ) : (
            <div className="space-y-2">
              {availableItems.map(item => (
                <div key={item.id} className="bg-white rounded p-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleAddItem(item.id)}
                    className="text-green-500 hover:text-green-700 p-1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}