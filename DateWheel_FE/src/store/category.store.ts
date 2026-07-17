import { create } from 'zustand';
import { Category } from '../types/category';

interface CategoryState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  removeCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (category) => set({ categories: [...get().categories, category] }),
  updateCategory: (id, data) =>
    set({
      categories: get().categories.map((c) => (c._id === id ? { ...c, ...data } : c)),
    }),
  removeCategory: (id) =>
    set({ categories: get().categories.filter((c) => c._id !== id) }),
}));
