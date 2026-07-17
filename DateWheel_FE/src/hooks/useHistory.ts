import { useState, useCallback } from 'react';
import { historyApi } from '../api/history.api';
import { useHistoryStore } from '../store/history.store';
import { toast } from 'sonner';

export function useHistory(owner?: string) {
  const { histories, setHistories, removeHistory } = useHistoryStore();
  const [loading, setLoading] = useState(false);

  const fetchHistories = useCallback(async () => {
    if (!owner) return;
    setLoading(true);
    try {
      const res = await historyApi.getAll(owner);
      setHistories(res.data);
    } catch {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, [owner]);

  const deleteHistory = async (id: string) => {
    try {
      await historyApi.delete(id);
      removeHistory(id);
      toast.success('History entry deleted!');
    } catch {
      toast.error('Failed to delete history');
    }
  };

  return { histories, loading, fetchHistories, deleteHistory };
}
