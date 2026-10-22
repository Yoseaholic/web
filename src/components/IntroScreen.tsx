import { useEffect, useRef, useState } from 'react';

interface IntroScreenProps {
  onFinish: () => void;
}

/**
 * 雨夜风格开场动画
 * 阶段：
 *  0 ~ 1.5s   雨滴落下 + 星光浮现
 *  1.5 ~ 2.8s 涟漪扩散 + 标题浮现
 *  2.8 ~ 3.8s 副标题 + 装饰线
 *  3.8 ~ 4.6s 淡出进入主页
 */
export default function IntroScreen({ onFinish }: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // 时间线
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase(1), 100);
    const t2 = window.setTimeout(() => setPhase(2), 1500);
    const t3 = window.setTimeout(() => setPhase(3), 2800);
    const t4 = window.setTimeout(() => setPhase(4), 3800);
    const t5 = window.setTimeout(() => setLeaving(true), 4200);
    const t6 = window.setTimeout(onFinish, 5000);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
    };
  }, [onFinish]);

  // Canvas 雨滴 + 星光
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    // 雨滴
    type Drop = { x: number; y: number; len: number; speed: number; alpha: number };
    const drops: Drop[] = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h - h,
      len: 12 + Math.random() * 18,
      speed: 4 + Math.random() * 6,
      alpha: 0.15 + Math.random() * 0.25,
    }));

    // 星光
    type Star = { x: number; y: number; r: number; alpha: number; twinkle: number };
    const stars: Star[] = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 1.5,
      alpha: 0.3 + Math.random() * 0.5,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      // 星光
      for (const s of stars) {
        s.twinkle += 0.02;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(191, 219, 254, ${a})`;
        ctx.fill();
      }

      // 雨滴
      for (const d of drops) {
        d.y += d.speed;
        if (d.y > h + d.len) {
          d.y = -d.len - Math.random() * 200;
          d.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 0.8, d.y + d.len);
        ctx.strokeStyle = `rgba(174, 194, 224, ${d.alpha})`;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // 中心光晕（phase >= 1 时出现）
      if (t > 1.0) {
        const glowT = Math.min(1, (t - 1.0) / 1.5);
        const glowR = 200 + glowT * 250;
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        glow.addColorStop(0, `rgba(96, 165, 250, ${0.12 * glowT})`);
        glow.addColorStop(0.5, `rgba(103, 232, 249, ${0.06 * glowT})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t < 5) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const skip = () => {
    setLeaving(true);
    setTimeout(onFinish, 700);
  };

  return (
    <div className={`intro-rainy ${leaving ? 'intro-rainy--leave' : ''}`}>
      {/* 雨滴 + 星光 Canvas */}
      <canvas ref={canvasRef} className="intro-rainy-canvas" />

      {/* 深色遮罩 */}
      <div className="intro-rainy-overlay" />

      {/* 中心内容 */}
      <div className="intro-rainy-stage">
        {/* 涟漪圆环 */}
        <div className={`intro-rainy-ripple intro-rainy-ripple-1 ${phase >= 2 ? 'intro-rainy-ripple--show' : ''}`} />
        <div className={`intro-rainy-ripple intro-rainy-ripple-2 ${phase >= 2 ? 'intro-rainy-ripple--show' : ''}`} />
        <div className={`intro-rainy-ripple intro-rainy-ripple-3 ${phase >= 2 ? 'intro-rainy-ripple--show' : ''}`} />

        {/* 标题 */}
        <h1 className={`intro-rainy-title ${phase >= 2 ? 'intro-rainy-title--show' : ''}`}>
          <span className="brand-gradient">鹤川</span>
        </h1>

        {/* 装饰线 */}
        <div className={`intro-rainy-divider ${phase >= 3 ? 'intro-rainy-divider--show' : ''}`} />

        {/* 副标题 */}
        <p className={`intro-rainy-tagline ${phase >= 3 ? 'intro-rainy-tagline--show' : ''}`}>
          「 愿你我都能在代码与文字中，找到属于自己的星辰大海 」
        </p>

        {/* 加载点 */}
        <div className={`intro-rainy-dots ${phase >= 1 ? 'intro-rainy-dots--show' : ''}`}>
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* 跳过 */}
      <button className="intro-rainy-skip" onClick={skip}>
        跳过 →
      </button>
    </div>
  );
}
