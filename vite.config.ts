import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'production' &&
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps for production debugging
    sourcemap: mode === 'development',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize bundle splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI components chunk
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          // Data/API chunk
          'data-vendor': ['@tanstack/react-query', '@supabase/supabase-js'],
          // Chart library chunk
          'charts': ['recharts'],
          // Utilities chunk
          'utils': ['date-fns', 'crypto-js', 'dompurify', 'zod'],
          // Icons chunk
          'icons': ['lucide-react'],
        },
      },
    },
    // Enable advanced minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: mode === 'development',
    // PostCSS optimizations are handled by Tailwind
  },
  // Enable modern browser features
  esbuild: {
    target: 'es2020',
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
