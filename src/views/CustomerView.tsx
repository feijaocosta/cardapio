import { useParams } from 'react-router-dom';
import { CustomerView } from '../components/customer-view';

export default function CustomerViewPage() {
  const { menuId } = useParams();

  console.log('🔍 CustomerViewPage - menuId:', menuId); // Debug

  // Se não houver menuId, mostrar a lista de cardápios
  if (!menuId) {
    console.log('📋 Renderizando listagem de cardápios');
    // key garante que CustomerView remonta quando volta de /menu/:menuId
    return <CustomerView key="customer-view-list" />;
  }

  // Se houver menuId, passar para o CustomerView filtrar
  console.log('🍽️ Renderizando cardápio específico:', menuId);
  return <CustomerView key={`menu-${menuId}`} selectedMenuId={parseInt(menuId)} />;
}
