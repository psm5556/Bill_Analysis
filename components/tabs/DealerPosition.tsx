'use client';

export default function DealerPosition() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">🏦 프라이머리 딜러 포지션</h2>

        <div className="bg-slate-900 border border-slate-700 rounded p-4 mb-5 text-sm">
          <p className="text-slate-300 mb-2">
            프라이머리 딜러는 국채 경매의 <strong className="text-white">최후 보루</strong>입니다.
            딜러가 경매에서 낙찰받은 국채를 시장에 재매각하지 못하면 레버리지가 쌓이고 시스템 위험이 증가합니다.
          </p>
          <p className="text-slate-400 text-xs">딜러 낙찰 비중 25% 이상 = 시장 수요 부재 신호</p>
        </div>

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

        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">지표</th>
                <th className="text-left py-2 px-3 text-slate-400">정상</th>
                <th className="text-left py-2 px-3 text-slate-400">경계</th>
                <th className="text-left py-2 px-3 text-slate-400">위험</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '딜러 낙찰 비중', safe: '15% 미만', warn: '15~25%', danger: '25% 초과' },
                { label: '순 포지션 방향', safe: '감소 (재매각 중)', warn: '유지', danger: '급증 (쌓임)' },
                { label: '레포 의존도', safe: '안정', warn: '소폭 상승', danger: '급증' },
                { label: '경매 참여율', safe: '높음', warn: '보통', danger: '저조 (불참)' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                  <td className="py-2 px-3 text-slate-200 font-medium">{row.label}</td>
                  <td className="py-2 px-3 text-green-400 text-xs">{row.safe}</td>
                  <td className="py-2 px-3 text-yellow-400 text-xs">{row.warn}</td>
                  <td className="py-2 px-3 text-red-400 text-xs">{row.danger}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <div className="mt-3 bg-yellow-950/50 border border-yellow-800 rounded p-2 text-xs">
            <p className="text-yellow-400">⚡ 경매 결과의 딜러 낙찰 비중은 &apos;주간 경매 현황&apos; 탭에서 실시간 확인 가능</p>
          </div>
        </div>
      </div>
    </div>
  );
}
