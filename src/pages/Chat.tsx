import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store/useStore';

const userColors: Record<string, string> = {
  stefi: '#7c6af7',
  mara: '#ec4899',
  adriana: '#22c55e',
};

const userGradients: Record<string, string> = {
  stefi: 'from-[#7c6af7] to-[#a78bfa]',
  mara: 'from-[#ec4899] to-[#f9a8d4]',
  adriana: 'from-[#22c55e] to-[#86efac]',
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Chat() {
  const { messages, sendMessage, getCurrentUser, users } = useStore();
  const currentUser = getCurrentUser();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentUser) return null;

  // Group messages by day
  let lastDay = '';

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-white/5">
        <h1 className="text-xl font-bold text-white">Group Chat</h1>
        <div className="flex items-center gap-1.5 mt-1">
          {users.map((u) => (
            <div
              key={u.id}
              className={`w-5 h-5 rounded-full bg-gradient-to-br ${userGradients[u.id]} flex items-center justify-center text-[9px] font-bold text-white`}
            >
              {u.avatar}
            </div>
          ))}
          <span className="text-xs text-gray-500 ml-1">Stefi, Mara & Adriana</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
            <div className="text-5xl">💬</div>
            <p className="text-sm text-gray-500">No messages yet.<br />Say hi! 👋</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const sender = users.find((u) => u.id === msg.fromUserId);
          const isMe = msg.fromUserId === currentUser.id;
          const day = formatDay(msg.date);
          const showDay = day !== lastDay;
          lastDay = day;

          const prevMsg = messages[i - 1];
          const showAvatar = !isMe && (i === 0 || prevMsg?.fromUserId !== msg.fromUserId);

          return (
            <div key={msg.id}>
              {showDay && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full">{day}</span>
                </div>
              )}
              <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar placeholder for alignment */}
                {!isMe && (
                  <div className={`w-7 h-7 flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${userGradients[msg.fromUserId]} flex items-center justify-center text-xs font-bold text-white`}
                    >
                      {sender?.avatar}
                    </div>
                  </div>
                )}
                <div className={`max-w-[72%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {showAvatar && !isMe && (
                    <span className="text-[10px] text-gray-500 mb-1 ml-1">{sender?.name}</span>
                  )}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'rounded-br-sm text-white'
                        : 'rounded-bl-sm bg-white/8 text-white'
                    }`}
                    style={
                      isMe
                        ? { background: userColors[currentUser.id] ?? '#7c6af7' }
                        : undefined
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-600 mt-0.5 mx-1">{formatTime(msg.date)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-[64px] left-0 right-0 max-w-md mx-auto px-4 py-3 bg-[#0a0a0a] border-t border-white/5">
        <div className="flex items-center gap-3 glass rounded-2xl px-4 py-2.5">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Message the group..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity"
            style={{ background: userColors[currentUser.id] ?? '#7c6af7' }}
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
