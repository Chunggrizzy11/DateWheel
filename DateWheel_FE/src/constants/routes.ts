export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CATEGORIES: '/categories',
  WHEEL: '/wheel',
  HISTORY: '/history',
  SETTINGS: '/settings',
} as const;

export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Categories', path: ROUTES.CATEGORIES, icon: 'FolderOpen' },
  { label: 'Wheel', path: ROUTES.WHEEL, icon: 'Target' },
  { label: 'History', path: ROUTES.HISTORY, icon: 'History' },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings' },
] as const;
