import { useCallback, useEffect, useRef, useState } from 'react';
import { mockApi } from '@marketplace/shared';
import type { ProductsPage } from '@marketplace/shared';

export const PAGE_SIZE = 12;

export interface CatalogParams {
  category: string;
  search: string;
  page: number;
}

export interface CatalogDataState {
  data: ProductsPage | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

// onDataChange — опциональный сайд-эффект на успешный ответ
// (например, обновить число страниц для пагинации). Вызывается в .then,
// не во время рендера.
export function useCatalogData(
  { category, search, page }: CatalogParams,
  onDataChange?: (total: number) => void,
): CatalogDataState {
  const [data, setData] = useState<ProductsPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Колбэк кладем в ref: иначе инлайн-стрелка из компонента даёт новую
  // ссылку на каждом рендере и эффект (пере)запускает запрос бесконечно.
  const onDataChangeRef = useRef(onDataChange);
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  });

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    mockApi
      .getProducts({ category, search, page, limit: PAGE_SIZE }, controller.signal)
      .then((result) => {
        // Промис мог быть отменен (cleanup вызвал abort), пока шла сеть —
        // тогда его результат устарел и стейт трогать нельзя.
        if (controller.signal.aborted) {
          return;
        }
        setData(result);
        setIsLoading(false);
        onDataChangeRef.current?.(result.total);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setError(cause instanceof Error ? cause.message : 'Не удалось загрузить товары');
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [category, search, page, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  return { data, isLoading, error, retry };
}
