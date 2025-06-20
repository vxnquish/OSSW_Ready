import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/OSSW_Ready/',
  plugins: [react()],
})