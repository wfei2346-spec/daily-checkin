import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { ClipboardCheck, Settings, BarChart3 } from 'lucide-react';
import { getToday, formatDateCN } from '../../utils/date';

const tabs = [
  { to: '/', icon: ClipboardCheck, label: '打卡' },
  { to: '/stats', icon: BarChart3, label: '统计' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-5 pt-safe">
        <div className="flex items-center justify-between h-14 max-w-lg mx-auto">
          <div>
            <h1 className="text-lg font-bold text-gray-900">每日打卡</h1>
            <p className="text-xs text-gray-400">{formatDateCN(getToday())}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full px-4 pt-4">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto h-16">
          {tabs.map(({ to, icon: Icon, label }) => {
            const active = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 min-w-[64px] py-1 px-3 rounded-xl transition-colors ${
                  active ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
