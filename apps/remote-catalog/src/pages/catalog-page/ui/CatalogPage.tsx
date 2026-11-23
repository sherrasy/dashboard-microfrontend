import { useCallback, useState } from 'react';
import { ProductFilters } from '../../../features/product-filters/ui/ProductFilters';
import { Pagination } from '../../../features/product-pagination/ui/Pagination';
import { CatalogList } from '../../../widgets/catalog-list/ui/CatalogList';
import styles from './CatalogPage.module.scss';

export function CatalogPage() {
  const [totalPages, setTotalPages] = useState(1);

  // Стабильная ссылка, чтобы не перезапускать запрос в CatalogList.
  const handleTotalPagesChange = useCallback((next: number) => {
    setTotalPages(next);
  }, []);

  return (
    <section className={styles['catalog-page']}>
      <h2 className={styles['catalog-page__title']}>Каталог</h2>
      <ProductFilters />
      <CatalogList onTotalPagesChange={handleTotalPagesChange} />
      <Pagination totalPages={totalPages} />
    </section>
  );
}
