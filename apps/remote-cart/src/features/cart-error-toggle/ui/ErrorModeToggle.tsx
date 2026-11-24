import { useState } from 'react';
import { mockApi } from '@marketplace/shared';
import styles from './ErrorModeToggle.module.scss';

// Тестовый переключатель для отработки Rollback (шаг 8):
// включает в mockApi режим ошибок для addToCart. mockApi — общий
// singleton из @marketplace/shared, поэтому ошибку получат и события
// «В корзину» из remote-catalog.
export function ErrorModeToggle() {
  const [enabled, setEnabled] = useState(false);

  const handleChange = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      mockApi.enableErrorMode('addToCart');
    } else {
      mockApi.disableErrorMode('addToCart');
    }
  };

  return (
    <label className={styles['cart-error-toggle']}>
      <input
        type="checkbox"
        className={styles['cart-error-toggle__input']}
        checked={enabled}
        onChange={handleChange}
      />
      Имитировать сбой API при добавлении
    </label>
  );
}
