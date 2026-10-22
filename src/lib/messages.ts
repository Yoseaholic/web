export interface Message {
  id: string;
  name: string;
  content: string;
  avatar: string;
  createdAt: number;
}

// ─── 默认占位留言（API失败时显示）─────────────────────────
const defaultMessages: Message[] = [
  {
    id: 'seed-1',
    name: '陌生人',
    content: '你个人机',
    avatar: '😊',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'seed-2',
    name: '鹤川',
    content: '我当然是第一',
    avatar: '🐱',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
];

// ─── 调用自己服务器的 API ──────────────────────────────────
const API = '/api/messages';

export async function fetchMessages(): Promise<Message[]> {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } catch (e) {
    console.warn('API获取失败，显示默认留言', e);
    return defaultMessages.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export async function addMessage(
  input: Omit<Message, 'id' | 'createdAt'>
): Promise<Message> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || '提交失败');
  }
  return res.json();
}

export async function deleteMessage(id: string, adminToken: string): Promise<void> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-token': adminToken },
  });
  if (!res.ok) throw new Error('删除失败');
}

// ─── 时间格式化（完全不动）────────────────────────────────
export function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return new Date(timestamp).toLocaleDateString('zh-CN');
}