// React.lazy требует default-экспорта из exposed-модуля.
// Пробник изоляции: при корректном singleton id совпадёт с host-shell.
export default function App() {
  return (
    <section>
      <h1>remote-catalog</h1>
    </section>
  );
}
