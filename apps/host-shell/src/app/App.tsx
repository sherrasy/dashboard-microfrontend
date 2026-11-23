import { sharedInstanceId } from '@marketplace/shared';
import { lazy } from 'react';
import { RemoteLoader } from './RemoteLoader';

const CatalogApp = lazy(() => import('catalog/App'));
const CartApp = lazy(() => import('cart/App'));

export function App() {
  return (
    <main>
      <h1>host-shell</h1>
      {/* Пробник изоляции: при корректном singleton id совпадёт у всех приложений */}
      <p>shared id: {sharedInstanceId}</p>
      <RemoteLoader>
        <CatalogApp />
      </RemoteLoader>
      <RemoteLoader>
        <CartApp />
      </RemoteLoader>
    </main>
  );
}
