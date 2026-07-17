import { create } from 'zustand';
import { Category } from '../types/category';
import { SpinMode } from '../types/wheel';

interface WheelState {
  selectedCategories: Category[];
  excludedCategories: string[];
  mode: SpinMode;
  isSpinning: boolean;
  winner: Category | null;

  setSelectedCategories: (categories: Category[]) => void;
  toggleCategory: (category: Category) => void;
  setMode: (mode: SpinMode) => void;
  setSpinning: (spinning: boolean) => void;
  setWinner: (winner: Category | null) => void;
  addExcluded: (categoryId: string) => void;
  clearExcluded: () => void;
  reset: () => void;
}

export const useWheelStore = create<WheelState>((set, get) => ({
  selectedCategories: [],
  excludedCategories: [],
  mode: 'random',
  isSpinning: false,
  winner: null,

  setSelectedCategories: (categories) => set({ selectedCategories: categories }),

  toggleCategory: (category) => {
    const current = get().selectedCategories;
    const exists = current.find((i) => i._id === category._id);
    if (exists) {
      set({ selectedCategories: current.filter((i) => i._id !== category._id) });
    } else {
      set({ selectedCategories: [...current, category] });
    }
  },

  setMode: (mode) => set({ mode }),
  setSpinning: (isSpinning) => set({ isSpinning }),
  setWinner: (winner) => set({ winner }),
  addExcluded: (categoryId) => set({ excludedCategories: [...get().excludedCategories, categoryId] }),
  clearExcluded: () => set({ excludedCategories: [] }),

  reset: () =>
    set({
      selectedCategories: [],
      excludedCategories: [],
      mode: 'random',
      isSpinning: false,
      winner: null,
    }),
}));
