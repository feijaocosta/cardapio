import { ReactNode } from 'react';
import CustomerViewPage from '../views/CustomerView';
import AdminView from '../views/AdminView';

export interface Route {
  path: string;
  element: ReactNode;
}

export const routes: Route[] = [
  {
    path: '/',
    element: <CustomerViewPage />,
  },
  {
    path: '/menu/:menuId',
    element: <CustomerViewPage />,
  },
  {
    path: '/admin/*',
    element: <AdminView />,
  },
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl text-gray-700">Página não encontrada - 404</h1>
      </div>
    ),
  },
];
