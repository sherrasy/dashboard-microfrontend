import { create } from 'zustand';

export const CATEGORIES = ['Зерно', 'Дрип-пакеты', 'Аксессуары'] as const;

export interface CatalogState {
  category: string;
  search: string;
  page: number;
  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
}

// Локальный store remote-catalog. Не покидает пределы remote (см. AGENTS.md).
export const useCatalogStore = create<CatalogState>((set) => ({
  category: '',
  search: '',
  page: 1,
  setCategory: (category) => set({ category, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
}));
