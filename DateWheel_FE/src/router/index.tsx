import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import BlankLayout from '../layouts/BlankLayout';
import PrivateRoute from './PrivateRoute';
import { ROUTES } from '../constants/routes';

// Pages
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Categories from '../pages/Categories';
import Wheel from '../pages/Wheel';
import History from '../pages/History';
import Settings from '../pages/Settings';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Route (Profile Selection) */}
      <Route element={<BlankLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.CATEGORIES} element={<Categories />} />
          <Route path={ROUTES.WHEEL} element={<Wheel />} />
          <Route path={ROUTES.HISTORY} element={<History />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
