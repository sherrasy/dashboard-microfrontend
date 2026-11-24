import { create } from 'zustand';
import { mockApi } from '@marketplace/shared';
import type { CartItem } from '@marketplace/shared';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  addItem: (product: NewCartItem) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  checkout: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
  clearError: () => void;
}

// Данные для оптимистичного добавления: title/price приходят
// из события CART_ADD_ITEM (публикует remote-catalog).
export interface NewCartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

function totalOf(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function upsert(items: CartItem[], item: CartItem): CartItem[] {
  const rest = items.filter((current) => current.productId !== item.productId);
  return item.quantity > 0 ? [...rest, item] : rest;
}

// Локальный store remote-cart. Не покидает пределы remote (см. AGENTS.md).
// Состояние корзины в mockApi общее (singleton shared), тут — зеркало для UI.
//
// Все мутации — оптимистичные (AGENTS.md, «Надёжность → Rollback»):
// стейт обновляется до ответа mockApi, при ошибке — откат к snapshot
// и запись message в error. Промисы мутаций не отклоняются:
// ошибка уже отражена в стейте, unhandled rejection не нужен.
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  isLoading: false,
  error: null,

  addItem: async ({ productId, title, price, quantity }) => {
    const snapshot = { items: get().items, totalItems: get().totalItems };

    const existing = snapshot.items.find((item) => item.productId === productId);
    const optimistic: CartItem = existing
      ? { ...existing, quantity: existing.quantity + quantity }
      : { productId, title, price, quantity };
    const optimisticItems = upsert(snapshot.items, optimistic);
    set({ items: optimisticItems, totalItems: totalOf(optimisticItems), error: null });

    try {
      // Сервер — источник истины: синхронизируемся с его ответом
      // (вдруг quantity отличается от оптимистичного).
      const item = await mockApi.addToCart(productId, quantity);
      const items = upsert(get().items, item);
      set({ items, totalItems: totalOf(items) });
    } catch {
      set({ ...snapshot, error: 'Не удалось добавить товар' });
    }
  },

  updateQuantity: async (productId, quantity) => {
    const snapshot = { items: get().items, totalItems: get().totalItems };

    const optimisticItems = snapshot.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );
    set({ items: optimisticItems, totalItems: totalOf(optimisticItems), error: null });

    try {
      const item = await mockApi.updateCartQuantity(productId, quantity);
      const items = upsert(get().items, item);
      set({ items, totalItems: totalOf(items) });
    } catch {
      set({ ...snapshot, error: 'Не удалось обновить количество' });
    }
  },

  // mockApi не имеет removeItem: удаление — это updateCartQuantity(id, 0).
  removeItem: async (productId) => {
    const snapshot = { items: get().items, totalItems: get().totalItems };

    const optimisticItems = snapshot.items.filter((item) => item.productId !== productId);
    set({ items: optimisticItems, totalItems: totalOf(optimisticItems), error: null });

    try {
      await mockApi.updateCartQuantity(productId, 0);
    } catch {
      set({ ...snapshot, error: 'Не удалось удалить товар' });
    }
  },

  checkout: async () => {
    const snapshot = { items: get().items, totalItems: get().totalItems };

    set({ items: [], totalItems: 0, error: null });

    try {
      await mockApi.checkout();
    } catch {
      set({ ...snapshot, error: 'Не удалось оформить заказ' });
    }
  },

  setItems: (items) => set({ items, totalItems: totalOf(items) }),

  clearError: () => set({ error: null }),
}));
