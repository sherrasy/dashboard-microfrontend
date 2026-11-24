// @vitest-environment jsdom
import { cleanup, renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { eventBus } from './eventBusInstance';
import { useEventBus, useEventPublisher } from './useEventBus';
import type { CartAddItemEvent, CartUpdatedEvent } from './events';

const cartAddEvent: CartAddItemEvent = {
  type: 'CART_ADD_ITEM',
  payload: { productId: 'product-1', title: 'Кофе', price: 100, quantity: 2 },
  source: 'remote-catalog',
};

const cartUpdatedEvent: CartUpdatedEvent = {
  type: 'CART_UPDATED',
  payload: { totalItems: 2 },
  source: 'remote-cart',
};

afterEach(() => {
  cleanup();
  eventBus.clear();
});

describe('useEventBus', () => {
  it('подписывается и вызывает handler при событии', () => {
    const handler = vi.fn();
    renderHook(() => useEventBus('CART_ADD_ITEM', handler));

    act(() => {
      eventBus.publish(cartAddEvent);
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(cartAddEvent);
  });

  it('отписывается при unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEventBus('CART_ADD_ITEM', handler));

    unmount();
    act(() => {
      eventBus.publish(cartAddEvent);
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('использует актуальный handler без пересоздания подписки', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(
      ({ handler }: { handler: typeof first }) => useEventBus('CART_ADD_ITEM', handler),
      { initialProps: { handler: first } },
    );

    rerender({ handler: second });
    act(() => {
      eventBus.publish(cartAddEvent);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe('useEventPublisher', () => {
  it('возвращает стабильную ссылку между рендерами', () => {
    const { result, rerender } = renderHook(() => useEventPublisher());
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it('публикует событие в шину', () => {
    const handler = vi.fn();
    renderHook(() => useEventBus('CART_UPDATED', handler));
    const { result } = renderHook(() => useEventPublisher());

    act(() => {
      result.current(cartUpdatedEvent);
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(cartUpdatedEvent);
  });
});
