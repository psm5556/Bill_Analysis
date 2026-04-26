'use client';

export default function SummaryOpinion() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">⭐ 오늘의 종합 의견 (초보자용)</h2>
        <p className="text-slate-400 text-sm mb-4">
          모든 데이터를 종합하여 초보자도 이해할 수 있는 일일 가이드를 제공합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <div className="text-yellow-400 font-bold mb-2">📊 시장 긴장도</div>
            <div className="text-2xl font-bold text-white">42 / 100</div>
            <div className="text-slate-400 text-sm mt-1">0-100 스트레스 척도</div>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <div className="text-yellow-400 font-bold mb-2">💧 유동성 상태</div>
            <div className="text-lg font-bold text-yellow-300">주의 관찰</div>
            <div className="text-slate-400 text-sm mt-1">ON RRP + TGA + 지준 종합</div>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <div className="text-red-400 font-bold mb-2">🎯 경매 수요</div>
            <div className="text-lg font-bold text-red-300">약세</div>
            <div className="text-slate-400 text-sm mt-1">최근 경매 결과 기반</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">📋 3줄 일일 요약</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-red-400 flex-shrink-0">①</span>
              <span className="text-slate-300">단기채 비중이 TBAC 권고를 초과 중 (22% vs 15~20% 목표). 롤오버 위험 축적.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400 flex-shrink-0">②</span>
              <span className="text-slate-300">ON RRP 잔고 감소 지속 중. 금리 급등 리스크 모니터링 필요.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400 flex-shrink-0">③</span>
              <span className="text-slate-300">시장 낙관론이 CCB 음(-)을 지속하는 실제 달러 부족 신호와 충돌 중.</span>
            </li>
          </ul>
        </div>

        <div className="bg-red-950/50 border border-red-800 rounded-lg p-4 mb-5">
          <h3 className="text-red-400 font-bold mb-3">⚠️ 주의사항</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• 공식 발표(정부/IMF)는 후행적이며 낙관 편향. 현금이 사라진 후 &quot;돈 풀기&quot; 헤드라인이 나옵니다.</li>
            <li>• 단일 지표 베팅 금지. 최소 3개 지표 동시 확인이 필수입니다.</li>
            <li>• FOMO(두려움으로 인한 매수)가 가장 위험한 신호입니다.</li>
          </ul>
        </div>
      </div>

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

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">🎯 3가지 시나리오</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-950/50 border border-green-800 rounded-lg p-4">
            <div className="text-green-400 font-bold mb-2">🟢 강세 (Bull Case)</div>
            <p className="text-slate-300 text-sm mb-3">단기 공급 압박. TGA 방출 + 바이백 유동성 파티 기대.</p>
            <div className="text-xs text-slate-400">
              <p className="font-medium text-slate-300 mb-1">확인 신호:</p>
              <ul className="space-y-1">
                <li>• ON RRP 안정</li>
                <li>• B+ 등급 이상 경매</li>
                <li>• 10Y 4.2% 이하</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-950/50 border border-yellow-800 rounded-lg p-4">
            <div className="text-yellow-400 font-bold mb-2">🟡 기본 (Base Case)</div>
            <p className="text-slate-300 text-sm mb-3">구조적 약세 출현. 한 자릿수 변동성 확장.</p>
            <div className="text-xs text-slate-400">
              <p className="font-medium text-slate-300 mb-1">확인 신호:</p>
              <ul className="space-y-1">
                <li>• Bid-to-Cover 2.0~2.5x</li>
                <li>• 꼬리 1~3bp</li>
                <li>• MOVE 100~120</li>
              </ul>
            </div>
          </div>
          <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
            <div className="text-red-400 font-bold mb-2">🔴 약세 (Bear Case)</div>
            <p className="text-slate-300 text-sm mb-3">신용 악화. 민간 부문 소진 → 신용등급 강등 가능.</p>
            <div className="text-xs text-slate-400">
              <p className="font-medium text-slate-300 mb-1">확인 신호:</p>
              <ul className="space-y-1">
                <li>• D 등급 경매</li>
                <li>• 딜러 보유 25%+</li>
                <li>• CCB 대폭 음(-)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">⏰ 일일 10분 체크리스트</h3>
        <div className="space-y-3">
          {[
            { step: 1, action: '경매 결과 확인', detail: 'C 등급 이하 = 주의, 꼬리 3bp+ = 경고', color: 'blue' },
            { step: 2, action: 'ON RRP/TGA 잔고 변화', detail: '$100B 임계값 기준 ON RRP 모니터링', color: 'blue' },
            { step: 3, action: '10Y/30Y 금리 움직임', detail: '일일 ±10bp 변동 시 원인 파악', color: 'blue' },
            { step: 4, action: 'MOVE 지수 확인', detail: '120+ 시 시장 긴장 신호', color: 'blue' },
            { step: 5, action: '예정 이벤트 점검', detail: '클러스터 날짜에 특별 주의', color: 'blue' },
            { step: 6, action: '종합 의견 재평가', detail: '포트폴리오 영향 검토', color: 'blue' },
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

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">❓ 7문 해석 템플릿</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">질문</th>
                <th className="text-left py-2 px-3 text-slate-400">예시</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['정상/비정상? 임계값은?', '4.5%는 역사적 상위 10분위'],
                ['추세 방향 (3/6/12개월)?', '6개월째 꾸준히 상승 중'],
                ['근본 드라이버는?', '장기 발행 증가 + 인플레 재연'],
                ['같이 움직이는 것은?', '모기지, 회사채, 성장주 밸류에이션'],
                ['결과 vs 과정 해석?', '일시적 쇼크 vs 재정 신뢰 훼손'],
                ['역사적 선례는?', '2023년 채권 자경단 시기'],
                ['포트폴리오 시사점?', '장기물 비중 축소, 현금 여유 확보'],
              ].map(([q, ex], i) => (
                <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                  <td className="py-2 px-3 text-slate-300">{q}</td>
                  <td className="py-2 px-3 text-slate-400 text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-slate-600 text-xs text-center">
        ⚠️ 본 대시보드는 교육/참고 목적입니다. 실제 투자 책임은 사용자에게 있습니다. 투자 조언이 아닙니다.
      </p>
    </div>
  );
}
