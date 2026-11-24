import { useCartStore } from '../../cart-model/useCartStore';
import styles from './Checkout.module.scss';

export function Checkout() {
  const items = useCartStore((state) => state.items);
  const isLoading = useCartStore((state) => state.isLoading);
  const checkout = useCartStore((state) => state.checkout);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles['cart-checkout']}>
      <p className={styles['cart-checkout__total']}>Итого: {totalPrice} ₽</p>
      <button
        type="button"
        className={styles['cart-checkout__button']}
        disabled={items.length === 0 || isLoading}
        onClick={() => void checkout()}
      >
        {isLoading ? 'Оформляем…' : 'Оформить заказ'}
      </button>
    </div>
  );
}
