import { create } from 'zustand';
import { SpinHistory } from '../types/history';

interface HistoryState {
  histories: SpinHistory[];
  setHistories: (histories: SpinHistory[]) => void;
  addHistory: (history: SpinHistory) => void;
  removeHistory: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  histories: [],
  setHistories: (histories) => set({ histories }),
  addHistory: (history) => set({ histories: [history, ...get().histories] }),
  removeHistory: (id) =>
    set({ histories: get().histories.filter((h) => h._id !== id) }),
}));
