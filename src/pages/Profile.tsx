import { ChevronRight, Shield, Bell, HelpCircle, LogOut, Star, Smartphone } from 'lucide-react';

const menuItems = [
  { icon: Shield, label: 'Security & Privacy', sub: '2FA enabled', color: 'text-green-400' },
  { icon: Bell, label: 'Notifications', sub: 'All alerts on', color: 'text-blue-400' },
  { icon: Star, label: 'Premium Plan', sub: 'Efi Gold Member', color: 'text-yellow-400' },
  { icon: Smartphone, label: 'Connected Devices', sub: '2 devices', color: 'text-purple-400' },
  { icon: HelpCircle, label: 'Help & Support', sub: 'FAQ & contact', color: 'text-gray-400' },
  { icon: LogOut, label: 'Log Out', sub: '', color: 'text-red-400' },
];

export default function Profile() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-24">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-xl font-bold text-white">Profile</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center px-5 mb-8">
        <div className="w-20 h-20 rounded-full revolut-gradient flex items-center justify-center text-3xl font-bold mb-3 shadow-lg">
          E
        </div>
        <h2 className="text-lg font-bold text-white">Efi User</h2>
        <p className="text-sm text-gray-500">@efiuser · Efi ID: #00042</p>
        <div className="flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-500/10 rounded-full">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-yellow-400 font-medium">Efi Gold Member</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">42</p>
            <p className="text-xs text-gray-500">Transactions</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">6</p>
            <p className="text-xs text-gray-500">Contacts</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">3mo</p>
            <p className="text-xs text-gray-500">Member</p>
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="px-5 mb-6">
        <div className="revolut-gradient rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
          <p className="text-sm font-semibold text-white mb-1">Invite Friends, Earn EFI</p>
          <p className="text-xs text-white/70 mb-3">Get Ɛ50 for each friend you invite</p>
          <button className="px-4 py-2 bg-white/20 rounded-xl text-xs font-semibold text-white">
            Share Invite Link
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5">
        <div className="glass rounded-2xl overflow-hidden">
          {menuItems.map(({ icon: Icon, label, sub, color }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
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

      <p className="text-center text-xs text-gray-700 mt-8">Efi Monede v1.0.0 · Made with 💜</p>
    </div>
  );
}
