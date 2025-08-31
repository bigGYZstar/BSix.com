import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/BSix.com/' : './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/app': resolve(__dirname, 'src/app'),
      '@/ui': resolve(__dirname, 'src/ui'),
      '@/features': resolve(__dirname, 'src/features'),
      '@/data': resolve(__dirname, 'src/data'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
})
