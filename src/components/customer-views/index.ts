import { DefaultLayout } from './default';
import { ModernLayout } from './modern';

export type LayoutKey = 'default' | 'modern';

export function getLayout(key: LayoutKey) {
  switch (key) {
    case 'default':
      return DefaultLayout;
    case 'modern':
      return ModernLayout;
    default:
      return DefaultLayout;
  }
}
