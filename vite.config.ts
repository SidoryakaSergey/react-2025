/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/index.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.test.*',
        '**/*.spec.*',
        'vitest.setup.ts',
      ],
      include: ['src/**/*.{ts,tsx}'],
      // Пороги покрытия согласно ТЗ
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
