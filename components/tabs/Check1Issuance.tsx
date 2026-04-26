'use client';
import { COUPON_AUCTION_SIZES } from '@/lib/constants';
import BarChart from '@/components/charts/BarChart';

export default function Check1Issuance() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-2">📐 체크1: 발행 구조 분석</h2>
        <p className="text-slate-400 text-sm mb-4">재무부가 장기 발행을 피하기 위해 단기물 쪽으로 이동 중인지 모니터링합니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
            <div className="text-red-400 font-bold mb-2">🔴 단기채(T-Bills) 비중</div>
            <div className="text-3xl font-bold text-white mb-1">22%</div>
            <div className="text-slate-400 text-sm">TBAC 권고: 15~20% 목표</div>
            <div className="text-red-400 text-xs mt-2">⚠️ 권고 상한 초과 — 롤오버 리스크 축적 중</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-slate-400 font-bold mb-2">📊 발행 전략 현황</div>
            <div className="text-xl font-bold text-yellow-400 mb-1">유지 전략</div>
            <div className="text-slate-400 text-sm">현재 쿠폰채 규모 유지 중. QRA에서 구조적 변화 신호 여부 확인 필요.</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-5">
          <h3 className="text-white font-bold mb-3">📅 분기별 쿠폰채 경매 규모 ($B)</h3>
          <BarChart
            labels={COUPON_AUCTION_SIZES.map((r) => r.maturity)}
            datasets={[
              { label: 'Q3 &apos;25', data: COUPON_AUCTION_SIZES.map((r) => r.q3_25), color: '#3b82f680' },
              { label: 'Q4 &apos;25', data: COUPON_AUCTION_SIZES.map((r) => r.q4_25), color: '#6366f180' },
              { label: 'Q1 &apos;26', data: COUPON_AUCTION_SIZES.map((r) => r.q1_26), color: '#22c55e80' },
            ]}
            unit="B"
            height={220}
          />
        </div>

        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">만기</th>
                <th className="text-right py-2 px-3 text-slate-400">Q3 &apos;25</th>
                <th className="text-right py-2 px-3 text-slate-400">Q4 &apos;25</th>
                <th className="text-right py-2 px-3 text-slate-400">Q1 &apos;26</th>
                <th className="text-left py-2 px-3 text-slate-400">상태</th>
              </tr>
            </thead>
            <tbody>
              {COUPON_AUCTION_SIZES.map((row, i) => (
                <tr key={i} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                  <td className="py-2 px-3 text-slate-200 font-medium">{row.maturity}</td>
                  <td className="py-2 px-3 text-right text-slate-300">${row.q3_25}B</td>
                  <td className="py-2 px-3 text-right text-slate-300">${row.q4_25}B</td>
                  <td className="py-2 px-3 text-right text-slate-200 font-medium">${row.q1_26}B</td>
                  <td className="py-2 px-3">
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">유지</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">🚨 Bills 피벗 감지 4개 트리거</h3>
          <div className="space-y-2 text-sm">
            {[
              '① 쿠폰채 규모 유지 상태에서 Bills만 확대',
              '② TBAC 임계값 지속 위반 (Bills &gt; 20%)',
              '③ Fed 단기 세그먼트 매입 활성화 (SOMA 포트폴리오 편향)',
              '④ 장기물 경매 수요 침식 (BtC 하락, 꼬리 확대, 딜러 비중 증가)',
            ].map((trigger, i) => (
              <div key={i} className="flex gap-2 bg-slate-800 rounded p-2">
                <span className="text-yellow-400 flex-shrink-0">⚡</span>
                <span className="text-slate-300">{trigger}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-yellow-950/50 border border-yellow-800 rounded p-3 text-sm">
            <p className="text-yellow-400 font-bold mb-1">해석 의미</p>
            <p className="text-slate-300">재무부가 장기금리 신호보다 단기 자금조달 비용을 더 두려워하는 것. 즉, 미래의 재융자 압박을 미루는 &quot;기간 함정&quot; 진행 중.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
