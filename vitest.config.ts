import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [Vue(), VueJsx()],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
    },
    exclude: ['**/node_modules/**', '**/dist/**'],
    include: ['./**/*.test.{ts,tsx,js,jsx}'],
    setupFiles: ['./vitest-setup.ts'],
    globals: true,
  },
})
