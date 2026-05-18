import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

const USERS = [
  { id: 'stefi', name: 'Stefi', color: '#7c6af7', emoji: '💜' },
  { id: 'mara', name: 'Mara', color: '#ec4899', emoji: '🩷' },
  { id: 'adriana', name: 'Adriana', color: '#22c55e', emoji: '💚' },
];

type Step = 'pick' | 'amount' | 'done';

export default function Request() {
  const navigate = useNavigate();
  const currentUser = useStore((s) => s.getCurrentUser());
  const sendMessage = useStore((s) => s.postSystemMessage);

  const [step, setStep] = useState<Step>('pick');
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  const contacts = USERS.filter((u) => u.id !== currentUser?.id);
  const target = USERS.find((u) => u.id === targetId);

  function handlePickContact(id: string) {
    setTargetId(id);
    setStep('amount');
  }

  function handleConfirm() {
    if (!amount || parseFloat(amount) <= 0) return;
    const t = USERS.find((u) => u.id === targetId);
    if (!t || !currentUser) return;
    const msg = `${currentUser.name} is requesting Ɛ${amount} from ${t.name}${note ? ` · "${note}"` : ''} 💸`;
    sendMessage(msg);
    setStep('done');
  }

  function buildLink() {
    const base = window.location.origin;
    const params = new URLSearchParams({ to: currentUser?.id ?? '', amount, ...(note ? { note } : {}) });
    return `${base}/pay?${params.toString()}`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (!currentUser) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-safe-nav">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button
          onClick={() => (step === 'pick' ? navigate(-1) : setStep(step === 'amount' ? 'pick' : 'amount'))}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">
          {step === 'pick' ? 'Request Money' : step === 'amount' ? 'Enter Amount' : 'Request Sent'}
        </h1>
      </div>

      <div className="flex-1 px-5">
        {/* ── Step 1: Pick contact ── */}
        {step === 'pick' && (
          <div className="space-y-3 mt-2">
            <p className="text-gray-400 text-sm mb-5">Request from a friend</p>
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => handlePickContact(c.id)}
                className="w-full glass rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: `${c.color}33`, border: `2px solid ${c.color}55` }}
                >
                  {c.name[0]}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold">{c.name}</p>
                  <p className="text-gray-500 text-xs">Tap to request {c.emoji}</p>
                </div>
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Amount + note ── */}
        {step === 'amount' && target && (
          <div className="flex flex-col items-center mt-4 gap-6">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: `${target.color}33`, border: `2px solid ${target.color}66` }}
            >
              {target.name[0]}
            </div>
            <p className="text-gray-400 text-sm">
              Requesting from <span className="text-white font-semibold">{target.name}</span>
            </p>

            {/* Amount input */}
            <div className="relative w-full">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-500">Ɛ</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full glass rounded-2xl pl-12 pr-5 py-5 text-3xl font-bold text-white outline-none placeholder-gray-700 text-center"
                autoFocus
              />
            </div>

            {/* Note */}
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="w-full glass rounded-2xl px-5 py-4 text-sm text-white outline-none placeholder-gray-600"
            />

            {/* Confirm */}
            <button
              onClick={handleConfirm}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-4 rounded-2xl font-semibold text-white text-base disabled:opacity-40 transition-opacity active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)' }}
            >
              Request Ɛ{amount || '0'}
            </button>
          </div>
        )}

        {/* ── Step 3: Done / Request card ── */}
        {step === 'done' && target && (
          <div className="flex flex-col items-center mt-6 gap-5">
            {/* Card */}
            <div className="w-full rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)' }}>
              <div className="px-6 pt-6 pb-4">
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">Payment Request</p>
                <p className="text-white text-4xl font-bold">Ɛ{amount}</p>
                {note && <p className="text-white/80 text-sm mt-1">"{note}"</p>}
              </div>
              <div className="bg-black/20 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">From</p>
                  <p className="text-white font-semibold">{currentUser.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">To</p>
                  <p className="text-white font-semibold">{target.name}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-xs text-center">
              A message was posted in the group chat 💬
            </p>

            {/* Copy link */}
            <button
              onClick={handleCopy}
              className="w-full glass rounded-2xl py-4 flex items-center justify-center gap-2 text-white font-medium active:scale-[0.98] transition-all"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-green-400" />
                  <span className="text-green-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Request Link
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-2xl font-semibold text-white text-base active:scale-[0.98] bg-white/10"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
