import { DefaultLayout } from './default';
import { ModernLayout } from './modern';
import { ImageBasedLayout } from './image-based';

export type LayoutKey = 'default' | 'modern' | 'image-based';

export function getLayout(key: LayoutKey) {
  switch (key) {
    case 'default':
      return DefaultLayout;
    case 'modern':
      return ModernLayout;
    case 'image-based':
      return ImageBasedLayout;
    default:
      return DefaultLayout;
  }
}
