import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
        proxy:{
            "/api":{
                target: "http://localhost:5147",
                changeOrigin: true,
            },
        }
    },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/routes', 
      // Tell the plugin exactly where to put the generated file:
      generatedRouteTree: './src/routeTree.gen.ts'
    }),
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
