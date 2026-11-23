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
