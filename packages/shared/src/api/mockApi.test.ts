import { describe, expect, it } from 'vitest';
import { MockApi, mockApi } from './mockApi';

function createFastApi(): MockApi {
  const api = new MockApi();
  api.setDelay(0);
  api.setJitter(0);
  return api;
}

describe('mockApi.getProducts', () => {
  it('возвращает страницу товаров с пагинацией', async () => {
    const api = createFastApi();

    const first = await api.getProducts({ page: 1, limit: 10 });
    const second = await api.getProducts({ page: 2, limit: 10 });

    expect(first.items).toHaveLength(10);
    expect(first.total).toBe(36);
    expect(second.items).toHaveLength(10);
    expect(second.items[0].id).not.toBe(first.items[0].id);
  });

  it('фильтрует товары по категории', async () => {
    const api = createFastApi();

    const page = await api.getProducts({ category: 'Зерно', page: 1, limit: 50 });

    expect(page.total).toBe(12);
    expect(page.items.every((product) => product.category === 'Зерно')).toBe(true);
  });

  it('отменяет запрос по AbortSignal', async () => {
    const api = new MockApi(); // задержка 500 мс по умолчанию
    const controller = new AbortController();

    const request = api.getProducts({ page: 1, limit: 5 }, controller.signal);
    controller.abort();

    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('отклоняет запрос, если сигнал уже отменен', async () => {
    const api = createFastApi();
    const controller = new AbortController();
    controller.abort();

    await expect(api.getProducts({ page: 1, limit: 5 }, controller.signal)).rejects.toMatchObject(
      { name: 'AbortError' },
    );
  });
});

describe('mockApi.addToCart', () => {
  it('reject с API Error при включенном Error Mode для метода', async () => {
    const api = createFastApi();
    api.enableErrorMode('addToCart');

    await expect(api.addToCart('bean-001', 1)).rejects.toThrow('API Error: addToCart');

    api.disableErrorMode('addToCart');
    await expect(api.addToCart('bean-001', 1)).resolves.toMatchObject({ quantity: 1 });
  });

  it('увеличивает quantity при повторном добавлении того же товара', async () => {
    const api = createFastApi();

    const first = await api.addToCart('bean-001', 1);
    const second = await api.addToCart('bean-001', 2);

    expect(first.quantity).toBe(1);
    expect(second.quantity).toBe(3);
    expect(second.productId).toBe('bean-001');
  });

  it('checkout очищает корзину', async () => {
    const api = createFastApi();
    await api.addToCart('bean-001', 1);
    await api.addToCart('drip-001', 2);

    const { orderId } = await api.checkout();
    const item = await api.addToCart('bean-001', 1);

    expect(orderId).toMatch(/^order-\d+$/);
    expect(item.quantity).toBe(1);
  });
});

describe('mockApi singleton', () => {
  it('mockApi — экземпляр MockApi', () => {
    expect(mockApi).toBeInstanceOf(MockApi);
  });
});
