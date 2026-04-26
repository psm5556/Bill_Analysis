'use client';
import { useState, useEffect } from 'react';
import { fetchFredSeries } from '@/lib/fredApi';
import { FRED_SERIES, THRESHOLDS } from '@/lib/constants';
import type { SignalLevel } from '@/types';

interface LiveMetrics {
  onRrp: number | null;
  onRrpDate: string | null;
  rate10y: number | null;
  rate30y: number | null;
  vix: number | null;
  sofr: number | null;
  hyOas: number | null;
  totalDebt: number | null;
  netInterest: number | null;
}

function getOnRrpSignal(v: number | null): SignalLevel {
  if (v === null) return 'unknown';
  if (v < THRESHOLDS.ON_RRP_DANGER) return 'danger';
  if (v < 300) return 'warning';
  return 'safe';
}
function getVixSignal(v: number | null): SignalLevel {
  if (v === null) return 'unknown';
  if (v >= THRESHOLDS.VIX_FEAR) return 'danger';
  if (v >= THRESHOLDS.VIX_CAUTION) return 'warning';
  return 'safe';
}
function getHySignal(v: number | null): SignalLevel {
  if (v === null) return 'unknown';
  if (v >= THRESHOLDS.HY_OAS_DANGER) return 'danger';
  if (v >= THRESHOLDS.HY_OAS_CAUTION) return 'warning';
  return 'safe';
}
function calcStressScore(m: LiveMetrics): number {
  let score = 30;
  if (m.onRrp !== null) {
    if (m.onRrp < 100) score += 30;
    else if (m.onRrp < 300) score += 15;
  }
  if (m.vix !== null) {
    if (m.vix >= 30) score += 20;
    else if (m.vix >= 20) score += 10;
  }
  if (m.hyOas !== null) {
    if (m.hyOas >= 600) score += 20;
    else if (m.hyOas >= 400) score += 10;
  }
  if (m.rate10y !== null && m.rate10y >= 5.0) score += 10;
  return Math.min(score, 100);
}

const SIGNAL_CLASS: Record<SignalLevel, string> = {
  safe: 'text-green-400',
  warning: 'text-yellow-400',
  danger: 'text-red-400',
  unknown: 'text-slate-500',
};
const BADGE_CLASS: Record<SignalLevel, string> = {
  safe: 'bg-green-950/50 border-green-800',
  warning: 'bg-yellow-950/50 border-yellow-800',
  danger: 'bg-red-950/50 border-red-800',
  unknown: 'bg-slate-900 border-slate-700',
};

export default function SummaryOpinion() {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    onRrp: null, onRrpDate: null, rate10y: null, rate30y: null, vix: null, sofr: null, hyOas: null, totalDebt: null, netInterest: null,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [memo, setMemo] = useState('');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('dashboardMemo') : null;
    if (saved) setMemo(saved);
  }, []);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      try {
        const [onRrpData, rate10yData, rate30yData, vixData, sofrData, hyData, debtData, interestData] = await Promise.allSettled([
          fetchFredSeries(FRED_SERIES.ON_RRP, '', 5),
          fetchFredSeries(FRED_SERIES.RATE_10Y, '', 5),
          fetchFredSeries(FRED_SERIES.RATE_30Y, '', 5),
          fetchFredSeries(FRED_SERIES.VIX, '', 5),
          fetchFredSeries(FRED_SERIES.SOFR, '', 5),
          fetchFredSeries(FRED_SERIES.HY_OAS, '', 5),
          fetchFredSeries(FRED_SERIES.TOTAL_DEBT, '', 5),
          fetchFredSeries(FRED_SERIES.NET_INTEREST, '', 5),
        ]);

        setMetrics({
          onRrp: onRrpData.status === 'fulfilled' ? onRrpData.value.latestValue : null,
          onRrpDate: onRrpData.status === 'fulfilled' ? onRrpData.value.latestDate : null,
          rate10y: rate10yData.status === 'fulfilled' ? rate10yData.value.latestValue : null,
          rate30y: rate30yData.status === 'fulfilled' ? rate30yData.value.latestValue : null,
          vix: vixData.status === 'fulfilled' ? vixData.value.latestValue : null,
          sofr: sofrData.status === 'fulfilled' ? sofrData.value.latestValue : null,
          hyOas: hyData.status === 'fulfilled' ? hyData.value.latestValue : null,
          totalDebt: debtData.status === 'fulfilled' ? debtData.value.latestValue : null,
          netInterest: interestData.status === 'fulfilled' ? interestData.value.latestValue : null,
        });
        setLastUpdated(new Date().toLocaleString('ko-KR'));
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    loadMetrics();
  }, []);

  const stressScore = calcStressScore(metrics);
  const onRrpSignal = getOnRrpSignal(metrics.onRrp);
  const vixSignal = getVixSignal(metrics.vix);
  const hySignal = getHySignal(metrics.hyOas);

  const stressColor = stressScore >= 70 ? 'text-red-400' : stressScore >= 40 ? 'text-yellow-400' : 'text-green-400';
  const stressBg = stressScore >= 70 ? 'bg-red-950/50 border-red-800' : stressScore >= 40 ? 'bg-yellow-950/50 border-yellow-800' : 'bg-green-950/50 border-green-800';

  const netInterestGdp = metrics.netInterest !== null
    ? ((metrics.netInterest / 1000) / 28000 * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Dashboard Intro */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-2">🏛️ 이 대시보드는 무엇인가요?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-900 rounded p-3">
            <div className="text-blue-400 font-bold mb-1">📊 목적</div>
            <p className="text-slate-300">미국 국채 시장의 수요 붕괴 위험을 실시간으로 모니터링. 경매 결과 + 유동성 지표 + 해외 자금 흐름을 통합 분석.</p>
          </div>
          <div className="bg-slate-900 rounded p-3">
            <div className="text-yellow-400 font-bold mb-1">⚠️ 왜 중요한가</div>
            <p className="text-slate-300">미국 정부는 매년 수조 달러의 국채를 발행해야 합니다. 경매 수요가 무너지면 금리 급등 → 재정 위기 → 글로벌 금융 충격.</p>
          </div>
          <div className="bg-slate-900 rounded p-3">
            <div className="text-green-400 font-bold mb-1">🎯 사용 방법</div>
            <p className="text-slate-300">매일 10분. 경매 결과 확인 → ON RRP 잔고 변화 → 금리 움직임 → 종합 의견 탭에서 스트레스 점수 확인.</p>
          </div>
        </div>
      </div>

      {/* KPI Cards + Stress Score */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">⭐ 오늘의 종합 의견 (초보자용)</h2>
          <div className="text-xs text-slate-500">
            {loading ? '로딩 중...' : lastUpdated ? `🟢 실시간 | ${lastUpdated}` : '⚪ 데이터 없음'}
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-400 text-xs mb-1">🏛️ 총 국채 잔액</div>
            {loading ? (
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-bold text-white">
                  {metrics.totalDebt !== null ? `$${(metrics.totalDebt / 1000).toFixed(1)}T` : 'N/A'}
                </div>
                <div className="text-slate-500 text-xs mt-1">GDP 대비 ~120%</div>
              </>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-400 text-xs mb-1">💸 순이자/GDP</div>
            {loading ? (
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${netInterestGdp && parseFloat(netInterestGdp) >= 3.5 ? 'text-red-400' : 'text-white'}`}>
                  {netInterestGdp ? `${netInterestGdp}%` : 'N/A'}
                </div>
                <div className="text-slate-500 text-xs mt-1">위험: 4% 초과</div>
              </>
            )}
          </div>

          <div className={`border rounded-lg p-4 ${BADGE_CLASS[onRrpSignal]}`}>
            <div className="text-slate-400 text-xs mb-1">💧 ON RRP 잔고</div>
            {loading ? (
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${SIGNAL_CLASS[onRrpSignal]}`}>
                  {metrics.onRrp !== null ? `$${metrics.onRrp.toFixed(0)}B` : 'N/A'}
                </div>
                <div className="text-slate-500 text-xs mt-1">위험: $100B 미만</div>
              </>
            )}
          </div>

          <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
            <div className="text-slate-400 text-xs mb-1">📊 단기채 비중</div>
            {loading ? (
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-400">22%</div>
                <div className="text-slate-500 text-xs mt-1">목표: 15~20%</div>
              </>
            )}
          </div>
        </div>

        {/* Stress Score + other metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
          <div className={`border rounded-lg p-4 ${stressBg}`}>
            <div className="text-slate-400 text-xs mb-1">📊 종합 스트레스 점수</div>
            {loading ? (
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            ) : (
              <div className={`text-3xl font-bold ${stressColor}`}>{stressScore} <span className="text-base font-normal text-slate-400">/ 100</span></div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-400 text-xs mb-1">📈 10Y / 30Y 금리</div>
            {loading ? (
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${metrics.rate10y !== null && metrics.rate10y >= 5.0 ? 'text-red-400' : 'text-white'}`}>
                  {metrics.rate10y !== null ? `${metrics.rate10y.toFixed(3)}%` : 'N/A'}
                </div>
                <div className="text-slate-500 text-xs mt-1">30Y: {metrics.rate30y !== null ? `${metrics.rate30y.toFixed(3)}%` : 'N/A'}</div>
              </>
            )}
          </div>

          <div className={`border rounded-lg p-4 ${BADGE_CLASS[vixSignal]}`}>
            <div className="text-slate-400 text-xs mb-1">📉 VIX / HY OAS</div>
            {loading ? (
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${SIGNAL_CLASS[vixSignal]}`}>
                  {metrics.vix !== null ? metrics.vix.toFixed(1) : 'N/A'}
                </div>
                <div className={`text-xs mt-1 ${SIGNAL_CLASS[hySignal]}`}>
                  HY: {metrics.hyOas !== null ? `${metrics.hyOas.toFixed(0)}bp` : 'N/A'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3-line summary */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">📋 3줄 일일 요약</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-red-400 flex-shrink-0">①</span>
              <span className="text-slate-300">단기채 비중이 TBAC 권고를 초과 중 (22% vs 15~20% 목표). 롤오버 위험 축적.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400 flex-shrink-0">②</span>
              <span className="text-slate-300">
                ON RRP 잔고{metrics.onRrp !== null ? ` $${metrics.onRrp.toFixed(0)}B` : ''} — {onRrpSignal === 'danger' ? '🔴 위험 수준 도달' : onRrpSignal === 'warning' ? '🟡 감소 추세 주의' : '🟢 현재 안정권'}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400 flex-shrink-0">③</span>
              <span className="text-slate-300">
                10Y 금리{metrics.rate10y !== null ? ` ${metrics.rate10y.toFixed(3)}%` : ''} — {metrics.rate10y !== null && metrics.rate10y >= 5.0 ? '🔴 5% 이상 고금리' : metrics.rate10y !== null && metrics.rate10y >= 4.5 ? '🟡 상승 압력' : '🟢 관찰'}. HY OAS{metrics.hyOas !== null ? ` ${metrics.hyOas.toFixed(0)}bp` : ''} 신용 리스크 모니터링.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
          <h3 className="text-red-400 font-bold mb-3">⚠️ 주의사항</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• 공식 발표(정부/IMF)는 후행적이며 낙관 편향. 현금이 사라진 후 &quot;돈 풀기&quot; 헤드라인이 나옵니다.</li>
            <li>• 단일 지표 베팅 금지. 최소 3개 지표 동시 확인이 필수입니다.</li>
            <li>• FOMO(두려움으로 인한 매수)가 가장 위험한 신호입니다.</li>
          </ul>
        </div>
      </div>

      {/* 3 Scenarios as TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">🎯 3가지 시나리오</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 w-1/4">항목</th>
                <th className="text-left py-2 px-3 text-green-400">🟢 강세 (Bull)</th>
                <th className="text-left py-2 px-3 text-yellow-400">🟡 기본 (Base)</th>
                <th className="text-left py-2 px-3 text-red-400">🔴 약세 (Bear)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '핵심 내러티브', bull: 'TGA 방출 + 바이백 유동성 파티', base: '구조적 약세 출현. 한 자릿수 변동성 확장', bear: '신용 악화. 민간 부문 소진 → 등급 강등 가능' },
                { label: 'Bid-to-Cover', bull: '2.5x 이상', base: '2.0~2.5x', bear: '2.0x 미만 (D등급)' },
                { label: 'ON RRP', bull: '안정 / 상승', base: '완만한 감소', bear: '$100B 이하 위험' },
                { label: '10Y 금리', bull: '4.2% 이하', base: '4.2~5.0%', bear: '5.0% 초과 + 상승 지속' },
                { label: 'MOVE 지수', bull: '80 이하', base: '100~120', bear: '120+ (위기 모드)' },
                { label: '딜러 보유', bull: '15% 미만', base: '15~25%', bear: '25%+ (강제 매수)' },
                { label: 'CCB 기준 (EUR/USD)', bull: '안정 / 달러 약세', base: '보합', bear: 'CCB 대폭 음(-). 달러 부족' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                  <td className="py-2 px-3 text-slate-300 font-medium">{row.label}</td>
                  <td className="py-2 px-3 text-green-300 text-xs">{row.bull}</td>
                  <td className="py-2 px-3 text-yellow-300 text-xs">{row.base}</td>
                  <td className="py-2 px-3 text-red-300 text-xs">{row.bear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Watchlist */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">📅 주간 주목 목록</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { icon: '📊', item: '국채 경매 결과 (10Y/30Y Bid-to-Cover 중점)' },
            { icon: '💰', item: 'ON RRP 잔고 주간 변화' },
            { icon: '🏦', item: '납세 시기 전후 TGA 궤적' },
            { icon: '🎤', item: 'Fed 연설자 발언 및 FOMC 의사록' },
            { icon: '📅', item: '캘린더 클러스터 경고 날짜' },
          ].map((item, i) => (
            <div key={i} className="flex gap-2 bg-slate-900 rounded p-3">
              <span>{item.icon}</span>
              <span className="text-slate-300">{item.item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily 10-min Checklist */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">⏰ 일일 10분 체크리스트</h3>
        <div className="space-y-3">
          {[
            { step: 1, action: '경매 결과 확인', detail: 'C 등급 이하 = 주의, 꼬리 3bp+ = 경고' },
            { step: 2, action: 'ON RRP/TGA 잔고 변화', detail: '$100B 임계값 기준 ON RRP 모니터링' },
            { step: 3, action: '10Y/30Y 금리 움직임', detail: '일일 ±10bp 변동 시 원인 파악' },
            { step: 4, action: 'MOVE 지수 확인', detail: '120+ 시 시장 긴장 신호' },
            { step: 5, action: '예정 이벤트 점검', detail: '클러스터 날짜에 특별 주의' },
            { step: 6, action: '종합 의견 재평가', detail: '포트폴리오 영향 검토' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 bg-slate-900 rounded p-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{item.action}</div>
                <div className="text-slate-400 text-xs">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beginner Action Guide */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">🚦 초보자 액션 가이드</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-green-950/50 border border-green-800 rounded p-4">
            <div className="text-green-400 font-bold mb-2">🟢 안전 구간</div>
            <ul className="text-slate-300 space-y-1 text-xs">
              <li>• BtC 2.5x 이상</li>
              <li>• ON RRP $300B 이상</li>
              <li>• 10Y 4.2% 이하</li>
              <li>• VIX 20 이하</li>
            </ul>
            <p className="text-green-400 text-xs mt-2 font-medium">→ 정기 모니터링 유지</p>
          </div>
          <div className="bg-yellow-950/50 border border-yellow-800 rounded p-4">
            <div className="text-yellow-400 font-bold mb-2">🟡 주의 구간</div>
            <ul className="text-slate-300 space-y-1 text-xs">
              <li>• BtC 2.0~2.5x</li>
              <li>• ON RRP $100~300B</li>
              <li>• 10Y 4.2~5.0%</li>
              <li>• VIX 20~30</li>
            </ul>
            <p className="text-yellow-400 text-xs mt-2 font-medium">→ 3개 이상 동시 확인 후 판단</p>
          </div>
          <div className="bg-red-950/50 border border-red-800 rounded p-4">
            <div className="text-red-400 font-bold mb-2">🔴 위험 구간</div>
            <ul className="text-slate-300 space-y-1 text-xs">
              <li>• BtC 2.0x 미만</li>
              <li>• ON RRP $100B 미만</li>
              <li>• 10Y 5.0% 초과 + 상승</li>
              <li>• VIX 30 초과</li>
            </ul>
            <p className="text-red-400 text-xs mt-2 font-medium">→ 전문가 조언 필수. 단독 판단 금지</p>
          </div>
        </div>
      </div>

      {/* Expert Habits */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">🧠 7가지 전문가 사고 습관</h3>
        <div className="space-y-2 text-sm">
          {[
            '발언 내용보다 발언 타이밍이 중요하다',
            '결과와 과정을 동시에 해석하라',
            '내러티브가 아닌 실제 자금 흐름을 추적하라',
            '기관별 편향을 인식하라 (IMF 낙관, CBO 기계적, Fed 관리 지향)',
            '메타 신호를 감지하라 (전례 없던 기관이 입장 변경)',
            '기본 메커니즘이 막혔을 때 정책 대안을 추적하라',
            '내러티브-유동성 괴리를 기회/위기 전조로 주시하라',
          ].map((habit, i) => (
            <div key={i} className="flex gap-2 bg-slate-900 rounded p-3">
              <span className="text-blue-400 font-bold">{i + 1}</span>
              <span className="text-slate-300">{habit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Memo */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-3">📝 나의 분석 메모</h3>
        <textarea
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value);
            localStorage.setItem('dashboardMemo', e.target.value);
          }}
          placeholder="오늘의 관찰 사항, 경매 결과, 의견을 자유롭게 기록하세요..."
          className="w-full h-32 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
        />
        <p className="text-slate-600 text-xs mt-1">* 메모는 브라우저 로컬에 저장됩니다. 서버로 전송되지 않습니다.</p>
      </div>

      <p className="text-slate-600 text-xs text-center">
        ⚠️ 본 대시보드는 교육/참고 목적입니다. 실제 투자 책임은 사용자에게 있습니다. 투자 조언이 아닙니다.
      </p>
    </div>
  );
}
