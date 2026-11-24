# AGENTS.md

## Проект

Микрофронтенд-песочница для отработки изоляции, race condition и rollback.
Хост: host-shell. Ремоуты: remote-catalog, remote-cart.

## Стек

React 18, TypeScript strict, SCSS Modules, Zustand (только локально), Module Federation (Webpack 5 / Vite Federation), FSD внутри каждого приложения.

## Архитектурные правила

- Remote не импортирует код другого remote. Только через `shared` или event bus.
- Внутри remote: импорты только вниз по слоям FSD. `features` не импортирует `pages`.
- Общий `shared` импортируется только через public API (index.ts).
- Zustand store не покидает пределы remote.
- Кросс-remote события: типизированный event bus из `shared`. Формат: `{ type, payload, source }`.

## Стили

- Компоненты: SCSS Modules.
- Глобальные стили только с префиксом приложения (`.catalog-`, `.cart-`).
- CSS-переменные с префиксом remote.
- Не использовать `!important` для разрешения конфликтов.

## Запрещено без явного запроса

- Добавлять новые remote или менять `shared` в Module Federation.
- Использовать `any` в экспортируемых типах remote.
- Добавлять Redux/MobX.
- Менять публичные API `shared` без обновления всех потребителей.

## Команды

- Установка: `npm install`
- Dev host: `npm run dev:host`
- Dev remote-catalog: `npm run dev:catalog`
- Сборка: `npm run build`
- Тесты: `npm run test`

## Безопасность

- Никаких секретов (токены, ключи API) в коде ремоутов — exposed bundle виден любому потребителю. Секреты только на стороне host или прокси.
- Payload событий event bus валидируется на границе (zod/valibot или guard-функции). Remote не доверяет событиям от других remote вслепую — TypeScript-типы в рантайме не защищают.
- Данные из event bus нельзя вставлять через `dangerouslySetInnerHTML`, `eval`, `new Function`.
- Хост устанавливает CSP: `script-src` со whitelist доменов ремоутов, `unsafe-eval` запрещён.
- URL ремоутов для Module Federation не хардкодить — только через env-переменные с валидацией на старте приложения.
- `window.postMessage` (если используется в обход event bus): проверять `event.origin`.
- Зависимости: lockfile коммитим, pin версий, `npm audit` / Dependabot в CI.

## Module Federation

- `singleton: true` только для React и ReactDOM.
- Версии shared-зависимостей синхронизировать между host и remotes (semver range, не exact).
- Каждый remote экспортирует минимальную поверхность: один entry-point. Глубокие импорты (`remote-catalog/src/...`) запрещены.
- Упавший remote не роняет хост: lazy-загрузка через `React.lazy` + ErrorBoundary с fallback UI на уровне host.
- Контракты shared версионируются: breaking change = мажорная версия контракта + обновление всех потребителей.
- Fallback URL (стейджинг) для graceful degradation, если основной remote недоступен.

## Надёжность

- Все асинхронные операции (загрузка remote, события event bus) имеют явные состояния: loading / success / error.
- Race condition: асинхронные запросы отменяются через AbortController; store не обновляется результатом отменённого запроса.
- Rollback: мутации в store выполняются оптимистично со snapshot состояния до мутации и явным механизмом отката при ошибке.
- Remote обрабатывает свои ошибки локально; в event bus не уходят сырые stack trace.
- ErrorBoundary на уровне host + per-remote ErrorBoundary.

## Тестирование

- Unit: логика store, валидаторы event bus payload.
- Интеграционные: изоляция (один remote упал — остальные живы), race condition, rollback.
- Контрактные: typecheck в CI ловит breaking changes в public API `shared`; снапшоты типов контрактов event bus.
- Pre-commit: ESLint + `tsc --noEmit` + stylelint через lint-staged.
