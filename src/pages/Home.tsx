import { useState, useEffect } from 'react';
import { Eye, EyeOff, Bell, Send, Plus, ArrowLeftRight, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import TransactionItem from '../components/TransactionItem';
import { requestNotificationPermission } from '../utils/notify';

const quickActions = [
  { label: 'Send', icon: Send, color: 'bg-[#7c6af7]', to: '/send' },
  { label: 'Add', icon: Plus, color: 'bg-[#22c55e]', to: '/topup' },
  { label: 'Exchange', icon: ArrowLeftRight, color: 'bg-[#f59e0b]', to: '/exchange' },
  { label: 'Request', icon: Zap, color: 'bg-[#ec4899]', to: '/request' },
];

const userGradients: Record<string, string> = {
  stefi: 'from-[#7c6af7] to-[#a78bfa]',
  mara: 'from-[#ec4899] to-[#f9a8d4]',
  adriana: 'from-[#22c55e] to-[#86efac]',
};

export default function Home() {
  const navigate = useNavigate();
  const balanceVisible = useStore((s) => s.balanceVisible);
  const toggleBalanceVisible = useStore((s) => s.toggleBalanceVisible);
  const users = useStore((s) => s.users);
  const currentUserId = useStore((s) => s.currentUserId);
  const user = users.find((u) => u.id === currentUserId);

  const [showAll, setShowAll] = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotifPerm('granted');
    }
  }, []);

  async function handleBellClick() {
    const granted = await requestNotificationPermission();
    setNotifPerm(granted ? 'granted' : 'denied');
  }

  if (!user) return (
    <div className="flex items-center justify-center h-full bg-[#0a0a0a]">
      <div className="w-8 h-8 border-2 border-[#7c6af7] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const displayed = showAll ? user.transactions : user.transactions.slice(0, 5);
  const totalIn  = user.transactions.filter(t => t.type === 'receive' || t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const totalOut = user.transactions.filter(t => t.type === 'send').reduce((s, t) => s + t.amount, 0);

  return (
    // min-h-full so content can scroll in the App wrapper; pb-safe-nav clears the fixed BottomNav
    <div className="flex flex-col min-h-full bg-[#0a0a0a] pb-safe-nav">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGradients[user.id] ?? 'revolut-gradient'} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
            {user.avatar}
          </div>
          <div>
            <p className="text-xs text-gray-400">Hey,</p>
            <p className="text-sm font-semibold text-white">{user.name} 👋</p>
          </div>
        </div>
        <button
          onClick={handleBellClick}
          className="relative w-9 h-9 rounded-full glass flex items-center justify-center flex-shrink-0"
          title={notifPerm === 'granted' ? 'Notifications on' : 'Enable notifications'}
        >
          <Bell size={18} className={notifPerm === 'granted' ? 'text-[#7c6af7]' : 'text-gray-500'} />
          {notifPerm !== 'granted' && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
          {notifPerm === 'granted' && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7c6af7] rounded-full" />
          )}
        </button>
      </div>

      {/* ── Balance Card ──────────────────────────────────────────────────── */}
      <div className="mx-5 mb-4">
        <div className="rounded-2xl p-5 card-gradient relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7c6af7] rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Total balance</p>
              <button onClick={toggleBalanceVisible} className="text-gray-400 hover:text-white transition-colors">
                {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-white">
                {balanceVisible ? `Ɛ${user.balance.toLocaleString()}` : '••••••'}
              </span>
              <span className="text-sm text-gray-400">EFI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-white/10 text-gray-300 rounded-full font-medium">
                💜 Efi Monede
              </span>
              <span className="text-xs text-gray-500">{user.username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map(({ label, icon: Icon, color, to }) => (
            <button key={label} onClick={() => navigate(to)} className="flex flex-col items-center gap-1.5">
              <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-3">
            <p className="text-xs text-gray-500 mb-1">Received</p>
            <p className="text-lg font-bold text-green-400">
              {balanceVisible ? `Ɛ${totalIn.toLocaleString()}` : '••••'}
            </p>
          </div>
          <div className="glass rounded-2xl p-3">
            <p className="text-xs text-gray-500 mb-1">Sent</p>
            <p className="text-lg font-bold text-red-400">
              {balanceVisible ? `Ɛ${totalOut.toLocaleString()}` : '••••'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Transactions ──────────────────────────────────────────────────── */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">Recent transactions</h2>
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-[#7c6af7] flex items-center gap-1 font-medium">
            {showAll ? 'Show less' : 'See all'}
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="glass rounded-2xl overflow-hidden">
          {displayed.length === 0 ? (
            <p className="text-center text-sm text-gray-600 py-8">No transactions yet</p>
          ) : (
            displayed.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
          )}
        </div>
      </div>

    </div>
  );
}
