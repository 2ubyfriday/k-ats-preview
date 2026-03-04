import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: 'localhost',
    port: 3000,
    open: true
  },
  base: '/', // Firebase Hosting을 위한 base 경로
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})


