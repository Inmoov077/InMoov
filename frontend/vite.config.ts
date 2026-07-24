import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server proxies /api to Flask so RealSense MJPEG and servo routes work under Vite.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/models': 'http://localhost:5000',
      '/js': 'http://localhost:5000',
      '/img': 'http://localhost:5000',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
