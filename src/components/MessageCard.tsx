import { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import GlassCard from './GlassCard';
import { fetchMessages, addMessage, formatTime, type Message } from '../lib/messages';

const avatarOptions = ['😊', '🐱', '🦋', '🌙', '⭐', '🎵', '👤', '🐶', '🌸', '☕'];

export default function MessageCard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [avatar, setAvatar] = useState('😊');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMessages().then((msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    if (!newMessage.trim() || submitting) return;
    setSubmitting(true);
    await addMessage({
      name: newName.trim() || '匿名访客',
      content: newMessage.trim(),
      avatar,
    });
    // 重新拉取最新留言
    const fresh = await fetchMessages();
    setMessages(fresh);
    setNewName('');
    setNewMessage('');
    setSubmitting(false);
  };

  return (
    <GlassCard title="留言板" icon={<MessageCircle size={18} />}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-500 text-xs">
          {loading ? '加载中...' : `${messages.length} 条留言`}
        </span>
      </div>

      {/* Messages List - 增加高度适配手机 */}
      <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1 custom-scrollbar">
        {loading && messages.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">加载留言中...</p>
        ) : messages.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            还没有留言，来写第一条吧～
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-600/50 flex items-center justify-center text-sm shrink-0">
                {msg.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-xs font-medium">{msg.name}</span>
                  <span className="text-slate-600 text-xs">{formatTime(msg.createdAt)}</span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5 break-words">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Avatar picker */}
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {avatarOptions.map((a) => (
          <button
            key={a}
            onClick={() => setAvatar(a)}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all ${
              avatar === a ? 'bg-blue-500/30 ring-1 ring-blue-400 scale-110' : 'hover:bg-white/10'
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="你的昵称..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={20}
          className="w-full bg-slate-700/40 border border-slate-600/30 rounded-lg px-3 py-1.5 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-colors"
        />
        <textarea
          placeholder="写下你的想法..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          maxLength={500}
          rows={2}
          className="w-full bg-slate-700/40 border border-slate-600/30 rounded-lg px-3 py-1.5 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-colors resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-xs">{newMessage.length}/500</span>
          <button
            onClick={handleSubmit}
            disabled={submitting || !newMessage.trim()}
            className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm transition-colors flex items-center gap-1 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? '发送中...' : '发送留言'} <Send size={13} />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
