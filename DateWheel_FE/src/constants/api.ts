export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const ENDPOINTS = {
  PROFILES: '/profiles',
  CATEGORIES: '/categories',
  FOLDERS: '/folders',
  ITEMS: '/items',
  WHEEL_SPIN: '/wheel/spin',
  HISTORIES: '/histories',
  SETTINGS: '/settings',
} as const;
