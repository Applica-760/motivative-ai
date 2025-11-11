import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // publicDirの設定を明示化
  publicDir: 'public',
  build: {
    // ビルド時にアセットを適切にコピー
    assetsInlineLimit: 0, // すべてのアセットをファイルとして出力
  },
})
