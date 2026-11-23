// Дискриминированный union кросс-app событий мини-маркетплейса.
// Базовый формат по AGENTS.md: { type, payload, source }.

export interface AppEventBase {
  type: string;
  payload: unknown;
  source: string;
}

export interface CartAddItemEvent extends AppEventBase {
  type: 'CART_ADD_ITEM';
  payload: { productId: string; quantity: number };
  source: 'remote-catalog';
}

export interface CartUpdatedEvent extends AppEventBase {
  type: 'CART_UPDATED';
  payload: { totalItems: number };
  source: 'remote-cart';
}

export type AppEvent = CartAddItemEvent | CartUpdatedEvent;
