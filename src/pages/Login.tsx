import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Delete } from 'lucide-react';

const userColors: Record<string, string> = {
  stefi: 'from-[#7c6af7] to-[#a78bfa]',
  mara: 'from-[#ec4899] to-[#f9a8d4]',
  adriana: 'from-[#22c55e] to-[#86efac]',
};

export default function Login() {
  const navigate = useNavigate();
  const { users, login } = useStore();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
    setPin('');
    setError('');
  };

  const handleKey = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === 4) {
      const ok = login(selectedUser!, newPin);
      if (ok) {
        navigate('/');
      } else {
        setShake(true);
        setTimeout(() => {
          setPin('');
          setShake(false);
          setError('Wrong PIN. Try again.');
        }, 500);
      }
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError('');
  };

  const selectedUserObj = users.find((u) => u.id === selectedUser);

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] items-center justify-between py-16 px-5">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl revolut-gradient flex items-center justify-center text-3xl shadow-lg">
          💜
        </div>
        <h1 className="text-2xl font-bold text-white">Efi Monede</h1>
        <p className="text-sm text-gray-500">Choose your account</p>
      </div>

      {!selectedUser ? (
        /* User selection */
        <div className="w-full flex flex-col gap-4">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className="flex items-center gap-4 glass rounded-2xl px-5 py-4 hover:bg-white/10 transition-all active:scale-95"
            >
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${userColors[user.id]} flex items-center justify-center text-xl font-bold text-white shadow-lg`}
              >
                {user.avatar}
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-white">{user.name}</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
              <div className="ml-auto text-gray-600 text-xl">›</div>
            </button>
          ))}
        </div>
      ) : (
        /* PIN entry */
        <div className="w-full flex flex-col items-center gap-6">
          {/* User avatar */}
          <button
            onClick={() => { setSelectedUser(null); setPin(''); setError(''); }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${userColors[selectedUser]} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
            >
              {selectedUserObj?.avatar}
            </div>
            <p className="text-sm font-semibold text-white">{selectedUserObj?.name}</p>
            <p className="text-xs text-gray-500">Tap to change</p>
          </button>

          <p className="text-sm text-gray-400">Enter your PIN</p>

          {/* PIN dots */}
          <div className={`flex gap-4 transition-all ${shake ? 'animate-bounce' : ''}`}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all ${
                  i < pin.length ? 'bg-[#7c6af7] scale-110' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) => (
              <button
                key={i}
                onClick={() => {
                  if (key === '⌫') handleDelete();
                  else if (key !== '') handleKey(key);
                }}
                disabled={key === ''}
                className={`h-16 rounded-2xl text-xl font-semibold transition-all active:scale-90 ${
                  key === '' ? 'opacity-0 pointer-events-none' :
                  key === '⌫' ? 'glass text-gray-400 hover:bg-white/10' :
                  'glass text-white hover:bg-white/10'
                }`}
              >
                {key === '⌫' ? <Delete size={20} className="mx-auto" /> : key}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-700">© 2026 Efi Monede · Made with 💜</p>
    </div>
  );
}
