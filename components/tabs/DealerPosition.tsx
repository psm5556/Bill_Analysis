'use client';

export default function DealerPosition() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">🏦 프라이머리 딜러 포지션</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            { label: '순 국채 포지션', value: '추적 중', desc: '축적 vs 리스크 축소', icon: '📊' },
            { label: '레포 의존도', value: '추적 중', desc: '레버리지 수준 지표', icon: '🔄' },
            { label: '포트폴리오 방향', value: '추적 중', desc: '누적 vs 해소', icon: '📈' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 rounded-lg p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-slate-400 text-sm">{item.label}</div>
              <div className="text-white font-bold text-lg">{item.value}</div>
              <div className="text-slate-500 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-red-950/50 border border-red-800 rounded-lg p-4 mb-5">
          <h3 className="text-red-400 font-bold mb-2">⚠️ 위험 패턴</h3>
          <p className="text-slate-300 text-sm">
            순 포지션 감소 + 레포 의존도 상승 + 변동성 상승 =
            <span className="text-red-400 font-medium"> &quot;리스크를 더 이상 흡수하지 않겠다&quot; 신호</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">📡 데이터 출처</h3>
          <p className="text-slate-300 text-sm mb-2">
            <strong className="text-blue-400">NY Fed Primary Dealer Statistics</strong>
          </p>
          <p className="text-slate-400 text-sm">발행: 매주 목요일 (주간 데이터)</p>
          <p className="text-slate-500 text-xs mt-2">
            newyorkfed.org → Markets → Primary Dealer Statistics
          </p>
        </div>
      </div>

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
