'use client';

const SOURCES = [
  {
    category: '국채 발행/경매',
    items: [
      { name: '재무부 분기별 발행 공고 (QRA)', freq: '분기 (2/5/8/11월)', note: '발행 규모 및 전략 변화 신호' },
      { name: 'TBAC 회의록 및 권고', freq: '분기', note: 'Bills 비중 15~20% 가이드라인 등' },
      { name: 'TreasuryDirect 경매 결과', freq: '실시간 (주 2~5회)', note: 'BtC, 낙찰금리, 꼬리, 낙찰자 분류' },
      { name: 'Fiscal Data API (재무부)', freq: '일간/월간', note: '총 부채, 이자 비용' },
      { name: '월간 재무부 보고서 (MTS)', freq: '월간', note: '예산 수지, 이자 지급 내역' },
    ],
  },
  {
    category: 'FRED (Federal Reserve Economic Data)',
    items: [
      { name: 'ON RRP (RRPONTSYD)', freq: '매 영업일', note: 'ON RRP 잔고' },
      { name: 'TGA (WTREGEN)', freq: '주간', note: '재무부 일반계좌' },
      { name: '은행 지준 (WRESBAL)', freq: '주간', note: '시스템 유동성 기반' },
      { name: '10Y 금리 (DGS10)', freq: '매 영업일', note: '글로벌 자산 기준금리' },
      { name: '30Y 금리 (DGS30)', freq: '매 영업일', note: '장기 인플레 기대' },
      { name: 'SOFR', freq: '매 영업일', note: '레포 시장 실제 차입 금리' },
      { name: 'VIX (VIXCLS)', freq: '매 영업일', note: '주식시장 변동성 지수' },
      { name: 'HY OAS (BAMLH0A0HYM2)', freq: '매 영업일', note: '고수익채 스프레드' },
      { name: 'EUR/USD (DEXUSEU)', freq: '매 영업일', note: 'CCB 대리 측정' },
    ],
  },
  {
    category: '기타 데이터',
    items: [
      { name: 'NY Fed Primary Dealer Statistics', freq: '매주 목요일', note: '딜러 포지션, 레포 의존도' },
      { name: 'CBO 예산·경제 전망', freq: '반기 (1월/5월)', note: '10년 이자 비용 전망' },
      { name: 'MOVE Index', freq: '매 영업일', note: '채권 변동성 (ICE BofAML, 유료)' },
    ],
  },
];

export default function DataSources() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">📡 데이터 출처 및 업데이트 주기</h2>

        {SOURCES.map((section, si) => (
          <div key={si} className="mb-5">
            <h3 className="text-blue-400 font-bold mb-3">{section.category}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-3 text-slate-400">데이터</th>
                    <th className="text-left py-2 px-3 text-slate-400">업데이트</th>
                    <th className="text-left py-2 px-3 text-slate-400">용도</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, ii) => (
                    <tr key={ii} className={`border-b border-slate-800 ${ii % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                      <td className="py-2 px-3 text-slate-200">{item.name}</td>
                      <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{item.freq}</td>
                      <td className="py-2 px-3 text-slate-400">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="bg-blue-950/50 border border-blue-800 rounded-lg p-4 mt-4">
          <h3 className="text-blue-400 font-bold mb-2">🔑 FRED API 사용 안내</h3>
          <p className="text-slate-300 text-sm">
            본 대시보드는 FRED API를 통해 실시간 경제 데이터를 불러옵니다.
            무료 API 키 발급: <span className="text-blue-400">fred.stlouisfed.org</span> → My Account → API Keys
          </p>
          <p className="text-slate-500 text-xs mt-2">
            ⚠️ API 키는 브라우저(localStorage)에만 저장되며 서버로 전송되지 않습니다.
          </p>
        </div>

        <p className="text-slate-600 text-xs text-center mt-4">
          ⚠️ 본 대시보드는 교육/참고 목적입니다. 실제 투자 책임은 사용자에게 있습니다. 투자 조언이 아닙니다.
        </p>
      </div>
    </div>
  );
}
