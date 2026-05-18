import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStore } from '../store/useStore';
import { TrendingUp } from 'lucide-react';

const barColors = [
  '#7c6af7', '#ec4899', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#a855f7', '#14b8a6',
];

export default function Analytics() {
  const { getCurrentUser, balanceVisible } = useStore();
  const user = getCurrentUser();

  if (!user) return null;

  const totalSpent = user.transactions
    .filter((t) => t.type === 'send' || t.type === 'exchange')
    .reduce((s, t) => s + t.amount, 0);

  const totalReceived = user.transactions
    .filter((t) => t.type === 'receive' || t.type === 'topup')
    .reduce((s, t) => s + t.amount, 0);

  const lifeItems = user.lifeItems ?? [];
  const totalLifeSpent = lifeItems.reduce((s, li) => s + li.totalSpent, 0);

  const chartData = lifeItems.map((li) => ({
    name: `${li.emoji} ${li.name}`,
    shortName: li.emoji,
    label: li.name,
    qty: li.qty,
    spent: li.totalSpent,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-24 overflow-y-auto">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Your life in Efi Monede 💜</p>
      </div>

      {/* Summary cards */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total received</p>
            <p className="text-xl font-bold text-green-400">
              {balanceVisible ? `Ɛ${totalReceived.toLocaleString()}` : '••••'}
            </p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total sent</p>
            <p className="text-xl font-bold text-red-400">
              {balanceVisible ? `Ɛ${totalSpent.toLocaleString()}` : '••••'}
            </p>
          </div>
        </div>
      </div>

      {/* Life spending total */}
      {totalLifeSpent > 0 && (
        <div className="px-5 mb-5">
          <div className="revolut-gradient rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
            <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Invested in life</p>
            <p className="text-3xl font-bold text-white mb-1">
              {balanceVisible ? `Ɛ${totalLifeSpent.toLocaleString()}` : '••••'}
            </p>
            <p className="text-xs text-white/60">{lifeItems.reduce((s, li) => s + li.qty, 0)} moments purchased</p>
          </div>
        </div>
      )}

      {/* Life items - chart */}
      {chartData.length > 0 ? (
        <>
          <div className="px-5 mb-5">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#7c6af7]" />
                <p className="text-sm font-semibold text-white">Moments purchased</p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fill: '#9ca3af', fontSize: 18 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, color: '#fff' }}
                    formatter={(v, _name, props: any) => [`${v}x ${props.payload.label}`, 'Quantity'] as [string, string]}
                    labelFormatter={() => ''}
                  />
                  <Bar dataKey="qty" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={barColors[i % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Life items list */}
          <div className="px-5 mb-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Moment details</p>
            <div className="glass rounded-2xl overflow-hidden">
              {lifeItems.map((li, i) => (
                <div key={li.id} className="flex items-center gap-3 px-4 py-4 border-b border-white/5 last:border-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: barColors[i % barColors.length] + '25' }}
                  >
                    {li.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{li.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((li.qty / Math.max(1, ...lifeItems.map(x => x.qty))) * 100, 100)}%`,
                            background: barColors[i % barColors.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">{li.qty}x</p>
                    <p className="text-xs text-gray-500">Ɛ{li.totalSpent}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="px-5 mb-5">
          <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
            <div className="text-5xl">✨</div>
            <p className="text-base font-semibold text-white">No moments yet</p>
            <p className="text-sm text-gray-500">
              Head to <span className="text-[#7c6af7] font-medium">Exchange</span> and turn your Efi Monede into beautiful moments!
            </p>
          </div>
        </div>
      )}

      {/* Recent exchanges from transactions */}
      {user.transactions.filter(t => t.type === 'exchange').length > 0 && (
        <div className="px-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Recent exchanges</p>
          <div className="glass rounded-2xl overflow-hidden">
            {user.transactions.filter(t => t.type === 'exchange').slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0">
                <div className="w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center text-lg flex-shrink-0">
                  ✨
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{tx.description}</p>
                  <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString('en-US')}</p>
                </div>
                <p className="text-sm font-semibold text-yellow-400">-Ɛ{tx.amount}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
