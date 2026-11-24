import { lazy, useCallback, useMemo, useState, type ComponentType } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { RemoteLoader } from './RemoteLoader';
import { remoteUrls } from './remoteEnv';

type RemoteModule = { default: ComponentType };

// Graceful degradation: если основной remoteEntry недоступен,
// переключаем remote на fallback URL (стейджинг) и повторяем загрузку.
async function importRemoteWithFallback(
  importer: () => Promise<RemoteModule>,
  remoteName: string,
  exposedModule: string,
  fallbackUrl: string,
): Promise<RemoteModule> {
  try {
    return await importer();
  } catch (primaryError) {
    console.warn(
      `[host-shell] Не удалось загрузить remote "${remoteName}", пробуем fallback (стейджинг):`,
      primaryError,
    );
    const { __federation_method_setRemote, __federation_method_getRemote } = await import(
      'virtual:__federation__'
    );
    __federation_method_setRemote(remoteName, { url: fallbackUrl, format: 'esm', from: 'vite' });
    return __federation_method_getRemote(remoteName, exposedModule) as Promise<RemoteModule>;
  }
}

const loadCatalog = () =>
  importRemoteWithFallback(() => import('catalog/App'), 'catalog', './App', remoteUrls.catalogFallback);
const loadCart = () =>
  importRemoteWithFallback(() => import('cart/App'), 'cart', './App', remoteUrls.cartFallback);

interface RemoteSlotProps {
  name: string;
  importer: () => Promise<RemoteModule>;
}

// Per-remote обёртка: свой ErrorBoundary и retry через пересоздание
// ленивого компонента (новый lazy не помнит упавший промис).
function RemoteSlot({ name, importer }: RemoteSlotProps) {
  const [attempt, setAttempt] = useState(0);
  const RemoteComponent = useMemo(() => lazy(importer), [importer, attempt]);
  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  return (
    <ErrorBoundary key={attempt} remoteName={name} onRetry={retry}>
      <RemoteLoader onRetry={retry}>
        <RemoteComponent />
      </RemoteLoader>
    </ErrorBoundary>
  );
}

export function App() {
  return (
    <div className="host-page">
      <header className="host-header">
        <h1 className="host-header__title">Кофейный маркетплейс</h1>
      </header>
      <div className="host-layout">
        <div className="host-column-catalog">
          <RemoteSlot name="Каталог" importer={loadCatalog} />
        </div>
        <aside className="host-column-cart">
          <RemoteSlot name="Корзина" importer={loadCart} />
        </aside>
      </div>
    </div>
  );
}
