import { useParams, useNavigate } from 'react-router-dom';
import { CustomerView } from '../../components/customer-view';
import { CustomerViewContainer } from '../../components/CustomerViewContainer';

export default function CustomerViewPage() {
  const { menuId } = useParams();
  const navigate = useNavigate();

  console.log('🔍 CustomerViewPage - menuId:', menuId); // Debug

  // Se não houver menuId, mostrar a lista de cardápios
  if (!menuId) {
    console.log('📋 Renderizando listagem de cardápios');
    // key garante que CustomerView remonta quando volta de /menu/:menuId
    return <CustomerView key="customer-view-list" />;
  }

  // Se houver menuId, mostrar cardápio específico
  console.log('🍽️ Renderizando cardápio específico:', menuId);
  return (
    <CustomerViewContainer 
      key={`menu-${menuId}`}
      onOrderPlaced={() => {}} 
      menuId={parseInt(menuId)}
      onBackToMenus={() => navigate('/')}
    />
  );
}
