import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// Recreamos __dirname para entornos ESM (Vite utiliza módulos de ES por defecto)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  resolve: {
    alias: {
      // Configuramos el alias '@' para que apunte a la carpeta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
})
