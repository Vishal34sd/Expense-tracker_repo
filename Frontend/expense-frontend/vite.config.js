import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://expense-tracker-c5hw.onrender.com',
        changeOrigin: true,
        secure: false,
        
       // Vite will proxy /api requests to http://localhost:8080/api.
       //Example - axios.post("/api/v1/login", formData);
      }
    }
  }
  
})
