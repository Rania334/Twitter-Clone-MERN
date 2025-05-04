import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
  // 👇 This is the important part!
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // 👇 HTML fallback to support React Router
  preview: {
    fallback: '/index.html',
  }
});
