import { useState, useEffect } from 'react';
import { CustomerView } from './components/customer-view';
import { AdminView } from './components/admin-view';
import { SettingsView } from '../components/settings-view';
import { Store, Settings } from 'lucide-react';
import { initDatabase } from '../services/api';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin' | 'settings'>('customer');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleOrderPlaced = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSettingsChange = () => {
    setView('customer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando ao servidor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-gray-900 mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Certifique-se de que o servidor backend está rodando e a variável VITE_API_URL está configurada corretamente.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-800 flex items-center gap-2">
              Sistema de Pedidos
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