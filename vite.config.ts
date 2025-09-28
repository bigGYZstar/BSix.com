import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/BSix.com/',
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        teams: resolve(__dirname, 'teams-advanced-stats.html'),
        liverpool: resolve(__dirname, 'liverpool-detail.html'),
        arsenal: resolve(__dirname, 'arsenal.html'),
        chelsea: resolve(__dirname, 'chelsea.html'),
        stats: resolve(__dirname, 'stats.html'),
        fixtures: resolve(__dirname, 'fixtures.html'),
        // news: resolve(__dirname, 'news.html'), // 未実装
        // player: resolve(__dirname, 'player-detail.html'), // 未実装
        characterSystemTest: resolve(__dirname, 'character-system-test.html'),
        arneSlotSpecial: resolve(__dirname, 'arne-slot-special.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/features': resolve(__dirname, 'src/features'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/datasource': resolve(__dirname, 'src/datasource'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/schemas': resolve(__dirname, 'schemas')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    allowedHosts: 'all',
    cors: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: 'all'
  },
  css: {
    devSourcemap: true
  },
  optimizeDeps: {
    include: ['ajv']
  }
});
