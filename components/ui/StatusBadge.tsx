import type { SignalLevel } from '@/types';

interface StatusBadgeProps {
  level: SignalLevel;
  label?: string;
  size?: 'sm' | 'md';
}

const CONFIG: Record<SignalLevel, { color: string; icon: string; defaultLabel: string }> = {
  safe: { color: 'bg-green-900 text-green-300 border border-green-700', icon: '🟢', defaultLabel: '안전' },
  warning: { color: 'bg-yellow-900 text-yellow-300 border border-yellow-700', icon: '🟡', defaultLabel: '주의' },
  danger: { color: 'bg-red-900 text-red-300 border border-red-700', icon: '🔴', defaultLabel: '위험' },
  unknown: { color: 'bg-slate-800 text-slate-400 border border-slate-600', icon: '⚪', defaultLabel: '미확인' },
};

export default function StatusBadge({ level, label, size = 'md' }: StatusBadgeProps) {
  const cfg = CONFIG[level];
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1 rounded font-medium ${cfg.color} ${padding}`}>
      {cfg.icon} {label ?? cfg.defaultLabel}
    </span>
  );
}
