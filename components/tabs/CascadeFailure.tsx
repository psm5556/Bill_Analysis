'use client';

export default function CascadeFailure() {
  const waves = [
    {
      wave: '1파',
      title: 'Nasdaq 고성장주 밸류에이션 (가장 취약)',
      color: 'red',
      items: [
        '할인율 급등 → 미래 현금흐름 현재가치 붕괴',
        '대상: 적자 SaaS, 임상 전 바이오텍, EV 스타트업, 초기 AI 기업',
        'P/E 50배+ 기업이 가장 먼저 타격',
        '상대적 안전: 수익성 있는 빅테� (AAPL, MSFT, 20~30배)',
      ],
    },
    {
      wave: '2파',
      title: '베이시스 트레이드 & 레버리지 청산 (숨겨진 지뢰)',
      color: 'orange',
      items: [
        '베이시스 트레이드 = 현물/선물 채권 간 미세 가격차 이용',
        '레버리지: 일반적으로 50~100배',
        '메커니즘: 레포 자금조달 비용 급등/중단 → 강제 청산',
        '전염 경로: 청산 → 금리 상승 → 추가 청산 → 악순환',
      ],
    },
    {
      wave: '3파',
      title: '상업용 부동산 & 지역 은행 (구조적 약점)',
      color: 'yellow',
      items: [
        '즉각적 영향: CRE 재융자 비용 급등',
        '취약 분야: 오피스(재택근무), 리테일(이커머스), 물류(과잉)',
        '지역은행 영향: CRE 대출이 자산의 30%+ 차지',
        '선례: 2023년 SVB 유형 연쇄 반응 가능',
      ],
    },
    {
      wave: '4파',
      title: '주택시장 & 소비 지출 (실물 경제)',
      color: 'purple',
      items: [
        '전달 경로: 10Y 국채 → 모기지 금리 → 주택 거래량 → 소비심리 → 지출',
        '부동산 파급: 가격 발견 중단, 2차 시장 유동성 증발',
      ],
    },
  ];

  const colorMap: Record<string, { border: string; bg: string; badge: string; icon: string }> = {
    red: { border: 'border-red-700', bg: 'bg-red-950/30', badge: 'bg-red-600 text-white', icon: '🔴' },
    orange: { border: 'border-orange-700', bg: 'bg-orange-950/30', badge: 'bg-orange-600 text-white', icon: '🟠' },
    yellow: { border: 'border-yellow-700', bg: 'bg-yellow-950/30', badge: 'bg-yellow-600 text-white', icon: '🟡' },
    purple: { border: 'border-purple-700', bg: 'bg-purple-950/30', badge: 'bg-purple-600 text-white', icon: '🟣' },
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-2">💥 입찰 붕괴 연쇄반응</h2>
        <p className="text-slate-400 text-sm mb-5">경매가 붕괴될 때 발생하는 4파 충격 시퀀스</p>

        <div className="space-y-4">
          {waves.map((wave) => {
            const c = colorMap[wave.color];
            return (
              <div key={wave.wave} className={`border rounded-lg p-5 ${c.border} ${c.bg}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.badge}`}>{c.icon} {wave.wave}</span>
                  <span className="text-white font-medium">{wave.title}</span>
                </div>
                <ul className="space-y-1.5">
                  {wave.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-slate-500 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-5 bg-slate-900 border border-slate-700 rounded-lg p-4">
          <h3 className="text-white font-bold mb-2">📌 충격 시퀀스 요약</h3>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="bg-red-900 text-red-300 px-2 py-1 rounded">단기채 약세</span>
            <span className="text-slate-500">→</span>
            <span className="bg-orange-900 text-orange-300 px-2 py-1 rounded">레버리지 청산</span>
            <span className="text-slate-500">→</span>
            <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded">부동산 압축</span>
            <span className="text-slate-500">→</span>
            <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded">실소비 파괴</span>
          </div>
        </div>
      </div>
    </div>
  );
}
