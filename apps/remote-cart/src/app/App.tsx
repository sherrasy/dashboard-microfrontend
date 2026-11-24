// React.lazy требует default-экспорта из exposed-модуля.
// Пробник изоляции: при корректном singleton id совпадёт с host-shell.
import { CartPage } from '../pages/cart-page/ui/CartPage';

export default function App() {
  return <CartPage />;
}
