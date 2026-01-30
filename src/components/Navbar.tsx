import { useLocation, useNavigate } from 'react-router-dom';
import { Store, Settings } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // ❌ Navbar NÃO aparece em rotas do cliente
  if (location.pathname === '/' || location.pathname.startsWith('/menu/')) {
    return null;
  }

  // ✅ Navbar só aparece em /admin
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-800 flex items-center gap-2">
            🍽️ Sistema de Cardápio
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate('/admin')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-slate-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Store className="w-4 h-4" />
              Admin
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                location.pathname === '/admin/settings'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              ⚙️ Configurações
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-orange-500 text-white hover:bg-orange-600"
            >
              <Store className="w-4 h-4" />
              Cliente
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
