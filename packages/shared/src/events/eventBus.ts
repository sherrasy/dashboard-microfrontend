import type { AppEvent } from './events';

export interface EventBus {
  publish<E extends AppEvent>(event: E): void;
  subscribe<E extends AppEvent['type']>(
    type: E,
    handler: (event: Extract<AppEvent, { type: E }>) => void,
  ): () => void;
  clear(): void;
}

export function createEventBus(): EventBus {
  const handlers = new Map<AppEvent['type'], Set<(event: AppEvent) => void>>();

  return {
    publish(event) {
      const subscribers = handlers.get(event.type);
      if (!subscribers) return;
      // Копия: отписка внутри обработчика не должна ломать итерацию.
      for (const handler of [...subscribers]) {
        handler(event);
      }
    },

    subscribe(type, handler) {
      const typedHandler = handler as (event: AppEvent) => void;
      let subscribers = handlers.get(type);
      if (!subscribers) {
        subscribers = new Set();
        handlers.set(type, subscribers);
      }
      const bucket = subscribers;
      bucket.add(typedHandler);

      let active = true;
      return () => {
        if (!active) return;
        active = false;
        bucket.delete(typedHandler);
        if (bucket.size === 0) {
          handlers.delete(type);
        }
      };
    },

    clear() {
      handlers.clear();
    },
  };
}
