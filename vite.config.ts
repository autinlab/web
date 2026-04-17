import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for GitHub Pages deployment
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        labintern: new URL('./labintern.html', import.meta.url).pathname,
        xrstudy: new URL('./xrstudy.html', import.meta.url).pathname,
      },
    },
  },
})
