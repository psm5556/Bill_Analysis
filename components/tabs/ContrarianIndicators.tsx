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

interface JapanMofRow {
  period: string;
  bonds: number;
  usd: number;
}

export default function ContrarianIndicators({ apiKey }: ContrarianIndicatorsProps) {
  const { fetchSeries, loading } = useFredApi(apiKey);
  const [vixData, setVixData] = useState<ChartDataPoint[]>([]);
  const [sofrData, setSofrData] = useState<ChartDataPoint[]>([]);
  const [hyData, setHyData] = useState<ChartDataPoint[]>([]);
  const [eurusdData, setEurusdData] = useState<ChartDataPoint[]>([]);
  const [somaTbillsData, setSomaTbillsData] = useState<ChartDataPoint[]>([]);
  const [somaTotalData, setSomaTotalData] = useState<ChartDataPoint[]>([]);
  const [japanData, setJapanData] = useState<JapanMofRow[]>([]);
  const [japanLoading, setJapanLoading] = useState(false);
  const [japanError, setJapanError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) return;
    fetchSeries(FRED_SERIES.VIX, 52).then((d) => d && setVixData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.SOFR, 52).then((d) => d && setSofrData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.HY_OAS, 52).then((d) => d && setHyData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.EURUSD, 52).then((d) => d && setEurusdData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.SOMA_TBILLS, 12).then((d) => d && setSomaTbillsData(toChartData(d.observations)));
    fetchSeries(FRED_SERIES.SOMA_TOTAL, 12).then((d) => d && setSomaTotalData(toChartData(d.observations)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => {
    setJapanLoading(true);
    setJapanError(null);
    fetch('/api/japan-mof')
      .then((r) => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then((data: JapanMofRow[]) => setJapanData(Array.isArray(data) ? data : []))
      .catch((e) => setJapanError(String(e)))
      .finally(() => setJapanLoading(false));
  }, []);

  const latestVix = vixData.at(-1)?.value ?? null;
  const latestSofr = sofrData.at(-1)?.value ?? null;
  const latestHy = hyData.at(-1)?.value ?? null;
  const latestEurusd = eurusdData.at(-1)?.value ?? null;

  const vixSignal = latestVix === null ? 'unknown' : latestVix >= 30 ? 'danger' : latestVix >= 20 ? 'warning' : 'safe';
  const hySignal = latestHy === null ? 'unknown' : latestHy >= 600 ? 'danger' : latestHy >= 400 ? 'warning' : 'safe';

  // SOMA T-Bill ratio calculation
  const somaRows = somaTbillsData.map((tb, i) => {
    const total = somaTotalData[i]?.value ?? null;
    const pct = total && tb.value ? (tb.value / total) * 100 : null;
    return { date: tb.date, tbills: tb.value, total, pct };
  });

  return (
    <div className="space-y-6">
      {/* Market Narrative vs Flow */}
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

      {/* MOVE Index Reference */}
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

      {/* Fed SOMA T-Bill Detection */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-2">🏦 Fed SOMA T-Bill 집중 매입 감지</h3>
        <p className="text-slate-400 text-sm mb-4">
          Fed가 단기물(T-Bills)을 대규모로 매입하면 재무부의 단기 조달을 간접 지원하는 신호.
          SOMA 내 T-Bills 비중 급증은 &apos;스텔스 QE&apos;의 초기 징후.
        </p>

        {!apiKey ? (
          <div className="bg-slate-900 border border-slate-700 rounded p-4 text-center text-slate-500 text-sm">
            API 키를 설정하면 SOMA 데이터가 표시됩니다
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-3 text-slate-400">날짜</th>
                    <th className="text-right py-2 px-3 text-slate-400">T-Bills ($B)</th>
                    <th className="text-right py-2 px-3 text-slate-400">총 국채 ($B)</th>
                    <th className="text-right py-2 px-3 text-slate-400">T-Bills 비중</th>
                    <th className="text-left py-2 px-3 text-slate-400">신호</th>
                  </tr>
                </thead>
                <tbody>
                  {(loading[FRED_SERIES.SOMA_TBILLS] || loading[FRED_SERIES.SOMA_TOTAL]) ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="py-2 px-3">
                          <div className="h-5 bg-slate-700 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : somaRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-500">데이터 없음</td>
                    </tr>
                  ) : (
                    somaRows.slice(-8).map((row, i) => {
                      const signal = row.pct !== null && row.pct > 20 ? 'danger' : row.pct !== null && row.pct > 15 ? 'warning' : 'safe';
                      return (
                        <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                          <td className="py-2 px-3 text-slate-300">{row.date}</td>
                          <td className="py-2 px-3 text-right text-slate-300">
                            {row.tbills !== null ? `$${(row.tbills / 1000).toFixed(0)}B` : '-'}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-300">
                            {row.total !== null ? `$${(row.total / 1000).toFixed(0)}B` : '-'}
                          </td>
                          <td className={`py-2 px-3 text-right font-medium ${
                            signal === 'danger' ? 'text-red-400' :
                            signal === 'warning' ? 'text-yellow-400' : 'text-slate-300'
                          }`}>
                            {row.pct !== null ? `${row.pct.toFixed(1)}%` : '-'}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              signal === 'danger' ? 'bg-red-900 text-red-300' :
                              signal === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {signal === 'danger' ? '⚠️ 과다' : signal === 'warning' ? '주의' : '정상'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-yellow-950/50 border border-yellow-800 rounded p-3 text-xs">
              <p className="text-yellow-400 font-bold mb-1">📌 해석 가이드</p>
              <p className="text-slate-300">T-Bills 비중 15% 이상 → 주의 / 20% 이상 → 스텔스 QE 가능성 높음. Fed가 단기 조달을 간접 지원하는 신호.</p>
            </div>
          </>
        )}
      </div>

      {/* Japan MOF Weekly Flow */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-2">🇯🇵 일본 주간 해외채권 플로우</h3>
        <p className="text-slate-400 text-sm mb-4">
          일본 재무성(MOF) 주간 해외증권 매매 동향. 일본은 미국 최대 외국인 국채 보유국 중 하나.
          대규모 순매도는 미국 국채 수요 위협 신호.
        </p>

        {japanLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        ) : japanError ? (
          <div className="bg-red-950/50 border border-red-800 rounded p-3 text-sm text-red-300">
            ⚠️ 일본 MOF 데이터 로딩 실패: {japanError}
          </div>
        ) : japanData.length === 0 ? (
          <div className="bg-slate-900 border border-slate-700 rounded p-4 text-center text-slate-500 text-sm">
            데이터를 불러오는 중이거나 사용할 수 없습니다
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-3 text-slate-400">기간</th>
                    <th className="text-right py-2 px-3 text-slate-400">채권 순매수 (¥억)</th>
                    <th className="text-right py-2 px-3 text-slate-400">추정 USD ($B)</th>
                    <th className="text-left py-2 px-3 text-slate-400">신호</th>
                  </tr>
                </thead>
                <tbody>
                  {japanData.slice().reverse().map((row, i) => {
                    const signal = row.usd < -5 ? 'danger' : row.usd < 0 ? 'warning' : 'safe';
                    return (
                      <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                        <td className="py-2 px-3 text-slate-300">{row.period}</td>
                        <td className={`py-2 px-3 text-right font-medium ${row.bonds < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {row.bonds >= 0 ? '+' : ''}{row.bonds.toFixed(0)}
                        </td>
                        <td className={`py-2 px-3 text-right font-medium ${row.usd < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {row.usd >= 0 ? '+' : ''}{row.usd.toFixed(1)}B
                        </td>
                        <td className="py-2 px-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            signal === 'danger' ? 'bg-red-900 text-red-300' :
                            signal === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-green-900 text-green-300'
                          }`}>
                            {signal === 'danger' ? '⚠️ 매도' : signal === 'warning' ? '소폭 매도' : '매수'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 text-xs">
              * 출처: 일본 재무성 국제금융통계 (fcs_e.csv). 주간 해외증권 매매 동향. USD 환산은 150엔/달러 기준 추정치.
            </p>
          </>
        )}
      </div>

      {/* Institutional Bias Manual */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">🏢 기관별 편향 매뉴얼</h3>
        <div className="space-y-3 text-sm">
          {[
            {
              name: 'IMF',
              bias: '낙관 편향, 악화 인식 느림',
              signal: '방어적 언어 = 심각한 우려',
              color: 'blue',
            },
            {
              name: 'CBO',
              bias: '기계적, "현 정책 지속" 가정',
              signal: '시나리오 확장 = 불안 전달',
              color: 'blue',
            },
            {
              name: 'Federal Reserve',
              bias: '점진적, 커뮤니케이션 관리, 데이터 의존 위장',
              signal: '회의록 언어 변화 = 실제 감정 변화',
              color: 'yellow',
            },
            {
              name: 'Treasury',
              bias: '시장 안정 집중, 전략적 톤',
              signal: '바이백 확대 = 유동성 방어 모드 발동',
              color: 'yellow',
            },
            {
              name: '신용평가사',
              bias: '후행적, 정치적 민감도 높음',
              signal: '등급 변경 전 아웃룩(전망) 변화 주시',
              color: 'red',
            },
          ].map((inst, i) => {
            const colorClass = {
              blue: 'border-blue-700 bg-blue-950/30',
              yellow: 'border-yellow-700 bg-yellow-950/30',
              red: 'border-red-700 bg-red-950/30',
            }[inst.color];
            return (
              <div key={i} className={`border rounded-lg p-3 ${colorClass}`}>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-white min-w-24">{inst.name}</span>
                  <div>
                    <p className="text-slate-400">{inst.bias}</p>
                    <p className="text-yellow-400 text-xs mt-1">📡 신호: {inst.signal}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 bg-slate-900 rounded p-3 text-sm">
          <p className="text-yellow-400 font-bold">🎯 메타 원칙</p>
          <p className="text-slate-300 mt-1">
            &ldquo;기관 X는 절대 Y를 말하지 않는데, 지금 Y를 말한다&rdquo; {'>'} &ldquo;기관 X가 Y를 말한다&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
