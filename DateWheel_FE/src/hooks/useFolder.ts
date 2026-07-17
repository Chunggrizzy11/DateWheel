import { useState, useCallback } from 'react';
import { folderApi } from '../api/folder.api';
import { useFolderStore } from '../store/folder.store';
import { CreateFolderDto, UpdateFolderDto } from '../types/folder';
import { toast } from 'sonner';

export function useFolder(owner?: string) {
  const { folders, setFolders, addFolder, updateFolder, removeFolder } = useFolderStore();
  const [loading, setLoading] = useState(false);

  const fetchFolders = useCallback(async () => {
    if (!owner) return;
    setLoading(true);
    try {
      const res = await folderApi.getAll(owner);
      setFolders(res.data);
    } catch {
      toast.error('Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, [owner]);

  const createFolder = async (data: CreateFolderDto) => {
    try {
      const res = await folderApi.create(data);
      addFolder(res.data);
      toast.success('Folder created!');
      return res.data;
    } catch {
      toast.error('Failed to create folder');
    }
  };

  const editFolder = async (id: string, data: UpdateFolderDto) => {
    try {
      const res = await folderApi.update(id, data);
      updateFolder(id, res.data);
      toast.success('Folder updated!');
      return res.data;
    } catch {
      toast.error('Failed to update folder');
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await folderApi.delete(id);
      removeFolder(id);
      toast.success('Folder deleted!');
    } catch {
      toast.error('Failed to delete folder');
    }
  };

  return { folders, loading, fetchFolders, createFolder, editFolder, deleteFolder };
}
