import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const topupAmounts = [100, 250, 500, 1000, 2000, 5000];

export default function TopUp() {
  const navigate = useNavigate();
  const { addBalance } = useStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  const [done, setDone] = useState(false);

  const finalAmount = selected ?? (custom ? parseFloat(custom) : 0);

  const handleTopUp = () => {
    if (finalAmount > 0) {
      addBalance(finalAmount);
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] items-center justify-center px-5 pb-safe-nav">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Top-Up Successful!</h2>
            <p className="text-gray-400">
              <span className="text-white font-semibold">Ɛ{finalAmount.toLocaleString()}</span> added to your account
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-[#22c55e] text-white font-semibold rounded-2xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-safe-nav">
      <div className="flex items-center gap-4 px-5 pt-12 pb-6">
        <button onClick={() => navigate('/')} className="w-9 h-9 glass rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Add Efi Monede</h1>
      </div>

      <div className="px-5">
        <p className="text-sm text-gray-400 mb-5">Choose an amount to top up your account</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {topupAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => { setSelected(amt); setCustom(''); }}
              className={`py-4 rounded-2xl text-sm font-semibold transition-all ${
                selected === amt
                  ? 'bg-[#22c55e] text-white'
                  : 'glass text-white hover:bg-white/10'
              }`}
            >
              Ɛ{amt.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3 mb-6">
          <span className="text-white font-semibold">Ɛ</span>
          <input
            type="number"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
            placeholder="Custom amount"
            className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-600"
          />
        </div>

        {finalAmount > 0 && (
          <div className="glass rounded-2xl p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-medium">Ɛ{finalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Fee</span>
              <span className="text-green-400 font-medium">Free</span>
            </div>
            <div className="border-t border-white/10 pt-2 mt-2 flex justify-between text-sm">
              <span className="text-white font-semibold">Total</span>
              <span className="text-white font-semibold">Ɛ{finalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleTopUp}
          disabled={finalAmount <= 0}
          className="w-full py-4 bg-[#22c55e] disabled:opacity-40 text-white font-semibold rounded-2xl"
        >
          Add Ɛ{finalAmount > 0 ? finalAmount.toLocaleString() : '0'}
        </button>
      </div>
    </div>
  );
}
