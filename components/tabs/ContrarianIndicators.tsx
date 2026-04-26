'use client';
import { useState, useEffect } from 'react';
import { useFredApi } from '@/hooks/useFredApi';
import { FRED_SERIES } from '@/lib/constants';
import { toChartData } from '@/lib/fredApi';
import LineChart from '@/components/charts/LineChart';
import type { ChartDataPoint } from '@/types';

interface ContrarianIndicatorsProps {
  apiKey: string;
}

export default function ContrarianIndicators({ apiKey }: ContrarianIndicatorsProps) {
  const { fetchSeries, loading } = useFredApi(apiKey);
  const [vixData, setVixData] = useState<ChartDataPoint[]>([]);
  const [sofrData, setSofrData] = useState<ChartDataPoint[]>([]);
  const [hyData, setHyData] = useState<ChartDataPoint[]>([]);
  const [eurusdData, setEurusdData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (!apiKey) return;
    fetchSeries(FRED_SERIES.VIX, 52).then((d) => d && setVixData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.SOFR, 52).then((d) => d && setSofrData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.HY_OAS, 52).then((d) => d && setHyData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.EURUSD, 52).then((d) => d && setEurusdData(toChartData(d.observations)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const latestVix = vixData.at(-1)?.value ?? null;
  const latestSofr = sofrData.at(-1)?.value ?? null;
  const latestHy = hyData.at(-1)?.value ?? null;
  const latestEurusd = eurusdData.at(-1)?.value ?? null;

  const vixSignal = latestVix === null ? 'unknown' : latestVix >= 30 ? 'danger' : latestVix >= 20 ? 'warning' : 'safe';
  const hySignal = latestHy === null ? 'unknown' : latestHy >= 600 ? 'danger' : latestHy >= 400 ? 'warning' : 'safe';

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-2">🔄 역발상 지표 — 내러티브 vs 자금흐름</h2>
        <div className="bg-yellow-950/50 border border-yellow-800 rounded p-4 mb-5 text-sm">
          <p className="text-yellow-400 font-medium mb-1">현재 시장 내러티브:</p>
          <p className="text-slate-300 mb-3">&ldquo;휴전 순풍 + TGA 방출 기대 = 유동성 파티&rdquo;</p>
          <p className="text-red-400 font-medium mb-1">실제 자금 흐름 신호:</p>
          <p className="text-slate-300">CCB (통화 간 스왑 기준) 음(-)지속 + MOVE 상승 + ON RRP 감소</p>
          <div className="mt-3 bg-red-950/50 border border-red-800 rounded p-2">
            <p className="text-red-400 font-bold text-xs">⚠️ 괴리도: 높음 — FOMO 매수 경고 발동</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">EUR/USD (CCB 대리 지표)</h4>
              {latestEurusd && <span className="text-white font-bold">{latestEurusd.toFixed(4)}</span>}
            </div>
            <p className="text-slate-400 text-xs mb-3">EUR/USD 급락 + DXY 상승 = 달러 강세 (부족 가능). 실제 CCB 대리 측정.</p>
            {loading[FRED_SERIES.EURUSD] ? (
              <div className="h-40 bg-slate-800 rounded animate-pulse" />
            ) : eurusdData.length > 0 ? (
              <LineChart data={eurusdData} label="EUR/USD" color="#60a5fa" height={160} />
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
                {apiKey ? '데이터 없음' : 'API 키를 입력하면 차트가 표시됩니다'}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">VIX (주식시장 변동성)</h4>
              {latestVix && (
                <span className={`font-bold ${vixSignal === 'danger' ? 'text-red-400' : vixSignal === 'warning' ? 'text-yellow-400' : 'text-green-400'}`}>
                  {latestVix.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mb-3 space-y-0.5">
              <p>🟢 15 이하: 안일함 (역설적 위험)</p>
              <p>🟡 20~30: 주의 구간</p>
              <p>🔴 30+: 공포 국면</p>
            </div>
            {loading[FRED_SERIES.VIX] ? (
              <div className="h-40 bg-slate-800 rounded animate-pulse" />
            ) : vixData.length > 0 ? (
              <LineChart data={vixData} label="VIX" color="#f59e0b" height={160} />
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
                {apiKey ? '데이터 없음' : 'API 키를 입력하면 차트가 표시됩니다'}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">SOFR (레포 실제 차입 금리)</h4>
              {latestSofr && <span className="text-white font-bold">{latestSofr.toFixed(3)}%</span>}
            </div>
            <p className="text-slate-400 text-xs mb-3">FF금리 대비 20bp+ 상승 = 레포 스트레스. 2019년 9월 사태 선례 (~10% 도달).</p>
            {loading[FRED_SERIES.SOFR] ? (
              <div className="h-40 bg-slate-800 rounded animate-pulse" />
            ) : sofrData.length > 0 ? (
              <LineChart data={sofrData} label="SOFR (%)" color="#34d399" unit="%" height={160} />
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
                {apiKey ? '데이터 없음' : 'API 키를 입력하면 차트가 표시됩니다'}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">HY OAS (고수익채 스프레드)</h4>
              {latestHy && (
                <span className={`font-bold ${hySignal === 'danger' ? 'text-red-400' : hySignal === 'warning' ? 'text-yellow-400' : 'text-green-400'}`}>
                  {latestHy.toFixed(0)}bp
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mb-3 space-y-0.5">
              <p>🟢 400bp 미만: 낙관</p>
              <p>🟡 400~600bp: 주의</p>
              <p>🔴 600bp+: 공포 / 800bp+ 위기</p>
            </div>
            {loading[FRED_SERIES.HY_OAS] ? (
              <div className="h-40 bg-slate-800 rounded animate-pulse" />
            ) : hyData.length > 0 ? (
              <LineChart data={hyData} label="HY OAS (bp)" color="#f87171" unit="bp" height={160} />
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
                {apiKey ? '데이터 없음' : 'API 키를 입력하면 차트가 표시됩니다'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">📊 MOVE 지수 기준 (채권 VIX)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { range: '80 이하', desc: '안정', color: 'bg-green-900 text-green-300' },
            { range: '100~120', desc: '보통 긴장', color: 'bg-yellow-900 text-yellow-300' },
            { range: '120+', desc: '높은 스트레스', color: 'bg-orange-900 text-orange-300' },
            { range: '150+', desc: '위기 모드', color: 'bg-red-900 text-red-300' },
          ].map((m) => (
            <div key={m.range} className={`rounded p-3 text-center ${m.color}`}>
              <div className="font-bold">{m.range}</div>
              <div className="text-xs opacity-80">{m.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-3">* MOVE 지수 직접 API 없음. ICE BofAML 유료 데이터. Bloomberg/TradingView에서 확인 권장.</p>
      </div>
    </div>
  );
}
