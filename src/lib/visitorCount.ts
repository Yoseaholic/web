/**
 * ============================================================
 *  👥 访客计数器
 * ============================================================
 *  每位访客首次进入网站时计数 +1（同一浏览器会话只 +1 一次）。
 *  
 *  默认使用免费的 Abacus 计数 API（无需注册，无使用限制）：
 *  https://abacus.jasoncameron.dev/
 *  
 *  全球访客都会被统计到同一个计数器，所有人看到的数字都一样。
 *  
 *  如果你想换一套独立的计数（比如重置），改下面的 NAMESPACE 和 KEY 即可。
 *  如果想用自己的服务（如 Supabase / 自建后端），替换 incrementAndGetVisitors 函数即可。
 * ============================================================
 */

// 命名空间 + 键名（独一无二的字符串即可）。
// 想从 0 重新计数？改个新的 KEY 名字就行。
const NAMESPACE = 'hechuan-blog';
const KEY = 'visitors-2026';

const SESSION_KEY = 'visitor_counted_session';
const LOCAL_COUNT_KEY = 'visitor_count_local_v2';

/**
 * 获取并 +1 访客数。每个浏览器会话只 +1 一次。
 */
export async function incrementAndGetVisitors(): Promise<number> {
  const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

  // Abacus API: hit = +1 并返回新值; get = 仅查询
  const endpoint = alreadyCounted
    ? `https://abacus.jasoncameron.dev/get/${NAMESPACE}/${KEY}`
    : `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, '1');
        localStorage.setItem(LOCAL_COUNT_KEY, String(data.value));
        return data.value;
      }
    }
  } catch (e) {
    console.warn('Abacus failed, using local fallback', e);
  }

  // 本地兜底（网络出错时）
  let count = Number(localStorage.getItem(LOCAL_COUNT_KEY)) || 1;
  if (!alreadyCounted) {
    count += 1;
    localStorage.setItem(LOCAL_COUNT_KEY, String(count));
    sessionStorage.setItem(SESSION_KEY, '1');
  }
  return count;
}

/**
 * 格式化访客数（>= 1000 显示为 "1.2k"，>= 10000 显示为 "1.5w"）
 */
export function formatVisitorCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}
