import { useState, useEffect } from 'react';
import { getShowPrice, setShowPrice, getLayoutModel, setLayoutModel, getTheme, setTheme, AVAILABLE_LAYOUTS } from '../../services/api';
import { Settings, Eye, EyeOff, LayoutGrid, List, Zap, Palette } from 'lucide-react';

interface SettingsViewProps {
  onSettingsChange?: () => void;
}

type OrderStatusType = 'Pendente' | 'Em preparação' | 'Pronto' | 'Entregue' | 'Cancelado';

export function SettingsView({ onSettingsChange }: SettingsViewProps) {
  const [showPrice, setShowPriceState] = useState(true);
  const [layoutModel, setLayoutModelState] = useState<'grid' | 'list' | 'carousel'>('grid');
  const [selectedTheme, setSelectedThemeState] = useState<'default' | 'modern'>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const [price, layout, theme] = await Promise.all([
        getShowPrice(),
        getLayoutModel(),
        getTheme()
      ]);
      setShowPriceState(price);
      setLayoutModelState(layout);
      setSelectedThemeState(theme);
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPriceToggle = async () => {
    try {
      setIsSaving(true);
      await setShowPrice(!showPrice);
      setShowPriceState(!showPrice);
      setSuccessMessage('Configuração de preço atualizada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
      onSettingsChange?.();
    } catch (err) {
      console.error('Erro ao salvar configuração:', err);
      setError('Erro ao salvar configuração. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLayoutChange = async (newLayout: 'grid' | 'list' | 'carousel') => {
    try {
      setIsSaving(true);
      await setLayoutModel(newLayout);
      setLayoutModelState(newLayout);
      setSuccessMessage('Modelo de layout atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
      onSettingsChange?.();
    } catch (err) {
      console.error('Erro ao salvar layout:', err);
      setError('Erro ao salvar layout. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = async (themeId: 'default' | 'modern') => {
    try {
      console.log('🎨 Mudando tema/layout para:', themeId);
      setIsSaving(true);
      
      // Salvar no banco de dados
      await setTheme(themeId);
      console.log('✅ Tema salvo no banco:', themeId);
      
      setSelectedThemeState(themeId);
      setSuccessMessage('Tema atualizado com sucesso! A página será recarregada.');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      // Notificar App sobre mudança
      onSettingsChange?.();
    } catch (err) {
      console.error('❌ Erro ao salvar tema:', err);
      setError('Erro ao salvar tema. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-slate-800 mb-6 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Configurações da Loja
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
              ✅ {successMessage}
            </div>
          )}

          {/* ✅ Seleção de Tema/Layout */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Tema da Loja
            </h2>
            <p className="text-gray-600 mb-4">
              Escolha o tema/layout que será exibido no cardápio do cliente. Cada tema tem seu próprio design e cores.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_LAYOUTS.map(layout => (
                <button
                  key={layout.id}
                  onClick={() => handleThemeChange(layout.id)}
                  disabled={isSaving}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    selectedTheme === layout.id
                      ? 'border-slate-800 bg-slate-50 ring-2 ring-offset-2 ring-slate-400'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } disabled:opacity-50`}
                  type="button"
                  aria-label={`Selecionar tema ${layout.name}`}
                >
                  <h3 className="font-semibold text-slate-800 mb-1">{layout.name}</h3>
                  <p className="text-sm text-gray-600">{layout.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> Ao mudar o tema, a página será recarregada automaticamente para aplicar o novo layout.
              </p>
              <p className="text-xs text-blue-700 mt-2">
                <strong>Tema ativo:</strong> <code className="bg-white px-2 py-1 rounded">{selectedTheme}</code>
              </p>
            </div>
          </div>

          {/* Exibir Preço no Cardápio */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-medium text-slate-700 mb-4">
              Exibição de Preços
            </h2>
            <p className="text-gray-600 mb-4">
              Controle se os preços dos itens são exibidos no cardápio do cliente.
            </p>

            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showPrice ? (
                    <Eye className="w-6 h-6 text-green-600" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-orange-600" />
                  )}
                  <div>
                    <p className="font-medium text-slate-800">
                      {showPrice ? 'Preços Visíveis' : 'Preços Ocultos'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {showPrice
                        ? 'Os clientes podem ver o preço dos itens'
                        : 'Os preços não são exibidos para os clientes'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleShowPriceToggle}
                  disabled={isSaving}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    showPrice
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  } disabled:opacity-50`}
                >
                  {isSaving ? 'Salvando...' : showPrice ? 'Ocultar' : 'Exibir'}
                </button>
              </div>

              <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Dica:</strong> Use "Preços Ocultos" para cardápios onde você quer chamar
                  pelo telefone para consultar valores, ou "Preços Visíveis" para cardápios online
                  tradicionais.
                </p>
              </div>
            </div>
          </div>

          {/* Modelo de Layout */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-medium text-slate-700 mb-4">
              Modelo de Layout (Grid/Lista/Carrossel)
            </h2>
            <p className="text-gray-600 mb-4">
              Escolha como os itens serão exibidos dentro do cardápio do cliente.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {/* Grid Layout */}
              <button
                onClick={() => handleLayoutChange('grid')}
                disabled={isSaving}
                className={`p-4 rounded-lg border-2 transition-all ${
                  layoutModel === 'grid'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } disabled:opacity-50`}
              >
                <LayoutGrid className={`w-6 h-6 mb-2 ${
                  layoutModel === 'grid' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className="font-medium text-slate-800">Grid</p>
                <p className="text-xs text-gray-600 mt-1">Itens em colunas</p>
              </button>

              {/* List Layout */}
              <button
                onClick={() => handleLayoutChange('list')}
                disabled={isSaving}
                className={`p-4 rounded-lg border-2 transition-all ${
                  layoutModel === 'list'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } disabled:opacity-50`}
              >
                <List className={`w-6 h-6 mb-2 ${
                  layoutModel === 'list' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className="font-medium text-slate-800">Lista</p>
                <p className="text-xs text-gray-600 mt-1">Itens em linha</p>
              </button>

              {/* Carousel Layout */}
              <button
                onClick={() => handleLayoutChange('carousel')}
                disabled={isSaving}
                className={`p-4 rounded-lg border-2 transition-all ${
                  layoutModel === 'carousel'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } disabled:opacity-50`}
              >
                <Zap className={`w-6 h-6 mb-2 ${
                  layoutModel === 'carousel' ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className="font-medium text-slate-800">Carrossel</p>
                <p className="text-xs text-gray-600 mt-1">Rolagem horizontal</p>
              </button>
            </div>

            <div className="mt-4 p-4 bg-white rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>💡 Layout Selecionado:</strong> {layoutModel === 'grid' ? 'Grid - Melhor para visualizar vários itens' : layoutModel === 'list' ? 'Lista - Melhor para detalhes' : 'Carrossel - Melhor para mobile'}
              </p>
            </div>
          </div>

          {/* Status de Pedidos */}
          <div>
            <h2 className="text-lg font-medium text-slate-700 mb-4">
              Status de Pedidos
            </h2>
            <p className="text-gray-600 mb-4">
              Informações sobre os status disponíveis para pedidos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { status: 'Pendente' as OrderStatusType, color: 'bg-yellow-100', textColor: 'text-yellow-800', icon: '⏳', desc: 'Pedido criado, aguardando preparo' },
                { status: 'Em preparação' as OrderStatusType, color: 'bg-blue-100', textColor: 'text-blue-800', icon: '👨‍🍳', desc: 'Cozinha está preparando' },
                { status: 'Pronto' as OrderStatusType, color: 'bg-green-100', textColor: 'text-green-800', icon: '✅', desc: 'Pedido pronto para entrega' },
                { status: 'Entregue' as OrderStatusType, color: 'bg-purple-100', textColor: 'text-purple-800', icon: '🚚', desc: 'Entregue ao cliente' },
                { status: 'Cancelado' as OrderStatusType, color: 'bg-red-100', textColor: 'text-red-800', icon: '❌', desc: 'Pedido cancelado' },
              ].map(({ status, color, textColor, icon, desc }) => (
                <div key={status} className={`${color} ${textColor} p-3 rounded-lg`}>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="font-medium">{status}</p>
                      <p className="text-xs opacity-90">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Nota:</strong> Use o painel de pedidos para atualizar o status dos pedidos
                conforme eles progridem no preparo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
