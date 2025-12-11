import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
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
})
