export default {
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src',
      'firebase/auth': '/node_modules/firebase/auth/dist/index.esm.js',
      'firebase/app': '/node_modules/firebase/app/dist/index.esm.js'
    }
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth']
  },
  build: {
    target: 'esnext'
  }
} 