import { Users } from 'lucide-react';
import GlassCard from './GlassCard';
import { friends } from '../data/posts';

export default function FriendsCard() {
  return (
    <GlassCard title="友链" icon={<Users size={18} />}>
      <div className="space-y-3">
        {friends.map((friend) => (
          <a
           key={friend.name}
           href={friend.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-slate-600/50 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
              {friend.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{friend.name}</p>
              <p className="text-slate-500 text-xs truncate">{friend.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </GlassCard>
  );
}
