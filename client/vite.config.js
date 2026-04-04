/** Vite — outil de build et serveur de développement */
/** remplace Create React App et est beaucoup plus rapide */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  /** plugins Reactpour supporter la synthaxe JSX et le hot reload */
  plugins: [react()],
})
