import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Module Federation: remote-cart exposes ./App.
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
      name: 'remote_cart',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/app/App.tsx',
      },
      shared,
    }),
  ],
  server: {
    port: 3002,
  },
  preview: {
    port: 3002,
  },
});
