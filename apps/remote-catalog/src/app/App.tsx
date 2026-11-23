import { CatalogPage } from '../pages/catalog-page/ui/CatalogPage';

// React.lazy требует default-экспорта из exposed-модуля.
// Пробник изоляции: при корректном singleton id совпадёт с host-shell.
export default function App() {
  return <CatalogPage />;
}
