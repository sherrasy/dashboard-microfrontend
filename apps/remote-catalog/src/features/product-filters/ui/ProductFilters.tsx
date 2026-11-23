import { useEffect, useState } from 'react';
import { CATEGORIES, useCatalogStore } from '../model/useCatalogStore';
import styles from './ProductFilters.module.scss';

const SEARCH_DEBOUNCE_MS = 300;

export function ProductFilters() {
  const category = useCatalogStore((state) => state.category);
  const search = useCatalogStore((state) => state.search);
  const setCategory = useCatalogStore((state) => state.setCategory);
  const setSearch = useCatalogStore((state) => state.setSearch);

  // Локальный input, в store значение уходит с дебаунсом 300 мс.
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, search, setSearch]);

  return (
    <div className={styles['catalog-filters']}>
      <div className={styles['catalog-filters__categories']}>
        <button
          type="button"
          className={`${styles['catalog-filters__category']}${
            category === '' ? ` ${styles['catalog-filters__category_active']}` : ''
          }`}
          onClick={() => setCategory('')}
        >
          Все
        </button>
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            className={`${styles['catalog-filters__category']}${
              category === item ? ` ${styles['catalog-filters__category_active']}` : ''
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <input
        type="search"
        className={styles['catalog-filters__search']}
        placeholder="Поиск по названию"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
      />
    </div>
  );
}
