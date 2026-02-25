import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [".", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    // In development, API is handled by Express plugin below
    // In production, use VITE_API_BASE_URL environment variable
  },
  build: {
    outDir: "dist/client",
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          animations: ['framer-motion'],
          queries: ['@tanstack/react-query'],
          utils: ['clsx', 'tailwind-merge', 'date-fns'],
          icons: ['lucide-react'],
          
          // Feature chunks - using package names instead of file paths
          media: ['react-pdf', 'pdfjs-dist']
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increased to 1MB
    target: 'esnext',
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  optimizeDeps: {
    exclude: ["./server"],
  },
  ssr: {
    external: [],
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Lazy-load server only when actually needed (during dev serve)
      // Use dynamic import to defer loading until after Vite config is loaded
      let app: any = null;
      let loading = false;
      let loadPromise: Promise<any> | null = null;
      
      // Defer the server import until the first request
      const loadServer = async () => {
        if (app) return app;
        if (loading && loadPromise) return loadPromise;
        
        loading = true;
        loadPromise = (async () => {
          try {
            // Use dynamic import (ESM) instead of require (CommonJS)
            // Import from the server/index.ts file directly
            // Vite will handle the TypeScript compilation
            const serverModule = await import("./server/index.js");
            app = serverModule.createServer();
            loading = false;
            return app;
          } catch (error) {
            loading = false;
            console.error("Failed to load server:", error);
            throw error;
          }
        })();
        
        return loadPromise;
      };

      // Add Express app as middleware to Vite dev server
      // Load server on first request
      server.middlewares.use(async (req, res, next) => {
        try {
          const expressApp = await loadServer();
          expressApp(req, res, next);
        } catch (error) {
          console.error("Error loading Express server:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Server initialization failed" }));
        }
      });
    },
  };
}
