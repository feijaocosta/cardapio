import { DefaultLayout } from './default';
import { ModernLayout } from './modern';
import { ImageBasedLayout } from './image-based';

export type LayoutKey = 'default' | 'modern' | 'image-based';

export function getLayout(key?: LayoutKey | null) {
  console.log('🎨 getLayout() chamado com key:', key, '| Type:', typeof key);
  
  const layoutKey = key || 'default';
  
  switch (layoutKey) {
    case 'modern':
      console.log('✅ Retornando ModernLayout');
      return ModernLayout;
    case 'image-based':
      console.log('✅ Retornando ImageBasedLayout');
      return ImageBasedLayout;
    case 'default':
    default:
      console.log('✅ Retornando DefaultLayout');
      return DefaultLayout;
  }
}
