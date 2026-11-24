import { useCartStore } from '../../../features/cart-model/useCartStore';
import styles from './CartList.module.scss';

export function CartList() {
  const items = useCartStore((state) => state.items);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const clearError = useCartStore((state) => state.clearError);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className={styles['cart-list']}>
      {error && (
        <div className={styles['cart-list__error']} role="alert">
          <span>{error}</span>
          <button
            type="button"
            className={styles['cart-list__error-close']}
            onClick={clearError}
          >
            Закрыть
          </button>
        </div>
      )}
      {items.length === 0 && (
        <div className={styles['cart-list__empty']}>
          {isLoading ? 'Обновляем корзину…' : 'Корзина пуста'}
        </div>
      )}
      {items.map((item) => (
        <article key={item.productId} className={styles['cart-item']}>
          <div className={styles['cart-item__header']}>
            <h3 className={styles['cart-item__title']}>{item.title}</h3>
            <button
              type="button"
              className={styles['cart-item__remove']}
              aria-label={`Удалить ${item.title}`}
              disabled={isLoading}
              onClick={() => void removeItem(item.productId)}
            >
              ×
            </button>
          </div>
          <div className={styles['cart-item__row']}>
            <div className={styles['cart-item__quantity']}>
              <button
                type="button"
                className={styles['cart-item__quantity-button']}
                disabled={isLoading || item.quantity <= 1}
                onClick={() => void updateQuantity(item.productId, item.quantity - 1)}
              >
                −
              </button>
              <span className={styles['cart-item__quantity-value']}>{item.quantity}</span>
              <button
                type="button"
                className={styles['cart-item__quantity-button']}
                disabled={isLoading}
                onClick={() => void updateQuantity(item.productId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <span className={styles['cart-item__price']}>
              {item.price * item.quantity} ₽
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
