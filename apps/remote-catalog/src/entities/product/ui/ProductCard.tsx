import type { Product } from '@marketplace/shared';
import { useEventPublisher } from '@marketplace/shared';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const publish = useEventPublisher();

  const handleAddToCart = () => {
    publish({
      type: 'CART_ADD_ITEM',
      payload: { productId: product.id, title: product.title, price: product.price, quantity: 1 },
      source: 'remote-catalog',
    });
  };

  return (
    <article className={styles['catalog-card']}>
      <div className={styles['catalog-card__image']}>
        <span aria-hidden>☕</span>
        <span className={styles['catalog-card__image-label']}>{product.category}</span>
      </div>
      <div className={styles['catalog-card__body']}>
        <h3 className={styles['catalog-card__title']}>{product.title}</h3>
        <div className={styles['catalog-card__footer']}>
          <span className={styles['catalog-card__price']}>{product.price} ₽</span>
          <button
            type="button"
            className={styles['catalog-card__button']}
            onClick={handleAddToCart}
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}
