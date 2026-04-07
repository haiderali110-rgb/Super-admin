
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'

export default defineConfig({
  root: join(__dirname, 'src/renderer'),
  plugins: [react()],
  base: './',
  server: {
    host: 'localhost',
    port: parseInt(process.env.PORT || '5173', 10),
    strictPort: false,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
  build: {
    outDir: join(__dirname, 'dist/renderer'),
  },
});