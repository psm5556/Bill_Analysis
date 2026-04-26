'use client';

export default function EventCalendar() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">📅 이벤트 캘린더 & 정책 대안</h2>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">🗓️ 분기별 국채 발행 공고 (QRA) 일정</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-slate-800 rounded p-3">
              <div className="text-blue-400 font-medium">2026년 1분기 (2월)</div>
              <p className="text-slate-300 mt-1">Q1 QRA 발표 — 쿠폰채 경매 규모, 단기물 방향성</p>
            </div>
            <div className="bg-slate-800 rounded p-3">
              <div className="text-blue-400 font-medium">2026년 2분기 (5월)</div>
              <ul className="text-slate-300 mt-1 space-y-1">
                <li>• 4월 28일경: 차입 추정치 발표</li>
                <li>• 5월 예정: 다음 QRA 발표</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">⚡ QRA 발표는 재무부가 발행 구성의 구조적 변화를 신호하는 핵심 이벤트입니다.</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-white font-bold mb-4">🌳 관세 정책 대안 체계도</h3>
          <div className="text-sm text-slate-400 mb-4">
            <code className="text-blue-400">IEEPA 차단 → Section 122 발동 → Section 232 대체 → Section 301 정밀타격 → Section 201 세이프가드</code>
          </div>
          <div className="space-y-4">
            {[
              {
                name: 'IEEPA',
                subtitle: '국제비상경제권한법',
                color: 'red',
                items: [
                  '가장 강력한 수단, 의회 승인 불필요',
                  '현재 차단 상태 (2026년 2월 대법원 위헌 판결)',
                  '가장 빠른 옵션이었으나 현재 사용 불가',
                ],
              },
              {
                name: 'Section 122',
                subtitle: '1974년 통상법 §122',
                color: 'yellow',
                items: [
                  '모든 수입품에 최대 15% 임시 관세',
                  '150일 시한 (의회 승인으로 연장 가능)',
                  'IEEPA 실패 후 "플랜 B"',
                  '만료 예정: ~2026년 7월',
                ],
              },
              {
                name: 'Section 232',
                subtitle: '무역확장법 §232',
                color: 'orange',
                items: [
                  '국가안보 근거 특정 관세',
                  '현재 가동 중 (철강/알루미늄/구리)',
                  '무기한 유지 가능',
                  '브랜드별 적용 가능',
                ],
              },
              {
                name: 'Section 301',
                subtitle: '통상법 §301',
                color: 'yellow',
                items: [
                  '불공정 무역관행 보복',
                  '조사 과정 필요 (수개월)',
                  '정밀 타격 능력',
                  '결과 예상: ~2026년 7월',
                ],
              },
              {
                name: 'Section 201',
                subtitle: '통상법 §201',
                color: 'slate',
                items: [
                  '특정 산업 긴급 세이프가드',
                  '4년 기간 제한',
                  'WTO 분쟁 위험',
                  '예비 옵션',
                ],
              },
            ].map((item) => {
              const colorMap: Record<string, string> = {
                red: 'border-red-700 bg-red-950/30',
                yellow: 'border-yellow-700 bg-yellow-950/30',
                orange: 'border-orange-700 bg-orange-950/30',
                slate: 'border-slate-600 bg-slate-900/50',
              };
              const labelMap: Record<string, string> = {
                red: 'text-red-400',
                yellow: 'text-yellow-400',
                orange: 'text-orange-400',
                slate: 'text-slate-400',
              };
              return (
                <div key={item.name} className={`border rounded-lg p-4 ${colorMap[item.color]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-bold ${labelMap[item.color]}`}>{item.name}</span>
                    <span className="text-slate-400 text-sm">— {item.subtitle}</span>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {item.items.map((li, i) => <li key={i}>• {li}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
