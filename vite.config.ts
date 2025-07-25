import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // serve on 5174 by default, overridden via npm script
  server: {
    port: 5174,
  },
});
