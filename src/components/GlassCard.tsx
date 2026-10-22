import { ReactNode } from 'react';

interface GlassCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ title, icon, children, className = '' }: GlassCardProps) {
  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-400">{icon}</span>
        <h3 className="text-white font-semibold text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}
