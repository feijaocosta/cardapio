import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initDatabase } from '../services/api';
import Navbar from './components/Navbar';
import CustomerView from './views/CustomerView';
import AdminView from './views/AdminView';

export default function App() {
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
      {/* Navbar aparece em /admin */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<CustomerView />} />
        <Route path="/menu/:menuId" element={<CustomerView />} />
        <Route path="/admin/*" element={<AdminView />} />
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl">Página não encontrada - 404</h1>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}