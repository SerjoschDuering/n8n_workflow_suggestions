import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Replace with your GitHub repo name for GitHub Pages deployment
  // e.g., if your repo is "username/repo-name", use "/repo-name/"
  // Leave as '/' for custom domains or default GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/n8n_workflow_suggestions/' : '/',
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for better debugging
    sourcemap: true,
  }
}); 