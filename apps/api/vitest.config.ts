import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
    exclude: ['src/**/*.integration.spec.ts', 'src/**/*.e2e.spec.ts'],
  },
  plugins: [swc.vite()],
  resolve: {
    alias: {
      '@modules': './src/modules',
      '@shared': './src/modules/shared',
      '@libs': './src/libs',
    },
  },
});
