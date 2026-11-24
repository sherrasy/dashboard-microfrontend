import { describe, expect, it } from 'vitest';
import type { AppEventBase } from './events';
import { isAppEvent, isCartAddItemEvent, isCartUpdatedEvent } from './eventGuards';

const validAddItem: AppEventBase = {
  type: 'CART_ADD_ITEM',
  payload: { productId: 'product-1', title: 'Кофе', price: 100, quantity: 2 },
  source: 'remote-catalog',
};

const validUpdated: AppEventBase = {
  type: 'CART_UPDATED',
  payload: { totalItems: 2 },
  source: 'remote-cart',
};

describe('eventGuards', () => {
  it('принимает валидное событие CART_ADD_ITEM', () => {
    expect(isCartAddItemEvent(validAddItem)).toBe(true);
    expect(isAppEvent(validAddItem)).toBe(true);
  });

  it('принимает валидное событие CART_UPDATED', () => {
    expect(isCartUpdatedEvent(validUpdated)).toBe(true);
    expect(isAppEvent(validUpdated)).toBe(true);
  });

  it('отклоняет CART_ADD_ITEM с чужим source', () => {
    expect(isCartAddItemEvent({ ...validAddItem, source: 'remote-cart' })).toBe(false);
  });

  it('отклоняет CART_ADD_ITEM без productId', () => {
    const event = {
      ...validAddItem,
      payload: { title: 'Кофе', price: 100, quantity: 2 },
    };
    expect(isCartAddItemEvent(event)).toBe(false);
  });

  it('отклоняет CART_ADD_ITEM с пустым productId', () => {
    const event = {
      ...validAddItem,
      payload: { productId: '', title: 'Кофе', price: 100, quantity: 2 },
    };
    expect(isCartAddItemEvent(event)).toBe(false);
  });

  it('отклоняет CART_ADD_ITEM с нечисловой ценой', () => {
    const event = {
      ...validAddItem,
      payload: { productId: 'product-1', title: 'Кофе', price: '100', quantity: 2 },
    };
    expect(isCartAddItemEvent(event)).toBe(false);
  });

  it('отклоняет CART_ADD_ITEM с NaN и отрицательной ценой', () => {
    expect(
      isCartAddItemEvent({
        ...validAddItem,
        payload: { productId: 'product-1', title: 'Кофе', price: NaN, quantity: 2 },
      }),
    ).toBe(false);
    expect(
      isCartAddItemEvent({
        ...validAddItem,
        payload: { productId: 'product-1', title: 'Кофе', price: -5, quantity: 2 },
      }),
    ).toBe(false);
  });

  it('отклоняет CART_ADD_ITEM с нулевым или дробным quantity', () => {
    expect(
      isCartAddItemEvent({
        ...validAddItem,
        payload: { productId: 'product-1', title: 'Кофе', price: 100, quantity: 0 },
      }),
    ).toBe(false);
    expect(
      isCartAddItemEvent({
        ...validAddItem,
        payload: { productId: 'product-1', title: 'Кофе', price: 100, quantity: 1.5 },
      }),
    ).toBe(false);
  });

  it('отклоняет payload, который не объект', () => {
    expect(isCartAddItemEvent({ ...validAddItem, payload: null })).toBe(false);
    expect(isCartAddItemEvent({ ...validAddItem, payload: 'строка' })).toBe(false);
    expect(isCartUpdatedEvent({ ...validUpdated, payload: undefined })).toBe(false);
  });

  it('отклоняет CART_UPDATED с отрицательным totalItems', () => {
    expect(
      isCartUpdatedEvent({ ...validUpdated, payload: { totalItems: -1 } }),
    ).toBe(false);
  });

  it('отклоняет неизвестный тип события', () => {
    const event: AppEventBase = {
      type: 'UNKNOWN_EVENT',
      payload: {},
      source: 'remote-catalog',
    };
    expect(isAppEvent(event)).toBe(false);
  });
});
