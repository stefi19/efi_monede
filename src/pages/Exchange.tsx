import { useState } from 'react';
import { ArrowLeft, ArrowUpDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore, useCurrencies } from '../store/useStore';

export default function Exchange() {
  const navigate = useNavigate();
  const currencies = useCurrencies();
  const { balance } = useStore();

  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [done, setDone] = useState(false);

  const rate = fromCurrency.rateToEFI / toCurrency.rateToEFI;
  const toAmount = fromAmount ? (parseFloat(fromAmount) * rate).toFixed(4) : '';

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  const handleExchange = () => {
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] items-center justify-center px-5 pb-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Exchange Complete!</h2>
            <p className="text-gray-400">
              <span className="text-white font-semibold">{fromCurrency.symbol}{fromAmount} {fromCurrency.code}</span>{' '}
              → <span className="text-white font-semibold">{toCurrency.symbol}{toAmount} {toCurrency.code}</span>
            </p>
          </div>
          <button
            onClick={() => { setDone(false); setFromAmount(''); }}
            className="w-full py-4 bg-[#f59e0b] text-white font-semibold rounded-2xl"
          >
            Make Another Exchange
          </button>
          <button onClick={() => navigate('/')} className="text-sm text-gray-400">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-24">
      <div className="flex items-center gap-4 px-5 pt-12 pb-6">
        <button onClick={() => navigate('/')} className="w-9 h-9 glass rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Exchange</h1>
      </div>

      {/* Live rates banner */}
      <div className="mx-5 mb-6 px-4 py-2 bg-[#7c6af7]/10 border border-[#7c6af7]/20 rounded-xl">
        <p className="text-xs text-[#7c6af7] text-center">🔴 Live Efi Market Rates</p>
      </div>

      {/* Exchange card */}
      <div className="px-5 relative">
        {/* From */}
        <div className="glass rounded-2xl p-5 mb-1">
          <p className="text-xs text-gray-500 mb-3">You send</p>
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0"
              className="text-3xl font-bold text-white bg-transparent outline-none w-40"
              autoFocus
            />
            <select
              value={fromCurrency.code}
              onChange={(e) => {
                const c = currencies.find((x) => x.code === e.target.value)!;
                setFromCurrency(c);
              }}
              className="bg-white/10 text-white rounded-xl px-3 py-2 text-sm font-semibold outline-none"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#1a1a1a]">
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Balance: {fromCurrency.symbol}{balance.toLocaleString()} {fromCurrency.code}
          </p>
        </div>

        {/* Swap button */}
        <div className="flex justify-center my-1 relative z-10">
          <button
            onClick={swap}
            className="w-10 h-10 bg-[#7c6af7] rounded-full flex items-center justify-center shadow-lg"
          >
            <ArrowUpDown size={18} className="text-white" />
          </button>
        </div>

        {/* To */}
        <div className="glass rounded-2xl p-5 mb-6">
          <p className="text-xs text-gray-500 mb-3">You receive</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white">{toAmount || '0'}</span>
            <select
              value={toCurrency.code}
              onChange={(e) => {
                const c = currencies.find((x) => x.code === e.target.value)!;
                setToCurrency(c);
              }}
              className="bg-white/10 text-white rounded-xl px-3 py-2 text-sm font-semibold outline-none"
            >
              {currencies.filter((c) => c.code !== fromCurrency.code).map((c) => (
                <option key={c.code} value={c.code} className="bg-[#1a1a1a]">
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Rate: 1 {fromCurrency.code} = {rate.toFixed(4)} {toCurrency.code}
          </p>
        </div>

        <button
          onClick={handleExchange}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          className="w-full py-4 bg-[#f59e0b] disabled:opacity-40 text-white font-semibold rounded-2xl"
        >
          Exchange Now
        </button>
      </div>

      {/* Currency rates */}
      <div className="px-5 mt-8">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">All Rates vs EFI</h2>
        <div className="glass rounded-2xl overflow-hidden">
          {currencies.slice(1).map((c) => (
            <div key={c.code} className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.code}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{c.rateToEFI} EFI</p>
                <p className="text-xs text-green-400">+{(Math.random() * 2).toFixed(2)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
