import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        icon: true,
      },
      include: '**/*.svg?react',
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/images/**/*.{jpg,png,jpeg,webp,avif,svg}', // Копируем все изображения
          dest: 'assets/images', // В dist/assets/images
        },
        {
          src: 'src/assets/docs/*.pdf',
          dest: 'assets/docs', // Копируем PDF
        },
        {
          src: 'src/assets/videos/*.{mp4,webm}',
          dest: 'assets/videos', // Копируем видео
        },
        {
          src: 'src/assets/fonts/*.{woff,woff2,ttf,otf}',
          dest: 'assets/fonts',
        },
        {
          src: 'public/sitemap.xml',
          dest: '.',
        },
        {
          src: 'public/robots.txt',
          dest: '.',
        },
        {
          src: 'public/google186b029611d24482.html',
          dest: '.',
        },
        {
          src: 'public/yandex_e21bf68a601451d9.html',
          dest: '.',
        },
      ],
    }),
  ],
  server: {
    historyApiFallback: true,
    port: 3002,
    open: true,
    mimeTypes: {
      woff2: 'font/woff2',
    },
  },
  // Используем абсолютные пути для продакшена
  // base: '/',
  // Для GH
  base: '/tam-tam-prod/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Алиас для src
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/scss/variables" as *;`,
        api: 'modern-compiler',
        quietDeps: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Папка для статических ресурсов
    minify: 'esbuild',
    target: 'es2015',
    assetsInlineLimit: 0, // Отключаем встраивание SVG как data:image/svg+xml
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('swiper')) return 'swiper';
            if (id.includes('framer-motion')) return 'framer-motion';
            return 'vendor';
          }

          if (id.includes('/src/components/')) {
            const parts = id.split('/src/components/')[1].split('/');
            const folder = parts[0];

            return folder.toLowerCase();
          }

          return null;
        },
        assetFileNames: (assetInfo) => {
          // Сохраняем структуру папок для изображений, видео и других активов
          const extType = assetInfo.name.split('.').pop();
          if (/png|jpg|jpeg|webp|avif|svg/i.test(extType)) {
            return 'assets/images/[name].[ext]';
          }
          if (/mp4|webm/i.test(extType)) {
            return 'assets/videos/[name].[ext]';
          }
          if (/woff|woff2/i.test(extType)) {
            return 'assets/fonts/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
      input: {
        main: 'index.html',
      },
    },
  },
});
