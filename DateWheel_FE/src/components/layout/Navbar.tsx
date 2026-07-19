import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Target, History, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useProfileStore } from '../../store/profile.store';
import { ROUTES } from '../../constants/routes';
import { cn } from '../../lib/utils';
import ProfileAvatar from '../common/ProfileAvatar';
import logoImg from '../../assets/images/Logo.png';

const navItems = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Categories', path: ROUTES.CATEGORIES, icon: FolderOpen },
  { label: 'Wheel', path: ROUTES.WHEEL, icon: Target },
  { label: 'History', path: ROUTES.HISTORY, icon: History },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProfile, clearProfile } = useProfileStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSwitchProfile = () => {
    clearProfile();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.DASHBOARD} className="flex items-center">
            <img src={logoImg} alt="Date Wheel Logo" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Profile */}
          <div className="flex items-center gap-3">
            {currentProfile && (
              <button
                onClick={handleSwitchProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <ProfileAvatar name={currentProfile.name} size="sm" />
                <span className="text-sm font-medium hidden sm:inline">{currentProfile.name}</span>
                <LogOut size={14} className="text-muted-foreground" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border mt-2 pt-2 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
