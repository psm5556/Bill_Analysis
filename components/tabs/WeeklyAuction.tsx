'use client';

const RECENT_AUCTIONS = [
  { date: '2026-04-09', type: '30년 재발행', size: '$25B', yield: '4.876%', btc: 2.39, dealer: 11.62, indirect: 64.15, direct: 24.23, tail: 5.3, grade: 'D' },
  { date: '2026-04-08', type: '10년 재발행', size: '$39B', yield: '4.435%', btc: 2.53, dealer: 13.5, indirect: 68.2, direct: 18.3, tail: 1.1, grade: 'C' },
  { date: '2026-04-01', type: '7년', size: '$44B', yield: '4.233%', btc: 2.61, dealer: 12.8, indirect: 69.1, direct: 18.1, tail: 0.8, grade: 'B' },
  { date: '2026-03-25', type: '2년', size: '$69B', yield: '4.007%', btc: 2.72, dealer: 14.2, indirect: 67.5, direct: 18.3, tail: -0.3, grade: 'A' },
];

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-green-900 text-green-300',
  B: 'bg-blue-900 text-blue-300',
  C: 'bg-yellow-900 text-yellow-300',
  D: 'bg-red-900 text-red-300',
  F: 'bg-red-950 text-red-200',
};

export default function WeeklyAuction() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">📊 주간 경매 현황</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {['날짜', '유형', '규모', '낙찰금리', 'BtC', '딜러%', '간접%', '직접%', '꼬리(bp)', '등급'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-slate-400 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_AUCTIONS.map((row, i) => (
                <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''} hover:bg-slate-800/50 transition-colors`}>
                  <td className="py-2 px-3 text-slate-300 whitespace-nowrap">{row.date}</td>
                  <td className="py-2 px-3 text-slate-200 whitespace-nowrap">{row.type}</td>
                  <td className="py-2 px-3 text-slate-300">{row.size}</td>
                  <td className="py-2 px-3 text-slate-200">{row.yield}</td>
                  <td className={`py-2 px-3 font-medium ${row.btc < 2.0 ? 'text-red-400' : row.btc < 2.5 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {row.btc}x
                  </td>
                  <td className={`py-2 px-3 ${row.dealer > 25 ? 'text-red-400' : row.dealer > 15 ? 'text-yellow-400' : 'text-slate-300'}`}>
                    {row.dealer}%
                  </td>
                  <td className={`py-2 px-3 ${row.indirect < 60 ? 'text-red-400' : row.indirect < 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {row.indirect}%
                  </td>
                  <td className="py-2 px-3 text-slate-300">{row.direct}%</td>
                  <td className={`py-2 px-3 font-medium ${row.tail >= 3 ? 'text-red-400' : row.tail >= 1 ? 'text-yellow-400' : row.tail < 0 ? 'text-green-400' : 'text-slate-300'}`}>
                    {row.tail > 0 ? '+' : ''}{row.tail}
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

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'A등급', desc: '강한 수요', color: 'bg-green-900 text-green-300' },
            { label: 'B등급', desc: '양호', color: 'bg-blue-900 text-blue-300' },
            { label: 'C등급', desc: '경계선', color: 'bg-yellow-900 text-yellow-300' },
            { label: 'D/F등급', desc: '위기 상황', color: 'bg-red-900 text-red-300' },
          ].map((g) => (
            <div key={g.label} className={`rounded p-2 text-center ${g.color}`}>
              <div className="font-bold">{g.label}</div>
              <div className="opacity-80">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-3">📏 주요 임계값</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Bid-to-Cover', danger: '2.0x 미만', meaning: '수요 침식 신호' },
            { label: '꼬리(Tail)', danger: '3bp+', meaning: '심각한 압박' },
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
