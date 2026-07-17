import { useState, useCallback } from 'react';
import { settingApi } from '../api/setting.api';
import { useSettingStore } from '../store/setting.store';
import { UpdateSettingsDto } from '../types/setting';
import { toast } from 'sonner';

export function useSetting(owner?: string) {
  const store = useSettingStore();
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!owner) return;
    setLoading(true);
    try {
      const res = await settingApi.get(owner);
      store.setSettings(res.data);
    } catch {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, [owner]);

  const updateSettings = async (data: Partial<UpdateSettingsDto>) => {
    if (!owner) return;
    try {
      const res = await settingApi.update({ owner, ...data });
      store.setSettings(res.data);
      toast.success('Settings updated!');
    } catch {
      toast.error('Failed to update settings');
    }
  };

  return { loading, fetchSettings, updateSettings, ...store };
}
