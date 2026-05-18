import type { Transaction } from '../store/useStore';
import {
  ShoppingBag,
  Bus,
  Coffee,
  Film,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Plus,
} from 'lucide-react';

const categoryConfig = {
  food: { icon: Coffee, color: 'bg-orange-500/20 text-orange-400' },
  transport: { icon: Bus, color: 'bg-blue-500/20 text-blue-400' },
  shopping: { icon: ShoppingBag, color: 'bg-pink-500/20 text-pink-400' },
  entertainment: { icon: Film, color: 'bg-purple-500/20 text-purple-400' },
  transfer: { icon: ArrowUpRight, color: 'bg-green-500/20 text-green-400' },
  exchange: { icon: ArrowLeftRight, color: 'bg-yellow-500/20 text-yellow-400' },
  topup: { icon: Plus, color: 'bg-indigo-500/20 text-indigo-400' },
};

interface Props {
  transaction: Transaction;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TransactionItem({ transaction }: Props) {
  const config = categoryConfig[transaction.category];
  const Icon = transaction.type === 'receive' || transaction.type === 'topup'
    ? ArrowDownLeft
    : config.icon;

  const isIncoming = transaction.type === 'receive' || transaction.type === 'topup';

  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-white/5 rounded-xl transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{transaction.description}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {transaction.counterparty} · {formatDate(transaction.date)}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-semibold ${isIncoming ? 'text-green-400' : 'text-white'}`}>
          {isIncoming ? '+' : '-'}Ɛ{transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">{transaction.currency}</p>
      </div>
    </div>
  );
}
