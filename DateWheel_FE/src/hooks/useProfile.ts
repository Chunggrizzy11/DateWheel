import { useEffect, useState } from 'react';
import { useProfileStore } from '../store/profile.store';
import { profileApi } from '../api/profile.api';
import { Profile } from '../types/profile';
import { STORAGE_KEYS } from '../constants/profile';

export function useProfile() {
  const { currentProfile, profiles, setCurrentProfile, setProfiles, clearProfile } =
    useProfileStore();
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await profileApi.getAll();
      setProfiles(res.data);

      // Restore profile from localStorage
      const savedOwner = localStorage.getItem(STORAGE_KEYS.OWNER);
      if (savedOwner && !currentProfile) {
        const found = res.data.find(
          (p: Profile) => p.name.toLowerCase() === savedOwner
        );
        if (found) setCurrentProfile(found);
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { currentProfile, profiles, loading, setCurrentProfile, clearProfile, fetchProfiles };
}
