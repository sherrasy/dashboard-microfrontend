// Валидация env-переменных с URL ремоутов на старте приложения (AGENTS.md).
// Модуль импортируется первым в main.tsx: без корректных переменных
// приложение падает сразу с понятным сообщением (fail-fast).

function requireRemoteUrl(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `[host-shell] Не задана переменная окружения ${name} (URL remote для Module Federation). ` +
        `Заполните её в apps/host-shell/.env.development или .env.production.`,
    );
  }
  try {
    return new URL(value).toString();
  } catch {
    throw new Error(
      `[host-shell] Переменная окружения ${name} содержит некорректный URL: "${value}".`,
    );
  }
}

export const remoteUrls = {
  catalog: requireRemoteUrl('VITE_CATALOG_REMOTE_URL', import.meta.env.VITE_CATALOG_REMOTE_URL),
  cart: requireRemoteUrl('VITE_CART_REMOTE_URL', import.meta.env.VITE_CART_REMOTE_URL),
  catalogFallback: requireRemoteUrl(
    'VITE_CATALOG_REMOTE_FALLBACK_URL',
    import.meta.env.VITE_CATALOG_REMOTE_FALLBACK_URL,
  ),
  cartFallback: requireRemoteUrl(
    'VITE_CART_REMOTE_FALLBACK_URL',
    import.meta.env.VITE_CART_REMOTE_FALLBACK_URL,
  ),
} as const;
