import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface RemoteLoaderProps {
  children: ReactNode;
  onRetry?: () => void;
}

// Host-level ErrorBoundary вокруг Suspense: страховка на случай ошибок
// рендера ленивых детей. Основной fallback с retry — per-remote
// ErrorBoundary в App.tsx.
export function RemoteLoader({ children, onRetry }: RemoteLoaderProps) {
  return (
    <ErrorBoundary remoteName="приложение" onRetry={onRetry}>
      <Suspense fallback={<p>Загрузка...</p>}>{children}</Suspense>
    </ErrorBoundary>
  );
}
