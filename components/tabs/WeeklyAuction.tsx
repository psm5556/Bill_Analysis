'use client';
import { useState, useEffect } from 'react';

// Actual field names from TreasuryDirect TA_WS API
interface TreasuryAuction {
  auctionDate: string;
  securityType: string;       // "Note", "Bond", "Bill"
  securityTerm: string;       // "10-Year", "30-Year", "26-Week"
  highYield: string;          // winning yield
  bidToCoverRatio: string;
  offeringAmount: string;     // in dollars
  totalAccepted: string;
  primaryDealerAccepted: string;
  directBidderAccepted: string;
  indirectBidderAccepted: string;
  reopening: string;          // "Yes" / "No"
  interestRate: string;
}

type ProcessedAuction = {
  date: string;
  type: string;
  size: string;
  yield: string;
  btc: number | null;
  dealer: number | null;
  indirect: number | null;
  direct: number | null;
  grade: string;
};

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-green-900 text-green-300',
  B: 'bg-blue-900 text-blue-300',
  C: 'bg-yellow-900 text-yellow-300',
  D: 'bg-red-900 text-red-300',
};

function pct(accepted: string, total: string): number | null {
  const a = parseFloat(accepted);
  const t = parseFloat(total);
  if (!a || !t) return null;
  return (a / t) * 100;
}

function calcGrade(btc: number | null, indirect: number | null, dealer: number | null): string {
  if (!btc) return '?';
  let score = 0;
  if (btc >= 2.5) score += 3;
  else if (btc >= 2.2) score += 2;
  else if (btc >= 2.0) score += 1;
  if (indirect !== null) score += indirect >= 70 ? 2 : indirect >= 60 ? 1 : 0;
  if (dealer !== null) score += dealer < 15 ? 2 : dealer < 25 ? 1 : 0;
  if (score >= 6) return 'A';
  if (score >= 4) return 'B';
  if (score >= 2) return 'C';
  return 'D';
}

function processAuctions(raw: TreasuryAuction[]): ProcessedAuction[] {
  return raw
    .filter((a) => a.highYield && parseFloat(a.highYield) > 0)
    .map((a) => {
      const total = a.totalAccepted;
      const btc = parseFloat(a.bidToCoverRatio) || null;
      const dealer = pct(a.primaryDealerAccepted, total);
      const indirect = pct(a.indirectBidderAccepted, total);
      const direct = pct(a.directBidderAccepted, total);
      const sizeNum = parseFloat(a.offeringAmount);
      const sizeStr = sizeNum >= 1e9 ? `$${(sizeNum / 1e9).toFixed(0)}B` : `$${(sizeNum / 1e6).toFixed(0)}M`;
      const label = `${a.securityTerm} ${a.securityType}${a.reopening === 'Yes' ? ' (재발행)' : ''}`;

      return {
        date: a.auctionDate?.slice(0, 10) ?? '-',
        type: label,
        size: sizeStr,
        yield: parseFloat(a.highYield) ? `${parseFloat(a.highYield).toFixed(3)}%` : '-',
        btc,
        dealer,
        indirect,
        direct,
        grade: calcGrade(btc, indirect, dealer),
      };
    });
}

function calcSummaryStats(auctions: ProcessedAuction[]) {
  const recent = auctions.slice(0, 10);
  if (recent.length === 0) return { avgBtc: null, weakCount: 0, avgIndirect: null, gradeD: 0 };
  const btcVals = recent.map((a) => a.btc).filter((v): v is number => v !== null);
  const indirectVals = recent.map((a) => a.indirect).filter((v): v is number => v !== null);
  return {
    avgBtc: btcVals.length ? btcVals.reduce((a, b) => a + b, 0) / btcVals.length : null,
    weakCount: recent.filter((a) => a.btc !== null && a.btc < 2.0).length,
    avgIndirect: indirectVals.length ? indirectVals.reduce((a, b) => a + b, 0) / indirectVals.length : null,
    gradeD: recent.filter((a) => a.grade === 'D').length,
  };
}

export default function WeeklyAuction() {
  const [auctions, setAuctions] = useState<ProcessedAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/treasury?endpoint=auctions&days=60');
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data: TreasuryAuction[] = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid response');
        setAuctions(processAuctions(data));
        setLastUpdated(new Date().toLocaleString('ko-KR'));
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = calcSummaryStats(auctions);

  return (
    <div className="space-y-6">
      {/* 국채 경매란? */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-3">🏛️ 국채 경매란?</h2>
        <p className="text-slate-300 text-sm mb-3">
          미국 재무부는 정부 운영 자금을 마련하기 위해 매주 국채를 경매 방식으로 발행합니다.
          투자자들이 입찰하면 가장 낮은 금리(높은 가격)를 제시한 순서대로 낙찰받습니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900 rounded p-3">
            <div className="text-blue-400 font-bold mb-1">🏦 누가 참여하나요?</div>
            <ul className="text-slate-300 space-y-0.5">
              <li>• <strong className="text-white">프라이머리 딜러</strong>: 의무 입찰 (최후 보루)</li>
              <li>• <strong className="text-white">간접 낙찰자</strong>: 해외 중앙은행, 기관</li>
              <li>• <strong className="text-white">직접 낙찰자</strong>: 미국 국내 기관</li>
            </ul>
          </div>
          <div className="bg-slate-900 rounded p-3">
            <div className="text-yellow-400 font-bold mb-1">📊 경매 결과 해석</div>
            <ul className="text-slate-300 space-y-0.5">
              <li>• <strong className="text-white">BtC 높음</strong>: 수요 강함</li>
              <li>• <strong className="text-white">꼬리(Tail) 작음</strong>: 수요 강함</li>
              <li>• <strong className="text-white">간접% 높음</strong>: 해외 수요 강함</li>
            </ul>
          </div>
          <div className="bg-slate-900 rounded p-3">
            <div className="text-red-400 font-bold mb-1">⚠️ 위험 신호</div>
            <ul className="text-slate-300 space-y-0.5">
              <li>• BtC 2.0x 미만</li>
              <li>• 꼬리 3bp 이상</li>
              <li>• 딜러 낙찰 25% 초과</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      {!loading && auctions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={`border rounded-lg p-4 ${stats.avgBtc !== null && stats.avgBtc < 2.0 ? 'bg-red-950/50 border-red-800' : stats.avgBtc !== null && stats.avgBtc < 2.5 ? 'bg-yellow-950/50 border-yellow-800' : 'bg-green-950/50 border-green-800'}`}>
            <div className="text-slate-400 text-xs mb-1">최근 10회 평균 BtC</div>
            <div className={`text-2xl font-bold ${stats.avgBtc !== null && stats.avgBtc < 2.0 ? 'text-red-400' : stats.avgBtc !== null && stats.avgBtc < 2.5 ? 'text-yellow-400' : 'text-green-400'}`}>
              {stats.avgBtc !== null ? `${stats.avgBtc.toFixed(2)}x` : '-'}
            </div>
          </div>
          <div className={`border rounded-lg p-4 ${stats.weakCount >= 3 ? 'bg-red-950/50 border-red-800' : stats.weakCount >= 1 ? 'bg-yellow-950/50 border-yellow-800' : 'bg-green-950/50 border-green-800'}`}>
            <div className="text-slate-400 text-xs mb-1">BtC 2.0x 미만 횟수</div>
            <div className={`text-2xl font-bold ${stats.weakCount >= 3 ? 'text-red-400' : stats.weakCount >= 1 ? 'text-yellow-400' : 'text-green-400'}`}>
              {stats.weakCount}회
            </div>
          </div>
          <div className={`border rounded-lg p-4 ${stats.avgIndirect !== null && stats.avgIndirect < 60 ? 'bg-red-950/50 border-red-800' : stats.avgIndirect !== null && stats.avgIndirect < 70 ? 'bg-yellow-950/50 border-yellow-800' : 'bg-green-950/50 border-green-800'}`}>
            <div className="text-slate-400 text-xs mb-1">평균 간접 낙찰</div>
            <div className={`text-2xl font-bold ${stats.avgIndirect !== null && stats.avgIndirect < 60 ? 'text-red-400' : stats.avgIndirect !== null && stats.avgIndirect < 70 ? 'text-yellow-400' : 'text-green-400'}`}>
              {stats.avgIndirect !== null ? `${stats.avgIndirect.toFixed(1)}%` : '-'}
            </div>
          </div>
          <div className={`border rounded-lg p-4 ${stats.gradeD >= 2 ? 'bg-red-950/50 border-red-800' : stats.gradeD >= 1 ? 'bg-yellow-950/50 border-yellow-800' : 'bg-slate-900 border-slate-700'}`}>
            <div className="text-slate-400 text-xs mb-1">D등급 경매 횟수</div>
            <div className={`text-2xl font-bold ${stats.gradeD >= 2 ? 'text-red-400' : stats.gradeD >= 1 ? 'text-yellow-400' : 'text-slate-300'}`}>
              {stats.gradeD}회
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">📊 주간 경매 현황</h2>
          <div className="text-xs text-slate-500">
            {loading ? '🔄 로딩 중...' : error ? '⚠️ 오류' : `🟢 실시간 | ${lastUpdated}`}
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-4">
          출처: <span className="text-blue-400">TreasuryDirect.gov</span> 실시간 경매 결과 (최근 60일 · Notes/Bonds/Bills)
        </p>

        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded p-3 mb-4 text-sm text-red-300">
            ⚠️ 데이터 로딩 오류: {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {['날짜', '종류', '규모', '낙찰금리', 'BtC', '딜러%', '간접%', '직접%', '등급'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-slate-400 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auctions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-slate-500">데이터 없음</td>
                  </tr>
                ) : auctions.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''} hover:bg-slate-800/50 transition-colors`}>
                    <td className="py-2 px-3 text-slate-300 whitespace-nowrap">{row.date}</td>
                    <td className="py-2 px-3 text-slate-200 whitespace-nowrap text-xs">{row.type}</td>
                    <td className="py-2 px-3 text-slate-300">{row.size}</td>
                    <td className="py-2 px-3 text-slate-200">{row.yield}</td>
                    <td className={`py-2 px-3 font-medium ${
                      row.btc === null ? 'text-slate-500' :
                      row.btc < 2.0 ? 'text-red-400' :
                      row.btc < 2.5 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {row.btc !== null ? `${row.btc.toFixed(2)}x` : '-'}
                    </td>
                    <td className={`py-2 px-3 ${
                      row.dealer === null ? 'text-slate-500' :
                      row.dealer > 25 ? 'text-red-400' :
                      row.dealer > 15 ? 'text-yellow-400' : 'text-slate-300'
                    }`}>
                      {row.dealer !== null ? `${row.dealer.toFixed(1)}%` : '-'}
                    </td>
                    <td className={`py-2 px-3 ${
                      row.indirect === null ? 'text-slate-500' :
                      row.indirect < 60 ? 'text-red-400' :
                      row.indirect < 70 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {row.indirect !== null ? `${row.indirect.toFixed(1)}%` : '-'}
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      {row.direct !== null ? `${row.direct.toFixed(1)}%` : '-'}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${GRADE_COLORS[row.grade] ?? 'bg-slate-700 text-slate-300'}`}>
                        {row.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'A등급', desc: '강한 수요', color: 'bg-green-900 text-green-300' },
            { label: 'B등급', desc: '양호', color: 'bg-blue-900 text-blue-300' },
            { label: 'C등급', desc: '경계선', color: 'bg-yellow-900 text-yellow-300' },
            { label: 'D등급', desc: '위기 상황', color: 'bg-red-900 text-red-300' },
          ].map((g) => (
            <div key={g.label} className={`rounded p-2 text-center ${g.color}`}>
              <div className="font-bold">{g.label}</div>
              <div className="opacity-80">{g.desc}</div>
            </div>
          ))}
        </div>

        <p className="text-slate-600 text-xs mt-3">
          * 딜러/간접/직접 % = 각 그룹 낙찰액 / 총 낙찰액으로 계산.
          꼬리(Tail)는 TreasuryDirect API에서 제공하지 않아 생략.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">📏 경매 품질 지표 읽는 법</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">지표</th>
                <th className="text-left py-2 px-3 text-green-400">🟢 양호</th>
                <th className="text-left py-2 px-3 text-yellow-400">🟡 주의</th>
                <th className="text-left py-2 px-3 text-red-400">🔴 위험</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Bid-to-Cover', good: '2.5x 이상', warn: '2.0~2.5x', danger: '2.0x 미만' },
                { label: '딜러 보유', good: '15% 미만', warn: '15~25%', danger: '25% 초과' },
                { label: '간접 낙찰자', good: '70% 이상', warn: '60~70%', danger: '60% 미만' },
                { label: '꼬리(Tail)', good: '0 이하 (Stop Through)', warn: '1~3bp', danger: '3bp+ (Bloomberg 확인 필요)' },
              ].map((t, i) => (
                <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                  <td className="py-2 px-3 text-slate-200 font-medium">{t.label}</td>
                  <td className="py-2 px-3 text-green-300 text-xs">{t.good}</td>
                  <td className="py-2 px-3 text-yellow-300 text-xs">{t.warn}</td>
                  <td className="py-2 px-3 text-red-300 text-xs">{t.danger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-slate-600 text-xs mt-3">
          * 딜러/간접/직접 % = 각 그룹 낙찰액 / 총 낙찰액으로 계산.
          꼬리(Tail)는 TreasuryDirect API에서 제공하지 않아 생략.
        </p>
      </div>
    </div>
  );
}
