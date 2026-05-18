import { useState } from 'react';
import { Eye, EyeOff, Copy, Lock, Wifi, MoreHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';

const cards = [
  {
    id: 1,
    type: 'Virtual',
    last4: '4242',
    expiry: '05/28',
    cvv: '***',
    name: 'EFI USER',
    gradient: 'revolut-gradient',
    frozen: false,
  },
  {
    id: 2,
    type: 'Physical',
    last4: '8821',
    expiry: '11/27',
    cvv: '***',
    name: 'EFI USER',
    gradient: 'gold-gradient',
    frozen: false,
  },
];

export default function Cards() {
  const { balanceVisible } = useStore();
  const [activeCard, setActiveCard] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [copied, setCopied] = useState(false);

  const card = cards[activeCard];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-safe-nav">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-xl font-bold text-white">My Cards</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your Efi cards</p>
      </div>

      {/* Card Selector */}
      <div className="flex gap-3 px-5 mb-6">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveCard(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              i === activeCard
                ? 'bg-[#7c6af7] text-white'
                : 'glass text-gray-400'
            }`}
          >
            {c.type}
          </button>
        ))}
      </div>

      {/* Card Visual */}
      <div className="px-5 mb-6">
        <div
          className={`rounded-3xl p-6 ${card.gradient} relative overflow-hidden aspect-[1.6/1] flex flex-col justify-between ${
            frozen ? 'opacity-60 grayscale' : ''
          }`}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Efi Monede</p>
              <p className="text-white font-bold text-lg mt-0.5">💜 {card.type}</p>
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={20} className="text-white/60 rotate-90" />
              {frozen && <Lock size={16} className="text-white" />}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-white font-mono text-base tracking-widest mb-3">
              •••• •••• •••• {card.last4}
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase">Card Holder</p>
                <p className="text-white text-sm font-semibold">{card.name}</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs uppercase">Expires</p>
                <p className="text-white text-sm font-semibold">{card.expiry}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">VISA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => setFrozen(!frozen)}
            className={`flex flex-col items-center gap-2 p-3 glass rounded-2xl transition-all ${frozen ? 'border border-blue-500/50' : ''}`}
          >
            <Lock size={20} className={frozen ? 'text-blue-400' : 'text-gray-400'} />
            <span className="text-[10px] text-gray-400">{frozen ? 'Unfreeze' : 'Freeze'}</span>
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex flex-col items-center gap-2 p-3 glass rounded-2xl"
          >
            {showDetails ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
            <span className="text-[10px] text-gray-400">Details</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-2 p-3 glass rounded-2xl"
          >
            <Copy size={20} className={copied ? 'text-green-400' : 'text-gray-400'} />
            <span className="text-[10px] text-gray-400">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 glass rounded-2xl">
            <MoreHorizontal size={20} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">More</span>
          </button>
        </div>
      </div>

      {/* Card Details */}
      {showDetails && (
        <div className="px-5 mb-6">
          <div className="glass rounded-2xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Card Number</span>
              <span className="text-xs text-white font-mono">4242 4242 4242 {card.last4}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Expiry</span>
              <span className="text-xs text-white font-mono">{card.expiry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">CVV</span>
              <span className="text-xs text-white font-mono">737</span>
            </div>
          </div>
        </div>
      )}

      {/* Spending limit */}
      <div className="px-5">
        <div className="glass rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-white">Monthly Spending</p>
            <p className="text-sm font-semibold text-white">
              {balanceVisible ? 'Ɛ475' : '••••'} / Ɛ2,000
            </p>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full revolut-gradient transition-all"
              style={{ width: `${(475 / 2000) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Ɛ1,525 remaining this month</p>
        </div>
      </div>
    </div>
  );
}
