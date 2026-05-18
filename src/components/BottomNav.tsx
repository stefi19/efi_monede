import { NavLink } from 'react-router-dom';
import { Home, ArrowLeftRight, CreditCard, BarChart2, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/exchange', icon: ArrowLeftRight, label: 'Exchange' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="bg-[#111111] border-t border-white/10 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#7c6af7]'
                    : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
