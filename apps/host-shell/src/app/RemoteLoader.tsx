import { Suspense, type ReactNode } from 'react';

export function RemoteLoader({ children }: { children: ReactNode }) {
  return <Suspense fallback={<p>Загрузка...</p>}>{children}</Suspense>;
}
