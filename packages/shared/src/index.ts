// Public API пакета @marketplace/shared.
// Экспортируйте сюда только то, что разрешено для кросс-app использования
// (см. AGENTS.md: event bus, типы событий, UI-kit и т.д.).

export type {
  AppEvent,
  AppEventBase,
  CartAddItemEvent,
  CartUpdatedEvent,
} from "./events/events";
export type { EventBus } from "./events/eventBus";
export { createEventBus } from "./events/eventBus";
export { eventBus } from "./events/eventBusInstance";
export { useEventBus, useEventPublisher } from "./events/useEventBus";

// Мок-API каталога и корзины (состояние корзины — общее через singleton shared).
export type {
  CartItem,
  GetProductsParams,
  MockApiMethodName,
  Product,
  ProductsPage,
} from "./api/types";
export { MockApi, mockApi } from "./api/mockApi";
