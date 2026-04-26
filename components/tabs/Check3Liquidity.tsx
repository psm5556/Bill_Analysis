'use client';
import { useState, useEffect } from 'react';
import { useFredApi } from '@/hooks/useFredApi';
import { FRED_SERIES } from '@/lib/constants';
import { toChartData } from '@/lib/fredApi';
import LineChart from '@/components/charts/LineChart';
import type { ChartDataPoint } from '@/types';

interface Check3LiquidityProps {
  apiKey: string;
}

export default function Check3Liquidity({ apiKey }: Check3LiquidityProps) {
  const { fetchSeries, loading } = useFredApi(apiKey);
  const [onRrpData, setOnRrpData] = useState<ChartDataPoint[]>([]);
  const [tgaData, setTgaData] = useState<ChartDataPoint[]>([]);
  const [reservesData, setReservesData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (!apiKey) return;
    fetchSeries(FRED_SERIES.ON_RRP, 52).then((d) => d && setOnRrpData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.TGA, 52).then((d) => d && setTgaData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.BANK_RESERVES, 52).then((d) => d && setReservesData(toChartData(d.observations)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const latestOnRrp = onRrpData.at(-1)?.value ?? null;
  const latestTga = tgaData.at(-1)?.value ?? null;
  const latestReserves = reservesData.at(-1)?.value ?? null;

  const onRrpSignal = latestOnRrp === null ? 'unknown' : latestOnRrp < 100 ? 'danger' : latestOnRrp < 300 ? 'warning' : 'safe';

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-2">💧 체크3: 유동성 완충재</h2>
        <p className="text-slate-400 text-sm mb-4">3단계 유동성 모니터링: ON RRP → TGA → 은행 지준</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className={`border rounded-lg p-4 ${onRrpSignal === 'danger' ? 'bg-red-950/50 border-red-800' : onRrpSignal === 'warning' ? 'bg-yellow-950/50 border-yellow-800' : 'bg-green-950/50 border-green-800'}`}>
            <div className={`font-bold mb-1 ${onRrpSignal === 'danger' ? 'text-red-400' : onRrpSignal === 'warning' ? 'text-yellow-400' : 'text-green-400'}`}>
              ON RRP
            </div>
            <div className="text-2xl font-bold text-white">
              {latestOnRrp !== null ? `$${latestOnRrp.toFixed(0)}B` : '로딩 중...'}
            </div>
            <div className="text-slate-400 text-xs mt-1">위험 수준: $100B 미만</div>
            <div className="text-slate-500 text-xs">머니마켓펀드 현금 보관소</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-blue-400 font-bold mb-1">TGA (재무부 당좌계좌)</div>
            <div className="text-2xl font-bold text-white">
              {latestTga !== null ? `$${latestTga.toFixed(0)}B` : '로딩 중...'}
            </div>
            <div className="text-slate-400 text-xs mt-1">정부의 Fed 당좌계좌</div>
            <div className="text-slate-500 text-xs">TGA 충전 = 시장 유동성 흡수</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-purple-400 font-bold mb-1">은행 지준</div>
            <div className="text-2xl font-bold text-white">
              {latestReserves !== null ? `$${(latestReserves / 1000).toFixed(1)}T` : '로딩 중...'}
            </div>
            <div className="text-slate-400 text-xs mt-1">은행의 Fed 예치금</div>
            <div className="text-slate-500 text-xs">시스템 유동성 기반</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-900 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">ON RRP 잔고 추이</h4>
            {loading[FRED_SERIES.ON_RRP] ? (
              <div className="h-40 bg-slate-800 rounded animate-pulse" />
            ) : onRrpData.length > 0 ? (
              <LineChart data={onRrpData} label="ON RRP ($B)" color="#34d399" unit="B" height={160} />
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
                {apiKey ? '데이터 없음' : 'API 키를 입력하면 차트가 표시됩니다'}
              </div>
            )}
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">TGA 잔고 추이</h4>
            {loading[FRED_SERIES.TGA] ? (
              <div className="h-40 bg-slate-800 rounded animate-pulse" />
            ) : tgaData.length > 0 ? (
              <LineChart data={tgaData} label="TGA ($B)" color="#60a5fa" unit="B" height={160} />
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
                {apiKey ? '데이터 없음' : 'API 키를 입력하면 차트가 표시됩니다'}
              </div>
            )}
          </div>
        </div>

        {/* Analogy Section */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">🚿 비유로 이해하기: 3단계 유동성 배관</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-blue-400 flex-shrink-0 font-bold">ON RRP</span>
              <p className="text-slate-300">= 머니마켓펀드가 Fed에 맡긴 현금. 수도꼭지처럼 즉시 공급 가능. 고갈되면 다음 단계로.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-yellow-400 flex-shrink-0 font-bold">TGA</span>
              <p className="text-slate-300">= 재무부 당좌계좌. 정부의 운영 자금. 충전(국채 발행) 시 시장 유동성 흡수. 방출 시 유동성 공급.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-400 flex-shrink-0 font-bold">은행 지준</span>
              <p className="text-slate-300">= 은행들의 Fed 예치금. 최후 안전판. 감소 시 은행간 자금 조달 금리 급등 위험 (2019년 9월 사태).</p>
            </div>
          </div>
        </div>

        {/* TGA Decomposition */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">🏦 TGA 변화 해석</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-red-950/30 border border-red-900 rounded p-3">
              <div className="text-red-400 font-bold mb-1">TGA 충전 (↑ 증가)</div>
              <ul className="text-slate-300 text-xs space-y-1">
                <li>• 국채 발행 → 시장 현금 흡수</li>
                <li>• 세금 납부 시기 (4월, 6월, 9월, 1월)</li>
                <li>• 시장 유동성 감소 → 금리 상승 압력</li>
              </ul>
            </div>
            <div className="bg-green-950/30 border border-green-900 rounded p-3">
              <div className="text-green-400 font-bold mb-1">TGA 방출 (↓ 감소)</div>
              <ul className="text-slate-300 text-xs space-y-1">
                <li>• 정부 지출 → 시장 현금 공급</li>
                <li>• 부채 한도 위기 시 긴급 방출</li>
                <li>• 시장 유동성 증가 → 단기 부양 효과</li>
              </ul>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-2">* TGA $300B 이하 = 재정 완충 부족. 부채 한도 협상 중 TGA 급감에 주의.</p>
        </div>

        {/* MOVE Index + SOFR Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">📊 MOVE 지수 (채권 VIX)</h4>
            <p className="text-slate-400 text-xs mb-3">국채 시장 내재 변동성. Bloomberg 유료 데이터.</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { range: '80 이하', desc: '안정', color: 'bg-green-900 text-green-300' },
                { range: '100~120', desc: '긴장', color: 'bg-yellow-900 text-yellow-300' },
                { range: '120~150', desc: '스트레스', color: 'bg-orange-900 text-orange-300' },
                { range: '150+', desc: '위기', color: 'bg-red-900 text-red-300' },
              ].map((m) => (
                <div key={m.range} className={`rounded p-2 text-center ${m.color}`}>
                  <div className="font-bold">{m.range}</div>
                  <div className="opacity-80">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">🏦 SOFR (레포 금리)</h4>
              {latestReserves && (
                <span className="text-slate-400 text-xs">지준: ${(latestReserves / 1000).toFixed(1)}T</span>
              )}
            </div>
            <p className="text-slate-400 text-xs mb-3">Fed 기준금리 대비 20bp+ 스프레드 = 레포 스트레스 신호.</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">정상 스프레드</span>
                <span className="text-green-400">±5bp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">주의 수준</span>
                <span className="text-yellow-400">10~20bp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">위험 수준</span>
                <span className="text-red-400">20bp+ (2019년 선례)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">🔄 유동성 배관 순차적 위험</h3>
          <div className="space-y-3 text-sm">
            {[
              { stage: '1단계', title: 'ON RRP 고갈', desc: '머니마켓펀드가 Fed 예치 → T-Bills 매입 전환. 재무부 단기 차입 일시 용이해짐.', color: 'yellow' },
              { stage: '2단계', title: 'ON RRP 소진', desc: '은행 지준 감소 시작 → 은행 간 레포 금리 위험한 수준으로 상승.', color: 'orange' },
              { stage: '3단계', title: '시스템 유동성 잠금', desc: '경매 수요 급락 → Fed 긴급 개입 필요 (2019년 선례 반복).', color: 'red' },
            ].map((stage) => {
              const colorMap: Record<string, string> = {
                yellow: 'bg-yellow-900 text-yellow-300',
                orange: 'bg-orange-900 text-orange-300',
                red: 'bg-red-900 text-red-300',
              };
              return (
                <div key={stage.stage} className="flex gap-3 bg-slate-800 rounded p-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap h-fit ${colorMap[stage.color]}`}>
                    {stage.stage}
                  </span>
                  <div>
                    <div className="text-white font-medium">{stage.title}</div>
                    <div className="text-slate-400 text-xs mt-1">{stage.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
