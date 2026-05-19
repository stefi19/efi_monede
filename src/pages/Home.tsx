import { useState, useEffect } from 'react';
import { Eye, EyeOff, Bell, Send, Plus, ArrowLeftRight, Zap, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import TransactionItem from '../components/TransactionItem';
import { requestNotificationPermission } from '../utils/notify';

const quickActions = [
  { label: 'Send',     icon: Send,           color: '#7c6af7', to: '/send'     },
  { label: 'Add',      icon: Plus,           color: '#22c55e', to: '/topup'    },
  { label: 'Exchange', icon: ArrowLeftRight, color: '#f59e0b', to: '/exchange' },
  { label: 'Request',  icon: Zap,            color: '#ec4899', to: '/request'  },
];

const userGradients: Record<string, string> = {
  stefi:   'from-[#7c6af7] to-[#a78bfa]',
  mara:    'from-[#ec4899] to-[#f9a8d4]',
  adriana: 'from-[#22c55e] to-[#86efac]',
};

export default function Home() {
  const navigate = useNavigate();
  const balanceVisible       = useStore((s) => s.balanceVisible);
  const toggleBalanceVisible = useStore((s) => s.toggleBalanceVisible);
  const users                = useStore((s) => s.users);
  const currentUserId        = useStore((s) => s.currentUserId);
  const user                 = users.find((u) => u.id === currentUserId);

  const [showAll,   setShowAll]   = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') setNotifPerm('granted');
  }, []);

  async function handleBellClick() {
    const ok = await requestNotificationPermission();
    setNotifPerm(ok ? 'granted' : 'denied');
  }

  if (!user) return (
    <div className="flex items-center justify-center bg-[#0a0a0a]" style={{ height: '100dvh' }}>
      <div className="w-8 h-8 border-2 border-[#7c6af7] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const displayed = showAll ? user.transactions : user.transactions.slice(0, 5);
  const totalIn   = user.transactions.filter(t => t.type === 'receive' || t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const totalOut  = user.transactions.filter(t => t.type === 'send').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] pb-safe-nav">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-6">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGradients[user.id] ?? 'from-[#7c6af7] to-[#a78bfa]'} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
            {user.avatar}
          </div>
          <div className="leading-tight">
            <p className="text-[11px] text-gray-400">Hey,</p>
            <p className="text-sm font-semibold text-white">{user.name} 👋</p>
          </div>
        </div>
        <button
          onClick={handleBellClick}
          className="relative w-9 h-9 rounded-full glass flex items-center justify-center shrink-0"
        >
          <Bell size={17} className={notifPerm === 'granted' ? 'text-[#7c6af7]' : 'text-gray-400'} />
          <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${notifPerm === 'granted' ? 'bg-[#7c6af7]' : 'bg-red-500'}`} />
        </button>
      </div>

      {/* Balance Card */}
      <div className="px-5 mb-6">
        <div className="rounded-2xl p-4 card-gradient relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#7c6af7]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Total balance</p>
              <button onClick={toggleBalanceVisible} className="text-gray-400 p-1 -mr-1">
                {balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-2.5">
              <span className="text-[32px] leading-none font-bold text-white">
                {balanceVisible ? `Ɛ${user.balance.toLocaleString()}` : '••••••'}
              </span>
              <span className="text-xs text-gray-400 mb-0.5">EFI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 bg-white/10 text-gray-300 rounded-full font-medium">💜 Efi Monede</span>
              <span className="text-[11px] text-gray-500">{user.username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map(({ label, icon: Icon, color, to }) => (
            <button key={label} onClick={() => navigate(to)} className="flex flex-col items-center gap-1.5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: color }}
              >
                <Icon size={21} className="text-white" />
              </div>
              <span className="text-[11px] text-gray-400 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
              <TrendingDown size={15} className="text-green-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Received</p>
              <p className="text-sm font-bold text-green-400">
                {balanceVisible ? `Ɛ${totalIn.toLocaleString()}` : '••••'}
              </p>
            </div>
          </div>
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
              <TrendingUp size={15} className="text-red-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Sent</p>
              <p className="text-sm font-bold text-red-400">
                {balanceVisible ? `Ɛ${totalOut.toLocaleString()}` : '••••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-white">Recent transactions</h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[11px] text-[#7c6af7] flex items-center gap-0.5 font-medium"
          >
            {showAll ? 'Show less' : 'See all'}
            <ChevronRight size={13} />
          </button>
        </div>
        <div className="glass rounded-2xl overflow-hidden">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="text-3xl">��</span>
              <p className="text-sm text-gray-500">No transactions yet</p>
            </div>
          ) : (
            displayed.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
          )}
        </div>
      </div>

    </div>
  );
}
