import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path"; // Make sure 'path' is imported
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Removed the extra comma here
  },                                       
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      // Keep your existing alias(es)
      "@": path.resolve(__dirname, "./src"),

      // --- Add this line ---
      // This assumes your schemas are in the 'src/schemas' directory
      "@schemas": path.resolve(__dirname, "./src/schemas"),
      // ---------------------

      // If your schemas are elsewhere, adjust the path './src/schemas' accordingly
      // For example, if they were directly in the root:
      // "@schemas": path.resolve(__dirname, "./schemas"),
    },
  },
}));