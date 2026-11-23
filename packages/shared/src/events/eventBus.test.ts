import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { createEventBus } from './eventBus';
import type { CartAddItemEvent, CartUpdatedEvent } from './events';

const cartAddEvent: CartAddItemEvent = {
  type: 'CART_ADD_ITEM',
  payload: { productId: 'product-1', quantity: 2 },
  source: 'remote-catalog',
};

const cartUpdatedEvent: CartUpdatedEvent = {
  type: 'CART_UPDATED',
  payload: { totalItems: 2 },
  source: 'remote-cart',
};

describe('createEventBus', () => {
  it('доставляет опубликованное событие подписчику', () => {
    const bus = createEventBus();
    const handler = vi.fn();

    bus.subscribe('CART_ADD_ITEM', handler);
    bus.publish(cartAddEvent);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(cartAddEvent);
  });

  it('типизирует событие по переданному типу', () => {
    const bus = createEventBus();

    bus.subscribe('CART_ADD_ITEM', (event) => {
      expectTypeOf(event.payload).toEqualTypeOf<{ productId: string; quantity: number }>();
      expectTypeOf(event.source).toEqualTypeOf<'remote-catalog'>();
    });
  });

  it('unsubscribe отключает обработчик', () => {
    const bus = createEventBus();
    const handler = vi.fn();

    const unsubscribe = bus.subscribe('CART_ADD_ITEM', handler);
    unsubscribe();
    bus.publish(cartAddEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('несколько подписчиков получают событие', () => {
    const bus = createEventBus();
    const first = vi.fn();
    const second = vi.fn();

    bus.subscribe('CART_ADD_ITEM', first);
    bus.subscribe('CART_ADD_ITEM', second);
    bus.publish(cartAddEvent);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('обработчик одного типа не реагирует на другой тип', () => {
    const bus = createEventBus();
    const addItemHandler = vi.fn();
    const updatedHandler = vi.fn();

    bus.subscribe('CART_ADD_ITEM', addItemHandler);
    bus.subscribe('CART_UPDATED', updatedHandler);
    bus.publish(cartUpdatedEvent);

    expect(addItemHandler).not.toHaveBeenCalled();
    expect(updatedHandler).toHaveBeenCalledTimes(1);
  });

  it('повторный unsubscribe не вызывает ошибку', () => {
    const bus = createEventBus();
    const handler = vi.fn();

    const unsubscribe = bus.subscribe('CART_ADD_ITEM', handler);
    unsubscribe();
    unsubscribe();
    bus.publish(cartAddEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('clear() удаляет всех подписчиков', () => {
    const bus = createEventBus();
    const first = vi.fn();
    const second = vi.fn();

    bus.subscribe('CART_ADD_ITEM', first);
    bus.subscribe('CART_UPDATED', second);
    bus.clear();

    bus.publish(cartAddEvent);
    bus.publish(cartUpdatedEvent);

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });
});
