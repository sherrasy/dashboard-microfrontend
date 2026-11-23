import { useCatalogStore } from '../../product-filters/model/useCatalogStore';
import styles from './Pagination.module.scss';

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const page = useCatalogStore((state) => state.page);
  const setPage = useCatalogStore((state) => state.setPage);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles['catalog-pagination']}>
      <button
        type="button"
        className={styles['catalog-pagination__button']}
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Назад
      </button>
      <span className={styles['catalog-pagination__page']}>
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className={styles['catalog-pagination__button']}
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Вперёд
      </button>
    </div>
  );
}
