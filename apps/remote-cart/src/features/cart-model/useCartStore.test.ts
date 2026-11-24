import { beforeEach, describe, expect, it } from 'vitest';
import { mockApi } from '@marketplace/shared';
import type { CartItem } from '@marketplace/shared';
import { useCartStore } from './useCartStore';

const item: CartItem = {
  productId: 'bean-001',
  title: 'Эфиопия Иргачефф, зерно 250 г',
  price: 1450,
  quantity: 2,
};

function resetStore(items: CartItem[] = []): void {
  useCartStore.setState({
    items,
    totalItems: items.reduce((sum, current) => sum + current.quantity, 0),
    isLoading: false,
    error: null,
  });
}

describe('useCartStore: откат при ошибке API', () => {
  beforeEach(() => {
    mockApi.setDelay(0);
    mockApi.setJitter(0);
    mockApi.disableErrorMode('updateCartQuantity');
    mockApi.disableErrorMode('checkout');
    resetStore([item]);
  });

  it('updateQuantity: ошибка API → количество восстановлено, error установлен', async () => {
    mockApi.enableErrorMode('updateCartQuantity');

    await useCartStore.getState().updateQuantity(item.productId, 5);

    const state = useCartStore.getState();
    expect(state.items).toEqual([item]);
    expect(state.totalItems).toBe(item.quantity);
    expect(state.error).toBe('Не удалось обновить количество');
    expect(state.isLoading).toBe(false);
  });

  it('removeItem: ошибка API → позиция восстановлена, error установлен', async () => {
    mockApi.enableErrorMode('updateCartQuantity');

    await useCartStore.getState().removeItem(item.productId);

    const state = useCartStore.getState();
    expect(state.items).toEqual([item]);
    expect(state.totalItems).toBe(item.quantity);
    expect(state.error).toBe('Не удалось удалить товар');
    expect(state.isLoading).toBe(false);
  });

  it('checkout: ошибка API → корзина восстановлена, error установлен', async () => {
    mockApi.enableErrorMode('checkout');

    await useCartStore.getState().checkout();

    const state = useCartStore.getState();
    expect(state.items).toEqual([item]);
    expect(state.totalItems).toBe(item.quantity);
    expect(state.error).toBe('Не удалось оформить заказ');
    expect(state.isLoading).toBe(false);
  });

  it('мутации с ошибкой резолвятся без исключений (нет unhandled rejection)', async () => {
    mockApi.enableErrorMode('updateCartQuantity');
    mockApi.enableErrorMode('checkout');

    // Vitest сам валит прогон на unhandled rejection; здесь проверяем,
    // что промисы мутаций резолвятся, а не отклоняются.
    await expect(useCartStore.getState().updateQuantity(item.productId, 5)).resolves.toBeUndefined();
    await expect(useCartStore.getState().removeItem(item.productId)).resolves.toBeUndefined();
    await expect(useCartStore.getState().checkout()).resolves.toBeUndefined();
  });

  it('updateQuantity: успех → состояние синхронизировано с ответом API', async () => {
    await useCartStore.getState().updateQuantity(item.productId, 5);

    const state = useCartStore.getState();
    expect(state.items).toEqual([{ ...item, quantity: 5 }]);
    expect(state.totalItems).toBe(5);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('checkout: успех → корзина очищена', async () => {
    await useCartStore.getState().checkout();

    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.totalItems).toBe(0);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });
});

describe('useCartStore: addItem (optimistic update)', () => {
  beforeEach(() => {
    mockApi.setDelay(0);
    mockApi.setJitter(0);
    mockApi.disableErrorMode('addToCart');
    mockApi.disableErrorMode('checkout');
    // Корзина внутри mockApi общая между тестами — очищаем через checkout.
    return mockApi.checkout().then(() => resetStore());
  });

  it('товар появляется в стейте до ответа API, затем синхронизируется с ответом', async () => {
    mockApi.setDelay(100);

    const pending = useCartStore.getState().addItem({
      productId: 'bean-001',
      title: 'Эфиопия Иргачефф, зерно 250 г',
      price: 1450,
      quantity: 1,
    });

    // До ответа API позиция уже в стейте (оптимистично).
    expect(useCartStore.getState().items).toEqual([
      { productId: 'bean-001', title: 'Эфиопия Иргачефф, зерно 250 г', price: 1450, quantity: 1 },
    ]);
    expect(useCartStore.getState().totalItems).toBe(1);

    await pending;
    expect(useCartStore.getState().error).toBeNull();
    expect(useCartStore.getState().items[0]).toMatchObject({ productId: 'bean-001', quantity: 1 });
  });

  it('ошибка API → позиция откатывается, error установлен, промис резолвится', async () => {
    mockApi.enableErrorMode('addToCart');

    await expect(
      useCartStore.getState().addItem({
        productId: 'bean-002',
        title: 'Кения АА, зерно 250 г',
        price: 1600,
        quantity: 1,
      }),
    ).resolves.toBeUndefined();

    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.totalItems).toBe(0);
    expect(state.error).toBe('Не удалось добавить товар');
  });
});
