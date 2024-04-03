import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
console.log('environment', process.env.VITE_ENV)
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_ENV === "production" ? '/admin/' : '/pruebas/admin',
  plugins: [react()]
})
