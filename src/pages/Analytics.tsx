import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../store/useStore';

const areaData = [
  { day: 'Mon', amount: 120 },
  { day: 'Tue', amount: 80 },
  { day: 'Wed', amount: 200 },
  { day: 'Thu', amount: 45 },
  { day: 'Fri', amount: 310 },
  { day: 'Sat', amount: 175 },
  { day: 'Sun', amount: 90 },
];

const pieData = [
  { name: 'Food', value: 45, color: '#f97316' },
  { name: 'Shopping', value: 120, color: '#ec4899' },
  { name: 'Transport', value: 30, color: '#3b82f6' },
  { name: 'Entertainment', value: 80, color: '#a855f7' },
  { name: 'Transfers', value: 200, color: '#7c6af7' },
];

export default function Analytics() {
  const { transactions, balanceVisible } = useStore();
  const totalSpent = transactions
    .filter((t) => t.type === 'send')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-24">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">May 2026</p>
      </div>

      {/* Summary */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <p className="text-xl font-bold text-red-400">
              {balanceVisible ? `Ɛ${totalSpent}` : '••••'}
            </p>
            <p className="text-xs text-gray-600 mt-1">↓ 12% vs last month</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Transactions</p>
            <p className="text-xl font-bold text-white">{transactions.length}</p>
            <p className="text-xs text-gray-600 mt-1">↑ 3 vs last month</p>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="px-5 mb-6">
        <div className="glass rounded-2xl p-4">
          <p className="text-sm font-semibold text-white mb-4">Spending This Week</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c6af7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, color: '#fff' }}
                formatter={(v: number) => [`Ɛ${v}`, 'Spent']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#7c6af7"
                strokeWidth={2}
                fill="url(#colorAmt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie + Breakdown */}
      <div className="px-5 mb-6">
        <div className="glass rounded-2xl p-4">
          <p className="text-sm font-semibold text-white mb-4">Spending by Category</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                    <span className="text-xs text-gray-400">{entry.name}</span>
                  </div>
                  <span className="text-xs text-white font-medium">Ɛ{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top merchants */}
      <div className="px-5">
        <p className="text-sm font-semibold text-white mb-3">Top Merchants</p>
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { name: 'Efi Mall', amount: 120, icon: '🛍️' },
            { name: 'Efi Bistro', amount: 45, icon: '🍔' },
            { name: 'EfiPlex', amount: 80, icon: '🎬' },
            { name: 'Efi Transit', amount: 30, icon: '🚌' },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0">
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{m.name}</p>
                <div className="mt-1 w-full h-1.5 bg-white/10 rounded-full">
                  <div
                    className="h-full rounded-full bg-[#7c6af7]"
                    style={{ width: `${(m.amount / 120) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-white">Ɛ{m.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
