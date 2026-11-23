import type {
  CartItem,
  GetProductsParams,
  MockApiMethodName,
  Product,
  ProductsPage,
} from './types';

const PRODUCTS: Product[] = [
  // Зерно
  { id: 'bean-001', title: 'Эфиопия Иргачефф, зерно 250 г', price: 1450, category: 'Зерно', imageUrl: '/images/products/bean-001.jpg' },
  { id: 'bean-002', title: 'Кения АА, зерно 250 г', price: 1600, category: 'Зерно', imageUrl: '/images/products/bean-002.jpg' },
  { id: 'bean-003', title: 'Колумбия Супремо, зерно 250 г', price: 1250, category: 'Зерно', imageUrl: '/images/products/bean-003.jpg' },
  { id: 'bean-004', title: 'Бразилия Сантос, зерно 1 кг', price: 2400, category: 'Зерно', imageUrl: '/images/products/bean-004.jpg' },
  { id: 'bean-005', title: 'Гватемала Антигуа, зерно 250 г', price: 1500, category: 'Зерно', imageUrl: '/images/products/bean-005.jpg' },
  { id: 'bean-006', title: 'Коста-Рика Тарразу, зерно 250 г', price: 1700, category: 'Зерно', imageUrl: '/images/products/bean-006.jpg' },
  { id: 'bean-007', title: 'Руанда Киву, зерно 250 г', price: 1800, category: 'Зерно', imageUrl: '/images/products/bean-007.jpg' },
  { id: 'bean-008', title: 'Индия Мысок, зерно 250 г', price: 950, category: 'Зерно', imageUrl: '/images/products/bean-008.jpg' },
  { id: 'bean-009', title: 'Суматра Мандхелинг, зерно 250 г', price: 1550, category: 'Зерно', imageUrl: '/images/products/bean-009.jpg' },
  { id: 'bean-010', title: 'Перу Амазонас, зерно 250 г', price: 1150, category: 'Зерно', imageUrl: '/images/products/bean-010.jpg' },
  { id: 'bean-011', title: 'Гондурас Маркапа, зерно 250 г', price: 1300, category: 'Зерно', imageUrl: '/images/products/bean-011.jpg' },
  { id: 'bean-012', title: 'Колумбия Декаф, зерно 250 г', price: 1100, category: 'Зерно', imageUrl: '/images/products/bean-012.jpg' },
  // Дрип-пакеты
  { id: 'drip-001', title: 'Дрип-пакет Эфиопия, 10 шт', price: 890, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-001.jpg' },
  { id: 'drip-002', title: 'Дрип-пакет Кения, 10 шт', price: 940, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-002.jpg' },
  { id: 'drip-003', title: 'Дрип-пакет Колумбия, 10 шт', price: 820, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-003.jpg' },
  { id: 'drip-004', title: 'Дрип-пакет Бразилия, 10 шт', price: 740, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-004.jpg' },
  { id: 'drip-005', title: 'Дрип-пакет Гватемала, 10 шт', price: 900, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-005.jpg' },
  { id: 'drip-006', title: 'Дрип-пакет Коста-Рика, 10 шт', price: 980, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-006.jpg' },
  { id: 'drip-007', title: 'Дрип-пакет Руанда, 10 шт', price: 1050, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-007.jpg' },
  { id: 'drip-008', title: 'Дрип-пакет Индия, 10 шт', price: 700, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-008.jpg' },
  { id: 'drip-009', title: 'Дрип-пакет Суматра, 10 шт', price: 930, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-009.jpg' },
  { id: 'drip-010', title: 'Набор дрип-пакетов «Микс», 20 шт', price: 1750, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-010.jpg' },
  { id: 'drip-011', title: 'Набор дрип-пакетов «Дегустация», 5 шт', price: 520, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-011.jpg' },
  { id: 'drip-012', title: 'Дрип-пакет Декаф, 10 шт', price: 780, category: 'Дрип-пакеты', imageUrl: '/images/products/drip-012.jpg' },
  // Аксессуары
  { id: 'acc-001', title: 'Воронка V60, пластик 02', price: 800, category: 'Аксессуары', imageUrl: '/images/products/acc-001.jpg' },
  { id: 'acc-002', title: 'Воронка V60, керамика 02', price: 2400, category: 'Аксессуары', imageUrl: '/images/products/acc-002.jpg' },
  { id: 'acc-003', title: 'Кемекс, 6 чашек', price: 3900, category: 'Аксессуары', imageUrl: '/images/products/acc-003.jpg' },
  { id: 'acc-004', title: 'Аэропресс Go', price: 4500, category: 'Аксессуары', imageUrl: '/images/products/acc-004.jpg' },
  { id: 'acc-005', title: 'Френч-пресс, 350 мл', price: 1200, category: 'Аксессуары', imageUrl: '/images/products/acc-005.jpg' },
  { id: 'acc-006', title: 'Ручная кофемолка с керамическими жерновами', price: 2800, category: 'Аксессуары', imageUrl: '/images/products/acc-006.jpg' },
  { id: 'acc-007', title: 'Весы бариста с таймером', price: 3200, category: 'Аксессуары', imageUrl: '/images/products/acc-007.jpg' },
  { id: 'acc-008', title: 'Чайник с тонким носиком, 600 мл', price: 2600, category: 'Аксессуары', imageUrl: '/images/products/acc-008.jpg' },
  { id: 'acc-009', title: 'Бумажные фильтры V60, 100 шт', price: 450, category: 'Аксессуары', imageUrl: '/images/products/acc-009.jpg' },
  { id: 'acc-010', title: 'Термокружка, 500 мл', price: 1500, category: 'Аксессуары', imageUrl: '/images/products/acc-010.jpg' },
  { id: 'acc-011', title: 'Вакуумное хранилище для зерна, 1 л', price: 1800, category: 'Аксессуары', imageUrl: '/images/products/acc-011.jpg' },
  { id: 'acc-012', title: 'Подарочный набор бариста', price: 5500, category: 'Аксессуары', imageUrl: '/images/products/acc-012.jpg' },
];

function createAbortError(): DOMException {
  return new DOMException('Aborted', 'AbortError');
}

export class MockApi {
  private delayMs = 500;
  private readonly errorMethods = new Set<MockApiMethodName>();
  private readonly cart = new Map<string, CartItem>();
  private orderCounter = 0;

  setDelay(ms: number): void {
    this.delayMs = ms;
  }

  enableErrorMode(methodName: MockApiMethodName): void {
    this.errorMethods.add(methodName);
  }

  disableErrorMode(methodName: MockApiMethodName): void {
    this.errorMethods.delete(methodName);
  }

  getProducts(params: GetProductsParams, signal?: AbortSignal): Promise<ProductsPage> {
    return this.execute(
      'getProducts',
      signal,
      (): ProductsPage => {
        let items = PRODUCTS;
        if (params.category) {
          items = items.filter((product) => product.category === params.category);
        }
        if (params.search) {
          const query = params.search.toLowerCase();
          items = items.filter(
            (product) =>
              product.title.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query),
          );
        }
        const start = (params.page - 1) * params.limit;
        return { items: items.slice(start, start + params.limit), total: items.length };
      },
    );
  }

  getProductById(id: string): Promise<Product> {
    return this.execute('getProductById', undefined, () => {
      const product = PRODUCTS.find((item) => item.id === id);
      if (!product) {
        throw new Error(`Product not found: ${id}`);
      }
      return product;
    });
  }

  addToCart(productId: string, quantity: number): Promise<CartItem> {
    return this.execute('addToCart', undefined, () => {
      const product = this.requireProduct(productId);
      const existing = this.cart.get(productId);
      const item: CartItem = existing
        ? { ...existing, quantity: existing.quantity + quantity }
        : { productId, title: product.title, price: product.price, quantity };
      this.cart.set(productId, item);
      return item;
    });
  }

  updateCartQuantity(productId: string, quantity: number): Promise<CartItem> {
    return this.execute('updateCartQuantity', undefined, () => {
      const existing = this.cart.get(productId);
      const item: CartItem = existing
        ? { ...existing, quantity }
        : (() => {
            const product = this.requireProduct(productId);
            return { productId, title: product.title, price: product.price, quantity };
          })();
      this.cart.set(productId, item);
      return item;
    });
  }

  checkout(): Promise<{ orderId: string }> {
    return this.execute('checkout', undefined, () => {
      this.orderCounter += 1;
      const orderId = `order-${this.orderCounter}`;
      this.cart.clear();
      return { orderId };
    });
  }

  private requireProduct(productId: string): Product {
    const product = PRODUCTS.find((item) => item.id === productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }
    return product;
  }

  private execute<T>(
    methodName: MockApiMethodName,
    signal: AbortSignal | undefined,
    run: () => T,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }
      const timer = setTimeout(() => {
        if (signal?.aborted) {
          reject(createAbortError());
          return;
        }
        if (this.errorMethods.has(methodName)) {
          reject(new Error(`API Error: ${methodName}`));
          return;
        }
        try {
          resolve(run());
        } catch (error) {
          reject(error);
        }
      }, this.delayMs);
      signal?.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(createAbortError());
        },
        { once: true },
      );
    });
  }
}

// Singleton для приложения. Через Module Federation shared-модуль
// @marketplace/shared исполняется один раз на странице, поэтому корзина
// внутри mockApi общая для host-shell, remote-catalog и remote-cart.
export const mockApi = new MockApi();
