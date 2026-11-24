import { isCartAddItemEvent, useEventBus } from '@marketplace/shared';
import { Checkout } from '../../../features/cart-checkout/ui/Checkout';
import { ErrorModeToggle } from '../../../features/cart-error-toggle/ui/ErrorModeToggle';
import { useCartStore } from '../../../features/cart-model/useCartStore';
import { CartList } from '../../../widgets/cart-list/ui/CartList';
import styles from './CartPage.module.scss';

export function CartPage() {
  const addItem = useCartStore((state) => state.addItem);

  // Событие от remote-catalog: положить товар в корзину (оптимистично).
  // Payload валидируется на границе: remote не доверяет событиям вслепую.
  useEventBus('CART_ADD_ITEM', (event) => {
    if (!isCartAddItemEvent(event)) {
      console.warn('[remote-cart] Событие CART_ADD_ITEM с невалидным payload проигнорировано.');
      return;
    }
    void addItem(event.payload);
  });

  return (
    <section className={styles['cart-page']}>
      <h2 className={styles['cart-page__title']}>Корзина</h2>
      <ErrorModeToggle />
      <CartList />
      <Checkout />
    </section>
  );
}
