import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.integration.spec.ts'],
    testTimeout: 30000,
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
