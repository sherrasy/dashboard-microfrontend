import type { AppEvent, AppEventBase, CartAddItemEvent, CartUpdatedEvent } from './events';

// Рантайм-валидация событий event bus (AGENTS.md: remote не доверяет
// событиям от других remote вслепую, TypeScript-типы в рантайме не защищают).
// zod в зависимостях нет, поэтому — guard-функции с явными проверками.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return isNonNegativeInteger(value) && value > 0;
}

export function isCartAddItemEvent(event: AppEventBase): event is CartAddItemEvent {
  if (event.type !== 'CART_ADD_ITEM' || event.source !== 'remote-catalog') {
    return false;
  }
  const payload = event.payload;
  return (
    isRecord(payload) &&
    typeof payload.productId === 'string' &&
    payload.productId.length > 0 &&
    typeof payload.title === 'string' &&
    isFiniteNumber(payload.price) &&
    payload.price >= 0 &&
    isPositiveInteger(payload.quantity)
  );
}

export function isCartUpdatedEvent(event: AppEventBase): event is CartUpdatedEvent {
  if (event.type !== 'CART_UPDATED' || event.source !== 'remote-cart') {
    return false;
  }
  const payload = event.payload;
  return isRecord(payload) && isNonNegativeInteger(payload.totalItems);
}

export function isAppEvent(event: AppEventBase): event is AppEvent {
  return isCartAddItemEvent(event) || isCartUpdatedEvent(event);
}
