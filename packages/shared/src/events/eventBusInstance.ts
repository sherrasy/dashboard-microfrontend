import { createEventBus } from './eventBus';

// Singleton-шина приложения. Живёт в единственном экземпляре на странице,
// потому что @marketplace/shared — shared-модуль Module Federation.
// Отдельный модуль, чтобы хуки могли импортировать шину без циклического
// импорта через public API (index.ts).
export const eventBus = createEventBus();
