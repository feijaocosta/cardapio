import { defineConfig } from 'vite';

export default defineConfig(() => {
  const debugBuild = process.env.VITE_DEBUG_BUILD === '1';
  const minifyMode: false | 'esbuild' = debugBuild ? false : 'esbuild';

  return {
    base: process.env.VITE_BASE_PATH || '/',
    build: {
      sourcemap: debugBuild,
      minify: minifyMode,
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  };
});