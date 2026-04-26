'use client';
import { AUCTION_MATURITY_GUIDE } from '@/lib/constants';

export default function AuctionManual() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">📖 경매 해석 7단계 매뉴얼</h2>

        <div className="space-y-4">
          {[
            {
              step: 'STEP 0',
              title: '경매 유형 파악',
              content: (
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• 만기 (기간)</li>
                  <li>• 발행 유형: 신규 발행(New Issue) vs 재발행(Reopening)</li>
                  <li>• 비교 기준 설정 (동일 만기 직전 경매)</li>
                </ul>
              ),
            },
            {
              step: 'STEP 1',
              title: '쿠폰 금리 vs 낙찰 금리(High Yield)',
              content: (
                <div className="text-sm text-slate-300 space-y-2">
                  <p>• 쿠폰 금리 = 채권에 명시된 고정 이자율</p>
                  <p>• 낙찰 금리(High Yield) = 시장이 결정한 실제 정산 금리</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-red-950/50 border border-red-800 rounded p-2">
                      <p className="text-red-400 font-medium text-xs">낙찰금리 {'>'} 쿠폰</p>
                      <p className="text-slate-400 text-xs">할인 발행 → 수요 약세</p>
                    </div>
                    <div className="bg-green-950/50 border border-green-800 rounded p-2">
                      <p className="text-green-400 font-medium text-xs">낙찰금리 {'<'} 쿠폰</p>
                      <p className="text-slate-400 text-xs">프리미엄 발행 → 수요 강세</p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              step: 'STEP 2',
              title: 'Bid-to-Cover 비율',
              content: (
                <div className="text-sm text-slate-300 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-950/50 border border-green-800 rounded p-2 text-center">
                      <div className="text-green-400 font-bold">2.5x+</div>
                      <div className="text-xs text-slate-400">강한 수요</div>
                    </div>
                    <div className="bg-yellow-950/50 border border-yellow-800 rounded p-2 text-center">
                      <div className="text-yellow-400 font-bold">2.0~2.5x</div>
                      <div className="text-xs text-slate-400">정상</div>
                    </div>
                    <div className="bg-red-950/50 border border-red-800 rounded p-2 text-center">
                      <div className="text-red-400 font-bold">2.0x 미만</div>
                      <div className="text-xs text-slate-400">경고 신호</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">반드시 직전 동일 만기 경매와 비교할 것</p>
                </div>
              ),
            },
            {
              step: 'STEP 3',
              title: '꼬리(Tail)',
              content: (
                <div className="text-sm text-slate-300 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-950/50 border border-green-800 rounded p-2">
                      <div className="text-green-400 font-medium text-xs">음(-)의 꼬리 = &quot;Stop Through&quot;</div>
                      <div className="text-slate-400 text-xs">예상보다 강한 수요</div>
                    </div>
                    <div className="bg-slate-700 rounded p-2">
                      <div className="text-slate-300 font-medium text-xs">0~1bp = &quot;on the screws&quot;</div>
                      <div className="text-slate-400 text-xs">예상대로</div>
                    </div>
                    <div className="bg-yellow-950/50 border border-yellow-800 rounded p-2">
                      <div className="text-yellow-400 font-medium text-xs">1~3bp = 보통 꼬리</div>
                      <div className="text-slate-400 text-xs">수요 약세</div>
                    </div>
                    <div className="bg-red-950/50 border border-red-800 rounded p-2">
                      <div className="text-red-400 font-medium text-xs">3bp+ = 심각한 꼬리</div>
                      <div className="text-slate-400 text-xs">위기 신호</div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              step: 'STEP 4',
              title: '간접 낙찰자(Indirect Bidders)',
              content: (
                <div className="text-sm text-slate-300 space-y-2">
                  <p>• 해외 중앙은행 및 해외 기관 투자자</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-950/50 border border-green-800 rounded p-2">
                      <div className="text-green-400 font-medium text-xs">70%+</div>
                      <div className="text-slate-400 text-xs">강한 해외 수요</div>
                    </div>
                    <div className="bg-red-950/50 border border-red-800 rounded p-2">
                      <div className="text-red-400 font-medium text-xs">60% 미만</div>
                      <div className="text-slate-400 text-xs">해외 수요 침식</div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              step: 'STEP 5',
              title: '직접 낙찰자(Direct Bidders)',
              content: (
                <div className="text-sm text-slate-300 space-y-2">
                  <p>• 국내 미국 기관 투자자</p>
                  <p>• 간접↓ 동시에 직접↑ = 불안정 패턴 (해외 자본을 국내가 대체)</p>
                </div>
              ),
            },
            {
              step: 'STEP 6',
              title: '프라이머리 딜러 보유량',
              content: (
                <div className="text-sm text-slate-300 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-950/50 border border-green-800 rounded p-2 text-center">
                      <div className="text-green-400 font-bold">15% 미만</div>
                      <div className="text-xs text-slate-400">건강한 시장</div>
                    </div>
                    <div className="bg-yellow-950/50 border border-yellow-800 rounded p-2 text-center">
                      <div className="text-yellow-400 font-bold">15~25%</div>
                      <div className="text-xs text-slate-400">주의 구간</div>
                    </div>
                    <div className="bg-red-950/50 border border-red-800 rounded p-2 text-center">
                      <div className="text-red-400 font-bold">25%+</div>
                      <div className="text-xs text-slate-400">강제 매수</div>
                    </div>
                  </div>
                </div>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="bg-slate-900 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">{item.step}</span>
                <span className="text-white font-medium">{item.title}</span>
              </div>
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Checklist Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">✅ 종합 판단 체크리스트</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">지표</th>
                <th className="text-left py-2 px-3 text-green-400">🟢 양호</th>
                <th className="text-left py-2 px-3 text-yellow-400">🟡 경계</th>
                <th className="text-left py-2 px-3 text-red-400">🔴 위험</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Bid-to-Cover', good: '2.5x 이상', warn: '2.0~2.5x', danger: '2.0x 미만' },
                { label: '꼬리(Tail)', good: '0bp 이하 (Stop Through)', warn: '1~3bp', danger: '3bp 이상' },
                { label: '낙찰금리 vs 쿠폰', good: '낙찰금리 < 쿠폰 (프리미엄)', warn: '±5bp 이내', danger: '낙찰금리 >> 쿠폰 (할인)' },
                { label: '간접 낙찰자', good: '70% 이상', warn: '60~70%', danger: '60% 미만' },
                { label: '직접 낙찰자', good: '10~20% (안정)', warn: '20~25%', danger: '25%+ (해외 대체 신호)' },
                { label: '딜러 보유', good: '15% 미만', warn: '15~25%', danger: '25% 초과 (강제 매수)' },
                { label: '전월 동일 BtC 비교', good: '개선 (↑)', warn: '보합', danger: '악화 (↓)' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                  <td className="py-2 px-3 text-slate-200 font-medium whitespace-nowrap">{row.label}</td>
                  <td className="py-2 px-3 text-green-300 text-xs">{row.good}</td>
                  <td className="py-2 px-3 text-yellow-300 text-xs">{row.warn}</td>
                  <td className="py-2 px-3 text-red-300 text-xs">{row.danger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-yellow-950/50 border border-yellow-800 rounded p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">📌 종합 판정 가이드</p>
          <p className="text-slate-300">6~7개 지표 양호 = A등급. 4~5개 = B등급. 2~3개 = C등급. 0~1개 = D등급 (위기 경보).</p>
        </div>
      </div>

      {/* Reopening vs New Issue */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">🔄 재발행(Reopening) vs 신규발행(New Issue)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-blue-400 font-bold mb-2">신규발행 (New Issue)</div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 새로운 CUSIP 번호 발행</li>
              <li>• 새 쿠폰 금리 설정</li>
              <li>• 현재 시장 금리 반영</li>
              <li>• 유동성 낮음 (초기)</li>
            </ul>
            <div className="mt-2 text-xs text-slate-500">결과 해석: 낙찰금리 = 시장의 현재 금리 기대치</div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-yellow-400 font-bold mb-2">재발행 (Reopening)</div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 기존 CUSIP에 물량 추가</li>
              <li>• 쿠폰 금리 고정 (기존 채권과 동일)</li>
              <li>• 할인/프리미엄으로 낙찰</li>
              <li>• 유동성 높음 (기존 풀에 합류)</li>
            </ul>
            <div className="mt-2 text-xs text-slate-500">
              ⚠️ 꼬리 해석 주의: 쿠폰 vs 시장금리 괴리가 크면 꼬리가 과장될 수 있음
            </div>
          </div>
        </div>
        <div className="mt-3 bg-blue-950/50 border border-blue-800 rounded p-3 text-xs">
          <p className="text-blue-400 font-bold mb-1">💡 실용 팁</p>
          <p className="text-slate-300">재발행 경매에서는 낙찰금리 자체보다 Bid-to-Cover와 간접 낙찰자 비중을 더 중요하게 봐야 합니다. 쿠폰 고정으로 인해 낙찰금리 해석이 왜곡될 수 있습니다.</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">📋 실제 경매 사례: 2026년 4월 9일 30년 재발행</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {[
            { label: '쿠폰 금리', value: '4.750%', signal: '' },
            { label: '낙찰 금리', value: '4.876%', signal: '🔴' },
            { label: 'Bid-to-Cover', value: '2.39x (↓2.66x)', signal: '🟡' },
            { label: '꼬리', value: '+5.3bp', signal: '🔴' },
            { label: '간접 낙찰자', value: '64.15% (↓~70%)', signal: '🟡' },
            { label: '직접 낙찰자', value: '24.23% (↑~17.9%)', signal: '🔴' },
            { label: '딜러 보유', value: '11.62%', signal: '🟢' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 rounded p-3">
              <div className="text-slate-400 text-xs mb-1">{item.label}</div>
              <div className="text-white font-medium text-sm">{item.signal} {item.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-red-950/50 border border-red-800 rounded p-4 text-sm">
          <p className="text-red-400 font-bold mb-2">📌 최종 판정: 약한 경매</p>
          <p className="text-slate-300">꼬리 5.3bp, Bid-to-Cover 하락, 해외 수요 침식으로 장기물 압력 신호. 해외 자본 철수가 국내 기관으로 대체되어 불안정 구조 형성.</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">📊 만기별 경매 가이드</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">만기</th>
                <th className="text-left py-2 px-3 text-slate-400">빈도</th>
                <th className="text-left py-2 px-3 text-slate-400">시장 영향</th>
                <th className="text-left py-2 px-3 text-slate-400">핵심 주목</th>
              </tr>
            </thead>
            <tbody>
              {AUCTION_MATURITY_GUIDE.map((row, i) => (
                <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                  <td className="py-2 px-3 text-slate-200 font-medium">{row.maturity}</td>
                  <td className="py-2 px-3 text-slate-300">{row.frequency}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      row.impact === '매우 높음' ? 'bg-red-900 text-red-300' :
                      row.impact === '높음' ? 'bg-orange-900 text-orange-300' :
                      row.impact === '중간-높음' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>{row.impact}</span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">{row.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
