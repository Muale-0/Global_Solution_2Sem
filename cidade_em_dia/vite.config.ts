import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Cada plugin ensina o Vite a entender uma coisa: o do React entende JSX,
// o do Tailwind gera o CSS a partir das classes usadas no código.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
