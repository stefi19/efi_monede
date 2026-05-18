import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { User } from '../store/useStore';
import { notify } from '../utils/notify';

const userGradients: Record<string, string> = {
  stefi: 'from-[#7c6af7] to-[#a78bfa]',
  mara: 'from-[#ec4899] to-[#f9a8d4]',
  adriana: 'from-[#22c55e] to-[#86efac]',
};

export default function Send() {
  const navigate = useNavigate();
  const { users, currentUserId, getCurrentUser, sendMoney } = useStore();
  const currentUser = getCurrentUser();

  const [step, setStep] = useState<'contacts' | 'amount' | 'success'>('contacts');
  const [selected, setSelected] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Only show the other 2 users
  const contacts = users.filter((u) => u.id !== currentUserId);

  const handleSend = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return setError('Please enter a valid amount');
    if (!currentUser || num > currentUser.balance) return setError('Insufficient balance');
    const ok = sendMoney(selected!.id, num);
    if (ok) {
      notify('💸 Money Sent!', `You sent Ɛ${num.toLocaleString()} to ${selected!.name}`);
      setStep('success');
    } else setError('Transfer failed');
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col min-h-full bg-[#0a0a0a] items-center justify-center px-5 pb-safe-nav">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Sent! 🎉</h2>
            <p className="text-gray-400">
              You sent <span className="text-white font-semibold">Ɛ{parseFloat(amount).toLocaleString()}</span>{' '}
              to <span className="text-white font-semibold">{selected?.name}</span>
            </p>
          </div>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-[#7c6af7] text-white font-semibold rounded-2xl">
            Back home
          </button>
        </div>
      </div>
    );
  }

  if (step === 'amount' && selected) {
    return (
      <div className="flex flex-col min-h-full bg-[#0a0a0a] pb-safe-nav">
        <div className="flex items-center gap-4 px-5 pt-4 pb-6">
          <button onClick={() => setStep('contacts')} className="w-9 h-9 glass rounded-full flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Send Efi Monede</h1>
        </div>

        <div className="px-5 flex flex-col items-center gap-6">
          {/* Recipient */}
          <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3 w-full">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${userGradients[selected.id]} flex items-center justify-center text-lg font-bold text-white`}>
              {selected.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{selected.name}</p>
              <p className="text-xs text-gray-500">{selected.username}</p>
            </div>
          </div>

          {/* Amount input */}
          <div className="text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-5xl font-bold text-white">Ɛ</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                placeholder="0"
                className="text-5xl font-bold text-white bg-transparent border-none outline-none w-40 text-center"
                autoFocus
              />
            </div>
            <p className="text-sm text-gray-500">Balance: Ɛ{currentUser?.balance.toLocaleString()}</p>
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[10, 50, 100, 500].map((v) => (
              <button key={v} onClick={() => setAmount(v.toString())}
                className="px-3 py-1.5 glass rounded-full text-sm text-gray-300 hover:bg-white/10">
                Ɛ{v}
              </button>
            ))}
          </div>

          <button
            onClick={handleSend}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full py-4 bg-[#7c6af7] disabled:opacity-40 text-white font-semibold rounded-2xl transition-opacity"
          >
            Send Ɛ{amount || '0'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] pb-safe-nav">
      <div className="flex items-center gap-4 px-5 pt-4 pb-6">
        <button onClick={() => navigate('/')} className="w-9 h-9 glass rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Send to</h1>
      </div>

      <div className="px-5">
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Your friends</p>
        <div className="glass rounded-2xl overflow-hidden">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => { setSelected(contact); setStep('amount'); setAmount(''); setError(''); }}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${userGradients[contact.id]} flex items-center justify-center text-lg font-bold text-white flex-shrink-0`}>
                {contact.avatar}
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-white">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.username}</p>
              </div>
              <div className="ml-auto text-gray-600 text-xl">›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
