import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Module Federation: host-shell — consumer, ничего не exposes.
const shared = {
  react: { singleton: true, requiredVersion: '18.3.1' },
  'react-dom': { singleton: true, requiredVersion: '18.3.1' },
  // `version` у react/jsx-runtime задан явно: иначе плагин пытается
  // зарезолвить несуществующий "react/jsx-runtime/package.json".
  'react/jsx-runtime': { singleton: true, requiredVersion: '18.3.1', version: '18.3.1' },
  '@marketplace/shared': { singleton: true, requiredVersion: '0.0.0' },
};

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_shell',
      remotes: {
        // @originjs не поддерживает синтаксис "name@url" (это Webpack MF):
        // строка используется как URL целиком. Имя remote задаётся
        // в конфиге самого remote (name: 'remote_catalog' и т.д.).
        catalog: 'http://localhost:3001/assets/remoteEntry.js',
        cart: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared,
    }),
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
