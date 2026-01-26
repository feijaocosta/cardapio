import { useState } from 'react';
import { CustomerView } from './components/customer-view';
import { AdminView } from './components/admin-view';
import { SettingsView } from './components/settings-view';
import { Store, Settings } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin' | 'settings'>('customer');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderPlaced = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSettingsChange = () => {
    // Recarregar customer view para respeitar novas configurações
    setView('customer');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-800 flex items-center gap-2">
              🍽️ Sistema de Cardápio
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setView('customer')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'customer'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Store className="w-4 h-4" />
                Cliente
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'admin'
                    ? 'bg-slate-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
              <button
                onClick={() => setView('settings')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'settings'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                ⚙️ Configurações
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {view === 'customer' ? (
        <CustomerView onOrderPlaced={handleOrderPlaced} />
      ) : view === 'admin' ? (
        <AdminView refreshTrigger={refreshTrigger} />
      ) : (
        <SettingsView onSettingsChange={handleSettingsChange} />
      )}
    </div>
  );
}
