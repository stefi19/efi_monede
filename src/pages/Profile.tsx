import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Bell, HelpCircle, LogOut, Star, Smartphone } from 'lucide-react';
import { useStore } from '../store/useStore';

const userGradients: Record<string, string> = {
  stefi: 'from-[#7c6af7] to-[#a78bfa]',
  mara: 'from-[#ec4899] to-[#f9a8d4]',
  adriana: 'from-[#22c55e] to-[#86efac]',
};

export default function Profile() {
  const navigate = useNavigate();
  const { getCurrentUser, logout } = useStore();
  const user = getCurrentUser();

  if (!user) return null;

  const menuItems = [
    { icon: Shield, label: 'Security & Privacy', sub: '2FA active', color: 'text-green-400' },
    { icon: Bell, label: 'Notifications', sub: 'All alerts active', color: 'text-blue-400' },
    { icon: Star, label: 'Premium Plan', sub: 'Efi Gold Member', color: 'text-yellow-400' },
    { icon: Smartphone, label: 'Connected devices', sub: '1 device', color: 'text-purple-400' },
    { icon: HelpCircle, label: 'Help & Support', sub: 'FAQ & contact', color: 'text-gray-400' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-24">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-xl font-bold text-white">Profile</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center px-5 mb-8">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${userGradients[user.id]} flex items-center justify-center text-3xl font-bold mb-3 shadow-lg`}>
          {user.avatar}
        </div>
        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.username} · Efi ID: #{user.id}</p>
        <div className="flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-500/10 rounded-full">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-yellow-400 font-medium">Efi Gold Member</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">{user.transactions.length}</p>
            <p className="text-xs text-gray-500">Transactions</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">Ɛ{user.balance.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Balance</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">💜</p>
            <p className="text-xs text-gray-500">Efi Member</p>
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="px-5 mb-6">
        <div className="revolut-gradient rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
          <p className="text-sm font-semibold text-white mb-1">Invite friends, earn EFI</p>
          <p className="text-xs text-white/70 mb-3">Get Ɛ50 for every friend you invite</p>
          <button className="px-4 py-2 bg-white/20 rounded-xl text-xs font-semibold text-white">
            Share your link
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mb-4">
        <div className="glass rounded-2xl overflow-hidden">
          {menuItems.map(({ icon: Icon, label, sub, color }) => (
            <button key={label} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
              <div className={`w-9 h-9 rounded-xl glass flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{label}</p>
                {sub && <p className="text-xs text-gray-500">{sub}</p>}
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 glass rounded-2xl hover:bg-red-500/10 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
            <LogOut size={18} />
          </div>
          <span className="text-sm font-medium text-red-400">Sign out</span>
        </button>
      </div>

      <p className="text-center text-xs text-gray-700 mt-8">Efi Monede v1.0.0 · Made with 💜</p>
    </div>
  );
}
