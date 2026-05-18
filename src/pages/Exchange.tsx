import { useState } from 'react';
import { ArrowLeft, CheckCircle, Sparkles, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { notify } from '../utils/notify';

interface LifeCurrency {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  color: string;
  bgColor: string;
}

const lifeCurrencies: LifeCurrency[] = [
  { id: 'iesire',     name: 'Night Out',    emoji: '🌆', description: 'A perfect evening with friends',    cost: 150,  color: 'text-orange-400', bgColor: 'bg-orange-500/15' },
  { id: 'iubire',     name: 'Love',         emoji: '❤️', description: 'A pure moment of love',            cost: 999,  color: 'text-red-400',    bgColor: 'bg-red-500/15'    },
  { id: 'imbratisare',name: 'Hug',          emoji: '🤗', description: 'A warm and long embrace',          cost: 50,   color: 'text-pink-400',   bgColor: 'bg-pink-500/15'   },
  { id: 'cafea',      name: 'Coffee Date',  emoji: '☕', description: 'Stories and laughs over coffee',   cost: 80,   color: 'text-yellow-600', bgColor: 'bg-yellow-500/15' },
  { id: 'vacanta',    name: 'Vacation',     emoji: '✈️', description: 'An unforgettable getaway',         cost: 2000, color: 'text-blue-400',   bgColor: 'bg-blue-500/15'   },
  { id: 'rasete',     name: 'Laughter',     emoji: '😂', description: 'A genuine burst of laughter',     cost: 30,   color: 'text-yellow-400', bgColor: 'bg-yellow-500/15' },
  { id: 'dans',       name: 'Dance',        emoji: '💃', description: 'A night of dancing and energy',   cost: 120,  color: 'text-purple-400', bgColor: 'bg-purple-500/15' },
  { id: 'surpriza',   name: 'Surprise',     emoji: '🎁', description: 'An unexpected little gift',       cost: 200,  color: 'text-green-400',  bgColor: 'bg-green-500/15'  },
];

const ALL_USERS = [
  { id: 'stefi',   name: 'Stefi',   color: '#7c6af7' },
  { id: 'mara',    name: 'Mara',    color: '#ec4899' },
  { id: 'adriana', name: 'Adriana', color: '#22c55e' },
];

type Mode = 'browse' | 'detail' | 'pick-recipient' | 'done';

export default function Exchange() {
  const navigate = useNavigate();
  const { getCurrentUser, spendForLife, giftForLife } = useStore();
  const user = getCurrentUser();

  const [selected, setSelected]       = useState<LifeCurrency | null>(null);
  const [qty, setQty]                 = useState(1);
  const [mode, setMode]               = useState<Mode>('browse');
  const [recipientId, setRecipientId] = useState('');
  const [wasGift, setWasGift]         = useState(false);
  const [error, setError]             = useState('');

  if (!user) return null;

  const total     = selected ? selected.cost * qty : 0;
  const contacts  = ALL_USERS.filter((u) => u.id !== user.id);
  const recipient = ALL_USERS.find((u) => u.id === recipientId);

  function openDetail(lc: LifeCurrency) {
    setSelected(lc);
    setQty(1);
    setError('');
    setMode('detail');
  }

  function handleKeep() {
    if (!selected) return;
    if (total > user!.balance) { setError('Not enough balance 😢'); return; }
    spendForLife(selected.id, selected.name, selected.emoji, qty, total);
    notify('✨ Exchange Complete!', `You got ${qty}x ${selected.name}`);
    setWasGift(false);
    setMode('done');
  }

  function handleGiftConfirm() {
    if (!selected || !recipientId) return;
    if (total > user!.balance) { setError('Not enough balance 😢'); return; }
    const ok = giftForLife(selected.id, selected.name, selected.emoji, qty, total, recipientId);
    if (!ok) { setError('Something went wrong 😢'); return; }
    setWasGift(true);
    setMode('done');
  }

  function reset() {
    setSelected(null); setQty(1); setError('');
    setRecipientId(''); setWasGift(false); setMode('browse');
  }

  // ── Done screen ────────────────────────────────────────────────────────────
  if (mode === 'done' && selected) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] items-center justify-center px-5 pb-safe-nav">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-7xl animate-bounce">{selected.emoji}</div>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <div>
            {wasGift ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Gift sent! 🎁</h2>
                <p className="text-gray-400">
                  You gifted <span className="text-white font-bold">{qty}x {selected.name}</span>
                  <br />to <span style={{ color: recipient?.color }} className="font-bold">{recipient?.name}</span>
                  <br />for <span className="text-[#7c6af7] font-bold">Ɛ{total.toLocaleString()}</span>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Exchange complete! 🎉</h2>
                <p className="text-gray-400">
                  You got <span className="text-white font-bold">{qty}x {selected.name}</span>
                  <br />for <span className="text-[#7c6af7] font-bold">Ɛ{total.toLocaleString()}</span>
                </p>
              </>
            )}
          </div>
          <button onClick={reset} className="w-full py-4 bg-[#7c6af7] text-white font-semibold rounded-2xl">
            Exchange again
          </button>
          <button onClick={() => navigate('/')} className="text-sm text-gray-500">Back home</button>
        </div>
      </div>
    );
  }

  // ── Pick recipient screen ──────────────────────────────────────────────────
  if (mode === 'pick-recipient' && selected) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-safe-nav">
        <div className="flex items-center gap-4 px-5 pt-12 pb-4">
          <button onClick={() => setMode('detail')} className="w-9 h-9 glass rounded-full flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">Gift to...</h1>
            <p className="text-xs text-gray-500">Who receives {selected.emoji} {selected.name}?</p>
          </div>
        </div>

        <div className="px-5 mt-2 space-y-3">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setRecipientId(c.id)}
              className={`w-full glass rounded-2xl p-4 flex items-center gap-4 transition-all ${
                recipientId === c.id ? 'ring-2 ring-[#7c6af7] scale-[1.01]' : ''
              }`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ background: `${c.color}33`, border: `2px solid ${c.color}55` }}
              >
                {c.name[0]}
              </div>
              <p className="flex-1 text-left text-white font-semibold">{c.name}</p>
              {recipientId === c.id && (
                <CheckCircle size={20} className="text-[#7c6af7]" />
              )}
            </button>
          ))}

          <div className="h-4" />

          {/* Summary */}
          {recipientId && (
            <div className="glass rounded-2xl p-4 flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-gray-500">Gifting</p>
                <p className="text-white font-semibold">{qty}x {selected.name} {selected.emoji}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Cost</p>
                <p className="text-[#7c6af7] font-bold">Ɛ{total.toLocaleString()}</p>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            onClick={handleGiftConfirm}
            disabled={!recipientId || total > user.balance}
            className="w-full py-4 rounded-2xl font-semibold text-white disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)' }}
          >
            <Gift size={18} />
            Send gift 🎁
          </button>
        </div>
      </div>
    );
  }

  // ── Main browse + detail screen ────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-safe-nav">
      <div className="flex items-center gap-4 px-5 pt-12 pb-2">
        <button
          onClick={() => mode === 'detail' ? setMode('browse') : navigate('/')}
          className="w-9 h-9 glass rounded-full flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-white">Exchange EFI</h1>
          <p className="text-xs text-gray-500">Turn coins into moments 💜</p>
        </div>
      </div>

      {/* Balance pill */}
      <div className="mx-5 mt-4 mb-5 px-4 py-2.5 glass rounded-2xl flex items-center justify-between">
        <span className="text-sm text-gray-400">Your balance</span>
        <span className="text-sm font-bold text-white">Ɛ{user.balance.toLocaleString()}</span>
      </div>

      {/* Life currencies grid */}
      <div className="px-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-[#7c6af7]" />
          <p className="text-xs text-gray-400 uppercase tracking-widest">Pick what you want</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {lifeCurrencies.map((lc) => (
            <button
              key={lc.id}
              onClick={() => openDetail(lc)}
              className={`rounded-2xl p-4 text-left transition-all ${lc.bgColor} ${
                selected?.id === lc.id && mode === 'detail'
                  ? 'ring-2 ring-[#7c6af7] scale-[1.02]'
                  : 'hover:scale-[1.01]'
              }`}
            >
              <div className="text-3xl mb-2">{lc.emoji}</div>
              <p className={`text-sm font-semibold ${lc.color}`}>{lc.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{lc.description}</p>
              <p className="text-xs font-bold text-white mt-2">Ɛ{lc.cost}</p>
            </button>
          ))}
        </div>

        {/* Selected item detail panel */}
        {selected && mode === 'detail' && (
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selected.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-white">{selected.name}</p>
                <p className="text-xs text-gray-500">Ɛ{selected.cost} each</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 glass rounded-full flex items-center justify-center text-white font-bold"
                >−</button>
                <span className="text-white font-bold w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 bg-[#7c6af7] rounded-full flex items-center justify-center text-white font-bold"
                >+</button>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-3 mb-4">
              <span className="text-sm text-gray-400">Total</span>
              <span className="text-lg font-bold text-white">Ɛ{total.toLocaleString()}</span>
            </div>

            {error && <p className="text-sm text-red-400 mb-3 text-center">{error}</p>}

            {/* Two action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleKeep}
                disabled={total > user.balance}
                className="flex-1 py-3.5 bg-white/10 disabled:opacity-40 text-white font-semibold rounded-xl text-sm"
              >
                Keep ✨
              </button>
              <button
                onClick={() => { setError(''); setRecipientId(''); setMode('pick-recipient'); }}
                disabled={total > user.balance}
                className="flex-1 py-3.5 disabled:opacity-40 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)' }}
              >
                <Gift size={15} /> Gift 🎁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
