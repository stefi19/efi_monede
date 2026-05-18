import { useState } from 'react';
import { Eye, EyeOff, Bell, Send, Plus, ArrowLeftRight, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import TransactionItem from '../components/TransactionItem';

const quickActions = [
  { label: 'Send', icon: Send, color: 'bg-[#7c6af7]', to: '/send' },
  { label: 'Add', icon: Plus, color: 'bg-[#22c55e]', to: '/topup' },
  { label: 'Exchange', icon: ArrowLeftRight, color: 'bg-[#f59e0b]', to: '/exchange' },
  { label: 'Request', icon: Zap, color: 'bg-[#ec4899]', to: '/request' },
];

export default function Home() {
  const navigate = useNavigate();
  const { balance, transactions, balanceVisible, toggleBalanceVisible } = useStore();
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full revolut-gradient flex items-center justify-center text-sm font-bold">
            E
          </div>
          <div>
            <p className="text-xs text-gray-400">Good morning,</p>
            <p className="text-sm font-semibold text-white">Efi User</p>
          </div>
        </div>
        <button className="relative w-9 h-9 rounded-full glass flex items-center justify-center">
          <Bell size={18} className="text-gray-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7c6af7] rounded-full" />
        </button>
      </div>

      {/* Balance Card */}
      <div className="mx-5 mb-6">
        <div className="rounded-2xl p-6 card-gradient relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7c6af7] rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Total Balance</p>
              <button onClick={toggleBalanceVisible} className="text-gray-400 hover:text-white transition-colors">
                {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-white">
                {balanceVisible ? `Ɛ${balance.toLocaleString()}` : '••••••'}
              </span>
              <span className="text-sm text-gray-400">EFI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium">
                💜 Efi Monede
              </span>
              <span className="text-xs text-gray-500">≈ $0.00 USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, color, to }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Money In</p>
            <p className="text-lg font-bold text-green-400">
              {balanceVisible ? `Ɛ${useStore.getState().totalReceived.toLocaleString()}` : '••••'}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">This month</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Money Out</p>
            <p className="text-lg font-bold text-red-400">
              {balanceVisible ? `Ɛ${useStore.getState().totalSent.toLocaleString()}` : '••••'}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">This month</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-[#7c6af7] flex items-center gap-1 font-medium"
          >
            {showAll ? 'Show less' : 'See all'}
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="glass rounded-2xl overflow-hidden">
          {displayed.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>
    </div>
  );
}
