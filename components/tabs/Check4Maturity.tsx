'use client';
import { useState, useEffect } from 'react';
import { useFredApi } from '@/hooks/useFredApi';
import { FRED_SERIES, RATE_STRESS_SCENARIOS } from '@/lib/constants';
import { toChartData } from '@/lib/fredApi';
import LineChart from '@/components/charts/LineChart';
import type { ChartDataPoint } from '@/types';

interface Check4MaturityProps {
  apiKey: string;
}

export default function Check4Maturity({ apiKey }: Check4MaturityProps) {
  const { fetchSeries, loading } = useFredApi(apiKey);
  const [rate10yData, setRate10yData] = useState<ChartDataPoint[]>([]);
  const [rate30yData, setRate30yData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (!apiKey) return;
    fetchSeries(FRED_SERIES.RATE_10Y, 52).then((d) => d && setRate10yData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.RATE_30Y, 52).then((d) => d && setRate30yData(toChartData(d.observations)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const latestRate10y = rate10yData.at(-1)?.value ?? null;
  const latestRate30y = rate30yData.at(-1)?.value ?? null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-2">⏱️ 체크4: 만기 불일치 & 롤오버 위험</h2>
        <p className="text-slate-400 text-sm mb-4">WAM 하락, 롤오버 벽, 금리 시나리오 스트레스 테스트를 모니터링합니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-400 font-bold mb-1">WAM (가중평균만기)</div>
            <div className="text-2xl font-bold text-white">추적 중</div>
            <div className="text-slate-400 text-xs mt-1">역사적 평균: ~70개월</div>
            <div className="text-yellow-400 text-xs">주의 임계값: 65개월 미만</div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-blue-400 font-bold mb-1">10Y 금리</div>
            <div className="text-2xl font-bold text-white">
              {latestRate10y !== null ? `${latestRate10y.toFixed(2)}%` : '로딩 중...'}
            </div>
            <div className="text-slate-400 text-xs mt-1">글로벌 자산 가격 기준</div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-purple-400 font-bold mb-1">30Y 금리</div>
            <div className="text-2xl font-bold text-white">
              {latestRate30y !== null ? `${latestRate30y.toFixed(2)}%` : '로딩 중...'}
            </div>
            <div className="text-slate-400 text-xs mt-1">인플레 기대 및 재정 신뢰</div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 mb-5">
          <h4 className="text-white font-medium mb-2">10Y & 30Y 금리 추이</h4>
          {(loading[FRED_SERIES.RATE_10Y] || loading[FRED_SERIES.RATE_30Y]) ? (
            <div className="h-48 bg-slate-800 rounded animate-pulse" />
          ) : rate10yData.length > 0 ? (
            <LineChart data={rate10yData} label="10Y 금리 (%)" color="#60a5fa" unit="%" height={200} />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
              {apiKey ? '데이터 없음' : 'API 키를 입력하면 차트가 표시됩니다'}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">📊 12개월 롤오버 벽</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-400 mb-1">만기 도래 비율 (12개월)</div>
              <div className="text-xl font-bold text-white">추적 중</div>
              <div className="text-yellow-400 text-xs mt-1">위험 수준: 총 부채의 30% 이상</div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">의미</div>
              <div className="text-slate-300 text-xs">총 부채의 1/3이 1년 이내 만기 도래 시 급격한 금리 상승에 매우 취약.</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">📈 금리 시나리오 스트레스 테스트</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400">시나리오</th>
                  <th className="text-right py-2 px-3 text-slate-400">10Y 금리</th>
                  <th className="text-right py-2 px-3 text-slate-400">연간 추가 비용</th>
                  <th className="text-left py-2 px-3 text-slate-400">신호</th>
                </tr>
              </thead>
              <tbody>
                {RATE_STRESS_SCENARIOS.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-800/30' : ''}`}>
                    <td className="py-2 px-3 text-slate-200 font-medium">{row.scenario}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{row.rate}%</td>
                    <td className="py-2 px-3 text-right text-slate-300">{row.additionalCost}</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        row.signal === 'danger' ? 'bg-red-900 text-red-300' :
                        row.signal === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-green-900 text-green-300'
                      }`}>
                        {row.signal === 'danger' ? '🔴 위기' : row.signal === 'warning' ? '🟡 경고' : '🟢 관찰'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
          <h3 className="text-red-400 font-bold mb-2">⚠️ 기간 함정 역설 (Duration Trap)</h3>
          <p className="text-slate-300 text-sm">
            장기금리 높음 → 재무부가 장기 발행 회피 → 단기채 비중 상승 → 잦은 재융자 필요 →
            추가 금리 상승 → 기하급수적 비용 확대 → 구조적 취약성 심화.
          </p>
          <div className="mt-3 bg-slate-900 rounded p-3 text-xs text-slate-400">
            <strong className="text-slate-300">2023년 선례:</strong> Powell-Yellen의 공격적 &quot;Bills 피벗&quot;으로 장기금리 신호 억제에 단기 성공.
            그러나 구조적 재융자 위험이 영구 상승.
          </div>
        </div>
      </div>
    </div>
  );
}
