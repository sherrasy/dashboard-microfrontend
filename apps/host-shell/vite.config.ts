import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Module Federation: host-shell — consumer, ничего не exposes.
const shared = {
  react: { singleton: true, requiredVersion: '^18.3.1' },
  'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
  // `version` у react/jsx-runtime задан явно: иначе плагин пытается
  // зарезолвить несуществующий "react/jsx-runtime/package.json".
  'react/jsx-runtime': { singleton: true, requiredVersion: '^18.3.1', version: '18.3.1' },
  '@marketplace/shared': { singleton: true, requiredVersion: '0.0.0' },
};

// URL ремоутов — только через env с валидацией на старте (AGENTS.md).
// Без переменной или при невалидном URL сборка падает сразу (fail-fast).
// Допустимы абсолютные URL (http(s)://...) и origin-относительные пути
// ("/<repo>/catalog/...") — так хост деплоится на GH Pages без хардкода
// домена (см. scripts/build-pages.mjs).
function requireRemoteUrl(env: Record<string, string>, name: string): string {
  const value = env[name];
  if (!value) {
    throw new Error(
      `[host-shell] Не задана переменная окружения ${name} (URL remote для Module Federation). ` +
        `Заполните её в apps/host-shell/.env.development или .env.production.`,
    );
  }
  if (value.startsWith('/')) {
    return value;
  }
  try {
    return new URL(value).toString();
  } catch {
    throw new Error(
      `[host-shell] Переменная окружения ${name} содержит некорректный URL: "${value}".`,
    );
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');

  return {
    // Базовый путь для деплоя (GH Pages: /<repo>/host). Задаётся через BASE_PATH при сборке.
    base: process.env.BASE_PATH ?? '/',
    plugins: [
      react(),
      federation({
        name: 'host_shell',
        remotes: {
          // @originjs не поддерживает синтаксис "name@url" (это Webpack MF):
          // строка используется как URL целиком. Имя remote задаётся
          // в конфиге самого remote (name: 'remote_catalog' и т.д.).
          // Fallback URL (VITE_*_REMOTE_FALLBACK_URL) используется в рантайме
          // при недоступности основного remote — см. src/app/App.tsx.
          catalog: requireRemoteUrl(env, 'VITE_CATALOG_REMOTE_URL'),
          cart: requireRemoteUrl(env, 'VITE_CART_REMOTE_URL'),
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
  };
});
