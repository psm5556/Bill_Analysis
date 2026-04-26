'use client';
import { CBO_PROJECTIONS } from '@/lib/constants';
import BarChart from '@/components/charts/BarChart';

export default function Check2Interest() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-2">💸 체크2: 이자 부담 vs 부채 증가율</h2>
        <p className="text-slate-400 text-sm mb-4">이자 비용이 원금보다 1.5~2배 빠르게 성장 시 &quot;악순환&quot; 메커니즘 작동.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
            <div className="text-red-400 font-bold mb-1">⚠️ 역사적 이정표</div>
            <div className="text-lg font-bold text-white">순 이자 {'>'} 국방비</div>
            <div className="text-slate-400 text-sm mt-1">$952B vs ~$886B</div>
            <div className="text-red-400 text-xs mt-2">미국 예산 사상 최초</div>
          </div>
          <div className="bg-yellow-950/50 border border-yellow-800 rounded-lg p-4">
            <div className="text-yellow-400 font-bold mb-1">📊 2026년 순 이자</div>
            <div className="text-2xl font-bold text-white">$1.0조</div>
            <div className="text-slate-400 text-sm mt-1">GDP 대비 3.3%</div>
          </div>
          <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
            <div className="text-red-400 font-bold mb-1">🎯 위험 임계값</div>
            <div className="text-lg font-bold text-white">세입의 25%</div>
            <div className="text-slate-400 text-sm mt-1">CBO 예측: 2030년대 중반</div>
            <div className="text-red-400 text-xs mt-2">&quot;이자 비용 나선&quot; 자기 지속 구간</div>
          </div>
        </div>

        {/* Spending Comparison */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">🔴 2025년 순 이자 vs 주요 지출 비교 ($B)</h3>
          <div className="space-y-2">
            {[
              { label: '순 이자 비용', value: 952, pct: 100, color: 'bg-red-500' },
              { label: '국방비', value: 886, pct: 93, color: 'bg-orange-500' },
              { label: '메디케어', value: 874, pct: 92, color: 'bg-yellow-500' },
              { label: '메디케이드', value: 618, pct: 65, color: 'bg-blue-500' },
              { label: '사회보장 (노령)', value: 1350, pct: 100, color: 'bg-green-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-slate-400">${item.value}B</span>
                </div>
                <div className="h-4 bg-slate-800 rounded overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded`}
                    style={{ width: `${Math.min(item.value / 1400 * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-3">
            * 사회보장은 전체 지출($1.35T) 기준. 이자 비용이 국방비와 메디케어를 초과하는 역사적 상황.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">📈 CBO 10년 전망 ($B)</h3>
          <BarChart
            labels={CBO_PROJECTIONS.map((r) => r.year)}
            datasets={[
              { label: '순 이자 ($B)', data: CBO_PROJECTIONS.map((r) => r.interest), color: '#ef4444' },
            ]}
            unit="B"
            height={220}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">회계연도</th>
                <th className="text-right py-2 px-3 text-slate-400">순 이자</th>
                <th className="text-right py-2 px-3 text-slate-400">GDP 비율</th>
                <th className="text-right py-2 px-3 text-slate-400">세입 비율</th>
                <th className="text-left py-2 px-3 text-slate-400">상태</th>
              </tr>
            </thead>
            <tbody>
              {CBO_PROJECTIONS.map((row, i) => {
                const signal = row.revenueRatio >= 25 ? 'danger' : row.revenueRatio >= 20 ? 'warning' : 'safe';
                return (
                  <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                    <td className="py-2 px-3 text-slate-200 font-medium">{row.year}</td>
                    <td className="py-2 px-3 text-right text-slate-300">${row.interest}B</td>
                    <td className="py-2 px-3 text-right text-slate-300">{row.gdpRatio}%</td>
                    <td className={`py-2 px-3 text-right font-medium ${
                      signal === 'danger' ? 'text-red-400' :
                      signal === 'warning' ? 'text-yellow-400' : 'text-green-400'
                    }`}>{row.revenueRatio}%</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        signal === 'danger' ? 'bg-red-900 text-red-300' :
                        signal === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {signal === 'danger' ? '위기' : signal === 'warning' ? '주의' : '관찰'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
