import { useState } from 'react';
import { ArrowLeft, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Send() {
  const navigate = useNavigate();
  const { contacts, balance, sendMoney } = useStore();
  const [step, setStep] = useState<'contacts' | 'amount' | 'success'>('contacts');
  const [selected, setSelected] = useState<{ name: string; username: string; avatar: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectContact = (contact: typeof contacts[0]) => {
    setSelected(contact);
    setStep('amount');
  };

  const handleSend = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return setError('Enter a valid amount');
    if (num > balance) return setError('Insufficient balance');
    sendMoney(num, selected!.name);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] items-center justify-center px-5 pb-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Sent!</h2>
            <p className="text-gray-400">
              You sent <span className="text-white font-semibold">Ɛ{parseFloat(amount).toLocaleString()}</span> to{' '}
              <span className="text-white font-semibold">{selected?.name}</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-[#7c6af7] text-white font-semibold rounded-2xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (step === 'amount' && selected) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-24">
        <div className="flex items-center gap-4 px-5 pt-12 pb-6">
          <button onClick={() => setStep('contacts')} className="w-9 h-9 glass rounded-full flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Send Efi Monede</h1>
        </div>

        <div className="px-5 flex flex-col items-center gap-6">
          {/* Recipient */}
          <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3 w-full">
            <div className="w-10 h-10 rounded-full revolut-gradient flex items-center justify-center text-sm font-bold">
              {selected.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{selected.name}</p>
              <p className="text-xs text-gray-500">{selected.username}</p>
            </div>
          </div>

          {/* Amount */}
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
            <p className="text-sm text-gray-500">Balance: Ɛ{balance.toLocaleString()}</p>
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2 w-full justify-center">
            {[10, 50, 100, 500].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v.toString())}
                className="px-3 py-1.5 glass rounded-full text-sm text-gray-300 hover:bg-white/10"
              >
                Ɛ{v}
              </button>
            ))}
          </div>

          {/* Note */}
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="w-full glass rounded-2xl px-4 py-3 text-sm text-white bg-transparent outline-none placeholder-gray-600"
          />

          <button
            onClick={handleSend}
            disabled={!amount}
            className="w-full py-4 bg-[#7c6af7] disabled:opacity-40 text-white font-semibold rounded-2xl transition-opacity"
          >
            Send Ɛ{amount || '0'}
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
        <h1 className="text-lg font-semibold text-white">Send to</h1>
      </div>

      <div className="px-5 mb-4">
        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3">
          <Search size={16} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or @username"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600"
            autoFocus
          />
        </div>
      </div>

      <div className="px-5">
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Contacts</p>
        <div className="glass rounded-2xl overflow-hidden">
          {filtered.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <div className="w-10 h-10 rounded-full revolut-gradient flex items-center justify-center text-sm font-bold flex-shrink-0">
                {contact.avatar}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{contact.name}</p>
                <p className="text-xs text-gray-500">{contact.username}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
