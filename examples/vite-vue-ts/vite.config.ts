import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PreprocessorDirectives from 'unplugin-preprocessor-directives/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), PreprocessorDirectives()],
})
