import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import WindiCSS from 'vite-plugin-windicss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    {
      name: 'singleHMR',
      handleHotUpdate({ modules }) {
        // eslint-disable-next-line array-callback-return
        modules.map((m) => {
          m.importedModules = new Set();
          m.importers = new Set();
        });

        return modules;
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        payment: path.resolve(__dirname, 'checkout.html'),
      },
      output: {
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  server: {
    host: true,
    port: 8080,
  },
  preview: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/styles/index.scss";
        `,
      },
    },
    postcss: {
      plugins: [
        autoprefixer({}),
      ],
    },
  },
});
