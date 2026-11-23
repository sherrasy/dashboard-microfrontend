import { ProductCard } from '../../../entities/product/ui/ProductCard';
import { useCatalogStore } from '../../../features/product-filters/model/useCatalogStore';
import { PAGE_SIZE, useCatalogData } from '../model/useCatalogData';
import styles from './CatalogList.module.scss';

const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'];

interface CatalogListProps {
  onTotalPagesChange: (totalPages: number) => void;
}

export function CatalogList({ onTotalPagesChange }: CatalogListProps) {
  const category = useCatalogStore((state) => state.category);
  const search = useCatalogStore((state) => state.search);
  const page = useCatalogStore((state) => state.page);

  const { data, isLoading, error, retry } = useCatalogData(
    { category, search, page },
    (total) => onTotalPagesChange(Math.max(1, Math.ceil(total / PAGE_SIZE))),
  );

  if (isLoading) {
    return (
      <div className={styles['catalog-list']} aria-busy="true">
        {SKELETON_KEYS.map((key) => (
          <div key={key} className={styles['catalog-list__skeleton']}>
            <div className={styles['catalog-list__skeleton-image']} />
            <div className={styles['catalog-list__skeleton-body']}>
              <div className={styles['catalog-list__skeleton-line']} />
              <div
                className={`${styles['catalog-list__skeleton-line']} ${styles['catalog-list__skeleton-line_short']}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['catalog-list__error']}>
        <p className={styles['catalog-list__error-text']}>Не удалось загрузить товары</p>
        <button type="button" className={styles['catalog-list__retry']} onClick={retry}>
          Повторить
        </button>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className={styles['catalog-list__empty']}>
        Ничего не найдено. Попробуйте изменить фильтры или поисковый запрос.
      </div>
    );
  }

  return (
    <div className={styles['catalog-list']}>
      {data.items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
