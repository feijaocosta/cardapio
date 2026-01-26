import { type MenuItem, type Menu } from '../../services/api';

export interface LayoutProps {
  menus: Menu[];
  selectedMenu: Menu | null;
  menuItems: MenuItem[];
  customerName: string;
  quantities: Record<number, number>;
  showSuccess: boolean;
  showPrice: boolean;
  onSelectMenu: (menu: Menu) => void;
  onBackToMenus: () => void;
  onCustomerNameChange: (name: string) => void;
  onQuantityChange: (itemId: number, change: number) => void;
  onSubmitOrder: (e: React.FormEvent) => void;
  calculateTotal: () => number;
}
