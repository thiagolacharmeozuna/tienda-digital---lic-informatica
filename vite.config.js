import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' permite desplegar en GitHub Pages sin romper las rutas de las imágenes
export default defineConfig({
  plugins: [vue()],
  base: './'
})
