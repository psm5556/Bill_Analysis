'use client';
import { useState, useEffect } from 'react';

interface TreasuryAuction {
  auctionDate: string;
  securityType: string;
  securityTerm: string;
  highYield: string;
  bidToCoverRatio: string;
  percentAllocatedToDealers: string;
  percentAllocatedToIndirectBidders: string;
  percentAllocatedToDirectBidders: string;
  offeringAmount: string;
  totalAccepted: string;
  // tail is not directly provided — computed from highYield vs when-issued
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
  F: 'bg-red-950 text-red-200',
};

function calcGrade(btc: number | null, indirect: number | null, dealer: number | null): string {
  if (!btc) return '?';
  let score = 0;
  if (btc >= 2.5) score += 3;
  else if (btc >= 2.2) score += 2;
  else if (btc >= 2.0) score += 1;

  if (indirect !== null) {
    if (indirect >= 70) score += 2;
    else if (indirect >= 60) score += 1;
  }

  if (dealer !== null) {
    if (dealer < 15) score += 2;
    else if (dealer < 25) score += 1;
  }

  if (score >= 6) return 'A';
  if (score >= 4) return 'B';
  if (score >= 2) return 'C';
  return 'D';
}

function processAuctions(raw: TreasuryAuction[]): ProcessedAuction[] {
  return raw
    .filter((a) => ['Note', 'Bond', 'Bill'].includes(a.securityType))
    .slice(0, 20)
    .map((a) => {
      const btc = parseFloat(a.bidToCoverRatio) || null;
      const dealer = parseFloat(a.percentAllocatedToDealers) || null;
      const indirect = parseFloat(a.percentAllocatedToIndirectBidders) || null;
      const direct = parseFloat(a.percentAllocatedToDirectBidders) || null;
      const sizeNum = parseFloat(a.offeringAmount);
      const sizeStr = sizeNum >= 1e9 ? `$${(sizeNum / 1e9).toFixed(0)}B` : `$${sizeNum}`;

      return {
        date: a.auctionDate?.slice(0, 10) ?? '-',
        type: `${a.securityTerm} ${a.securityType}`,
        size: sizeStr,
        yield: a.highYield ? `${parseFloat(a.highYield).toFixed(3)}%` : '-',
        btc,
        dealer,
        indirect,
        direct,
        grade: calcGrade(btc, indirect, dealer),
      };
    });
}

export default function WeeklyAuction() {
  const [auctions, setAuctions] = useState<ProcessedAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/treasury?endpoint=auctions&days=60&type=Bill,Note,Bond');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: TreasuryAuction[] = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid response format');
        setAuctions(processAuctions(data));
        setLastUpdated(new Date().toLocaleString('ko-KR'));
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">📊 주간 경매 현황</h2>
          <div className="text-xs text-slate-500">
            {loading ? '로딩 중...' : error ? '⚠️ 데이터 오류' : `🟢 실시간 | ${lastUpdated}`}
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-4">
          출처: TreasuryDirect.gov 실시간 경매 결과 (최근 60일)
        </p>

        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded p-3 mb-4 text-sm text-red-300">
            TreasuryDirect API 오류: {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
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
          * 등급 산정: BtC + 간접낙찰자% + 딜러보유% 종합. 꼬리(Tail) 데이터는 TreasuryDirect API에서 직접 제공하지 않음.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-3">📏 주요 임계값</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Bid-to-Cover', danger: '2.0x 미만', meaning: '수요 침식 신호' },
            { label: '꼬리(Tail)', danger: '3bp+', meaning: '심각한 압박 (별도 모니터링 필요)' },
            { label: '딜러 보유', danger: '25%+', meaning: '강제 매수 (부정)' },
            { label: '간접 낙찰자', danger: '60% 미만', meaning: '해외 수요 약화' },
          ].map((t, i) => (
            <div key={i} className="bg-slate-900 rounded p-3">
              <div className="text-slate-300 font-medium">{t.label}</div>
              <div className="text-red-400 text-xs mt-1">⚠️ {t.danger} → {t.meaning}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
