
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Set root to project root so it can find components
  publicDir: 'static', // Use static as public dir
  server: {
    port: 5173,
    open: false
  },
  resolve: {
    alias: {
      '@': '/src', // Adjust if needed
    },
  },
});
