import { create } from 'zustand';
import { Folder } from '../types/folder';

interface FolderState {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, folder: Partial<Folder>) => void;
  removeFolder: (id: string) => void;
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  setFolders: (folders) => set({ folders }),
  addFolder: (folder) => set({ folders: [...get().folders, folder] }),
  updateFolder: (id, data) =>
    set({
      folders: get().folders.map((f) => (f._id === id ? { ...f, ...data } : f)),
    }),
  removeFolder: (id) =>
    set({ folders: get().folders.filter((f) => f._id !== id) }),
}));
