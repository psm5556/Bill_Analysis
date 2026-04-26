'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartDataPoint } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface LineChartProps {
  data: ChartDataPoint[];
  label: string;
  color?: string;
  unit?: string;
  height?: number;
}

export default function LineChart({ data, label, color = '#3b82f6', unit = '', height = 200 }: LineChartProps) {
  const displayData = data.slice(-52);

  const chartData = {
    labels: displayData.map((d) => d.date),
    datasets: [
      {
        label,
        data: displayData.map((d) => d.value),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => `${(ctx.parsed.y ?? 0).toFixed(2)}${unit}`,
        },
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#94a3b8',
        bodyColor: '#f1f5f9',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#64748b',
          maxTicksLimit: 6,
          font: { size: 11 },
        },
        grid: { color: '#1e293b' },
      },
      y: {
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (v: unknown) => `${v}${unit}`,
        },
        grid: { color: '#1e293b' },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
