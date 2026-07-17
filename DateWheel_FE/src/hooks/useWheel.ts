import { useCallback } from 'react';
import { wheelApi } from '../api/wheel.api';
import { useWheelStore } from '../store/wheel.store';
import { toast } from 'sonner';

export function useWheel() {
  const store = useWheelStore();

  const spin = useCallback(async (profileId: string) => {
    if (store.selectedCategories.length < 2) {
      toast.error('Please select at least 2 categories!');
      return;
    }

    store.setSpinning(true);
    try {
      const categoryIds = store.selectedCategories
        .filter((i) => !store.excludedCategories.includes(i._id))
        .map((i) => i._id);

      const res = await wheelApi.spin({
        owner: profileId,
        mode: store.mode,
        categoryIds,
      });

      // Delay for animation
      return res.data;
    } catch {
      toast.error('Spin failed!');
      store.setSpinning(false);
    }
  }, [store.selectedCategories, store.excludedCategories, store.mode]);

  return { ...store, spin };
}
