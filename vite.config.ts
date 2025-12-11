import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    build: {
      // Increase chunk size limit to suppress warnings for large dependencies like @google/genai
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code into a separate chunk to optimize loading and fix chunk size warnings
            vendor: ['react', 'react-dom', 'recharts', '@google/genai'],
          },
        },
      },
    },
  }
})