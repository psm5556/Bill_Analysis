import type { MetricData } from '@/types';
import StatusBadge from './StatusBadge';

interface MetricCardProps {
  metric: MetricData;
  loading?: boolean;
}

export default function MetricCard({ metric, loading }: MetricCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-slate-400 text-sm">{metric.label}</span>
        <StatusBadge level={metric.signal} size="sm" />
      </div>
      {loading ? (
        <div className="h-8 bg-slate-700 rounded animate-pulse" />
      ) : (
        <div className="text-2xl font-bold text-white">
          {metric.value !== null ? `${metric.value}${metric.unit ?? ''}` : 'N/A'}
        </div>
      )}
      {metric.description && (
        <p className="text-xs text-slate-500 mt-2">{metric.description}</p>
      )}
      {metric.threshold && (
        <p className="text-xs text-slate-600 mt-1">기준: {metric.threshold}</p>
      )}
    </div>
  );
}
