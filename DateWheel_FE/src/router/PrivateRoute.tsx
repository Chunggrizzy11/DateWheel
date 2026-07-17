import { Navigate, Outlet } from 'react-router-dom';
import { useProfileStore } from '../store/profile.store';
import { ROUTES } from '../constants/routes';

export default function PrivateRoute() {
  const { isProfileSelected } = useProfileStore();

  if (!isProfileSelected()) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
