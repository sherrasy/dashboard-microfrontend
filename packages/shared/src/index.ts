// Public API пакета @marketplace/shared.
// Экспортируйте сюда только то, что разрешено для кросс-app использования
// (см. AGENTS.md: event bus, типы событий, UI-kit и т.д.).

// --- Временный пробник изоляции (проверка Module Federation) ---------------
// Если shared работает как singleton, модуль выполнится ровно один раз
// на странице хоста: номер инициализации будет #1, а id одинаковый
// у host-shell, remote-catalog и remote-cart. После проверки блок удалить.
const isolationProbe = globalThis as typeof globalThis & {
  __marketplaceSharedInitCount?: number;
};

isolationProbe.__marketplaceSharedInitCount = (isolationProbe.__marketplaceSharedInitCount ?? 0) + 1;

export const sharedInstanceId: number = Math.random();

console.log(
  `[marketplace/shared] init #${isolationProbe.__marketplaceSharedInitCount}, id=${sharedInstanceId}`,
);
// --- конец пробника ---------------------------------------------------------
