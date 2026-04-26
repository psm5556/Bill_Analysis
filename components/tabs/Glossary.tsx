'use client';
import { useState } from 'react';

const GLOSSARY_SECTIONS = [
  {
    title: '국채 증권 종류',
    items: [
      { term: 'T-Bills', def: '1년 이하 만기, 쿠폰 없음, 할인 발행, 최고 유동성. 단기 자금조달의 핵심 수단.' },
      { term: 'T-Notes', def: '2~10년 만기, 반기 쿠폰, 시장의 기초.' },
      { term: 'T-Bonds', def: '20~30년 만기, 최장기 채권. 인플레 기대와 재정 신뢰 반영.' },
      { term: 'TIPS', def: '인플레 연동 국채. 원금이 CPI에 따라 조정되어 실질 수익률 보호.' },
      { term: 'FRN', def: '2년 변동금리부 채권. 비용 구조 불확실.' },
    ],
  },
  {
    title: '주요 기관',
    items: [
      { term: 'Treasury (재무부)', def: '부채 관리, 세금 징수, 정부 지출. QRA로 발행 계획 발표.' },
      { term: 'Federal Reserve (Fed)', def: '통화정책, 은행 규제, 달러 발행. FOMC가 기준금리 결정.' },
      { term: 'CBO', def: '의회예산처. 비당파적 재정·경제 전망 기관. 현재 정책 지속 가정의 기계적 모델 사용.' },
      { term: 'TBAC', def: '재무부 차입 자문위원회. 민간 부문이 발행 전략 조언. Bills 비중 15~20% 권고.' },
      { term: '프라이머리 딜러', def: '~24개 주요 은행. 경매 의무 참여자. 시장의 최후 흡수자.' },
    ],
  },
  {
    title: '유동성 용어',
    items: [
      { term: 'ON RRP', def: '익일물 역레포. 머니마켓펀드의 현금 임시 보관소. 시장의 충격 흡수재. $100B 미만 위험 신호.' },
      { term: 'TGA', def: '재무부 일반계좌. 정부의 Fed 당좌계좌. TGA 충전 = 시장 유동성 흡수.' },
      { term: '은행 지준', def: '은행의 Fed 예치 의무금. 시스템 유동성의 기반. 고갈 시 연쇄 위기.' },
      { term: 'QRA', def: '분기별 국채 발행 공고 (2/5/8/11월). 재무부 발행 계획의 핵심 신호.' },
      { term: 'WAM', def: '가중평균만기. 하락 = 단기화 = 롤오버 위험 증가. 역사적 평균 ~70개월.' },
      { term: '롤오버', def: '만기 도래 부채를 신규 발행으로 대체. 롤오버 벽 = 재융자 부담.' },
    ],
  },
  {
    title: '경매 메커니즘',
    items: [
      { term: 'Bid-to-Cover', def: '수요 배수. 입찰액 / 낙찰액. 2.0x 미만 경고, 2.5x+ 강한 수요.' },
      { term: '꼬리 (Tail)', def: '낙찰금리 - 발행전 금리. 양(+) = 수요 약세, 음(-) = Stop Through (강한 수요). 3bp+ 위기 신호.' },
      { term: '강제 매수', def: '딜러가 수요 부족으로 남은 물량 의무 인수. 딜러 보유 25%+ = 강제 매수 신호.' },
      { term: '베이시스 트레이드', def: '현물-선물 채권 간 가격차를 이용한 고레버리지 차익거래. 50~100배 레버리지. 금리 급등 시 강제 청산 연쇄 반응.' },
    ],
  },
  {
    title: '위험 개념',
    items: [
      { term: '악순환 (Doom Loop)', def: '이자 지불을 위해 더 많이 빌려야 하는 자기 강화 나선. 이자가 세입의 25% 도달 시 발동 우려.' },
      { term: '기간 함정', def: '단기금리 선택으로 단기 비용 최소화 → 장기 재융자 위험 가중 → 구조적 취약성 심화 역설.' },
      { term: 'Bills 피벗', def: '장기금리 신호 억제를 위해 단기채 발행 집중. 2023년 Powell-Yellen이 사용. 단기 효과적이나 구조적 위험 상승.' },
      { term: '스텔스 완화', def: '기준금리 유지 상태에서 Bills 발행 확대로 실질적 유동성 공급. 정책 통화와 실제 완화 간 괴리.' },
      { term: 'CCB', def: '통화 간 베이시스 (Cross-Currency Basis). 달러 조달 비용. 음(-)값 = 달러 부족. 직접 API 없어 EUR/USD로 대리 측정.' },
    ],
  },
];

export default function Glossary() {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filtered = search
    ? GLOSSARY_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.term.toLowerCase().includes(search.toLowerCase()) ||
            item.def.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((s) => s.items.length > 0)
    : GLOSSARY_SECTIONS;

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white mb-4">📚 용어 사전</h2>
        <input
          type="text"
          placeholder="용어 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-4"
        />

        {filtered.map((section, si) => (
          <div key={si} className="mb-3 border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === si ? null : si)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800 transition-colors text-left"
            >
              <span className="text-white font-medium">{section.title}</span>
              <span className="text-slate-400">{openSection === si ? '▲' : '▼'}</span>
            </button>
            {(openSection === si || search) && (
              <div className="divide-y divide-slate-800">
                {section.items.map((item, ii) => (
                  <div key={ii} className="px-4 py-3 bg-slate-900/50">
                    <div className="text-blue-400 font-medium text-sm mb-1">{item.term}</div>
                    <div className="text-slate-300 text-sm">{item.def}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
