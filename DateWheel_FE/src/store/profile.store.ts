import { create } from 'zustand';
import { Profile } from '../types/profile';
import { STORAGE_KEYS } from '../constants/profile';

interface ProfileState {
  currentProfile: Profile | null;
  profiles: Profile[];
  setCurrentProfile: (profile: Profile) => void;
  setProfiles: (profiles: Profile[]) => void;
  clearProfile: () => void;
  isProfileSelected: () => boolean;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  currentProfile: null,
  profiles: [],

  setCurrentProfile: (profile) => {
    localStorage.setItem(STORAGE_KEYS.OWNER, profile.name.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.OWNER_ID, profile._id);
    set({ currentProfile: profile });
  },

  setProfiles: (profiles) => set({ profiles }),

  clearProfile: () => {
    localStorage.removeItem(STORAGE_KEYS.OWNER);
    localStorage.removeItem(STORAGE_KEYS.OWNER_ID);
    set({ currentProfile: null });
  },

  isProfileSelected: () => !!get().currentProfile,
}));
