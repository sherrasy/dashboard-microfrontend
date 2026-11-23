import { useCallback, useEffect, useRef } from 'react';
import type { AppEvent } from './events';
import { eventBus } from './eventBusInstance';

export function useEventBus<E extends AppEvent['type']>(
  type: E,
  handler: (event: Extract<AppEvent, { type: E }>) => void,
): void {
  // Всегда вызываем свежий handler, не пересоздавая подписку при его смене.
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return eventBus.subscribe(type, (event) => handlerRef.current(event));
  }, [type]);
}

export function useEventPublisher(): (event: AppEvent) => void {
  return useCallback((event: AppEvent) => {
    eventBus.publish(event);
  }, []);
}
