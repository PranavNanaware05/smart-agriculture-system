import { NavLink } from 'react-router-dom';
import { Bell, Cpu, Droplet, Home, Sprout, Sun, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/farmers', label: 'Farmers', icon: Users },
  { to: '/crops', label: 'Crops', icon: Sprout },
  { to: '/irrigation', label: 'Irrigation', icon: Droplet },
  { to: '/sensors', label: 'Sensor Data', icon: Cpu },
  { to: '/weather', label: 'Weather', icon: Sun },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 px-5 py-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-leaf-500 to-sky-500 text-white shadow-md shadow-leaf-500/20">
            🌱
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Smart Agri</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Operations dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-leaf-600 to-sky-600 text-white shadow-lg shadow-leaf-500/10'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900'
                }`
              }
            >
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-5 dark:border-slate-800">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.fullName}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
      </div>
    </aside>
  );
}
