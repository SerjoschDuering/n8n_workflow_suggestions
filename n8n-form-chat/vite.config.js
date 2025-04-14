import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path should point to n8n-form-chat directory
  base: process.env.NODE_ENV === 'production' ? '/n8n_workflow_suggestions/form/' : '/',
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for better debugging
    sourcemap: true,
    // Ensure assets are handled correctly
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Ensure proper chunking
        manualChunks: undefined,
        // Ensure proper asset paths
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
}); 