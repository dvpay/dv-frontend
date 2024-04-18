import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import WindiCSS from 'vite-plugin-windicss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: '/',
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
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        payment: path.resolve(__dirname, 'checkout.html'),
      },
      output: {
        //sourcemapBaseUrl: '/',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return `assets/images/[name]-${process.env.npm_package_version}[extname]`;
          }
          if (/\.css$/.test(name ?? '')) {
            return `assets/css/[name]-${process.env.npm_package_version}[extname]`;
          }
          return `assets/[name]-${process.env.npm_package_version}[extname]`;
        },

        chunkFileNames: `assets/js/[name]-${process.env.npm_package_version}.js`,
        entryFileNames: `assets/js/[name]-${process.env.npm_package_version}.js`,
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
