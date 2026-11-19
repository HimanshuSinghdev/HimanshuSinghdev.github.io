import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User site (himanshusinghdev.github.io) is served from the domain root,
// so absolute asset paths are correct.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
