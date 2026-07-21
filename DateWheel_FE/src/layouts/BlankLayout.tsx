import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function BlankLayout() {
  return (
    <div className="min-h-screen mesh-bg">
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
