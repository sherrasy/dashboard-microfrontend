import type { Product } from '@marketplace/shared';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
}

// Кнопка «В корзину» пока только логирует: реальный eventBus — шаг 6.
export function ProductCard({ product }: ProductCardProps) {
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
            onClick={() => console.log('Добавить в корзину', product.id)}
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}
