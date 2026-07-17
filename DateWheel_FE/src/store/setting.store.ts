import { create } from 'zustand';
import { Settings } from '../types/setting';

interface SettingState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  toggleAnimation: () => void;
  setLanguage: (lang: 'vi' | 'en') => void;
}

export const useSettingStore = create<SettingState>((set, get) => ({
  settings: null,

  setSettings: (settings) => {
    set({ settings });
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleDarkMode: () => {
    const current = get().settings;
    if (current) {
      const updated = { ...current, darkMode: !current.darkMode };
      set({ settings: updated });
      document.documentElement.classList.toggle('dark');
    }
  },

  toggleSound: () => {
    const current = get().settings;
    if (current) set({ settings: { ...current, sound: !current.sound } });
  },

  toggleAnimation: () => {
    const current = get().settings;
    if (current) set({ settings: { ...current, animation: !current.animation } });
  },

  setLanguage: (language) => {
    const current = get().settings;
    if (current) set({ settings: { ...current, language } });
  },
}));
