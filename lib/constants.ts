import type { Tab } from '@/types';

export const TABS: Tab[] = [
  { id: 'summary', label: '⭐ 종합 의견' },
  { id: 'auction-manual', label: '경매 해석 매뉴얼' },
  { id: 'event-calendar', label: '이벤트 캘린더' },
  { id: 'weekly-auction', label: '주간 경매 현황' },
  { id: 'contrarian', label: '역발상 지표' },
  { id: 'cascade', label: '입찰 붕괴 연쇄반응' },
  { id: 'dealer', label: '딜러 포지션' },
  { id: 'check1', label: '체크1: 발행 구조' },
  { id: 'check2', label: '체크2: 이자 부담' },
  { id: 'check3', label: '체크3: 유동성 완충' },
  { id: 'check4', label: '체크4: 만기 불일치' },
  { id: 'glossary', label: '용어 사전' },
  { id: 'data-sources', label: '데이터 출처' },
];

export const FRED_SERIES = {
  ON_RRP: 'RRPONTSYD',
  TGA: 'WTREGEN',
  BANK_RESERVES: 'WRESBAL',
  RATE_10Y: 'DGS10',
  RATE_30Y: 'DGS30',
  SOFR: 'SOFR',
  VIX: 'VIXCLS',
  HY_OAS: 'BAMLH0A0HYM2',
  EURUSD: 'DEXUSEU',
  TOTAL_DEBT: 'GFDEBTN',
  NET_INTEREST: 'FYOINT',
  SOMA_TBILLS: 'WSHOMCB',
  SOMA_TOTAL: 'TREAST',
} as const;

export const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

export const THRESHOLDS = {
  ON_RRP_DANGER: 100,
  SOFR_SPREAD_DANGER: 20,
  VIX_CAUTION: 20,
  VIX_FEAR: 30,
  MOVE_CAUTION: 100,
  MOVE_DANGER: 120,
  HY_OAS_CAUTION: 400,
  HY_OAS_DANGER: 600,
  BID_TO_COVER_WARNING: 2.0,
  BID_TO_COVER_STRONG: 2.5,
  TAIL_CAUTION: 1,
  TAIL_DANGER: 3,
  INDIRECT_WARNING: 60,
  DEALER_CAUTION: 15,
  DEALER_DANGER: 25,
  TBILL_PCT_TARGET_MAX: 20,
  TBILL_PCT_DANGER: 22,
} as const;

export const CBO_PROJECTIONS = [
  { year: '2024 (실적)', interest: 882, gdpRatio: 3.1, revenueRatio: 18.0 },
  { year: '2025', interest: 952, gdpRatio: 3.2, revenueRatio: 18.6 },
  { year: '2026', interest: 1005, gdpRatio: 3.3, revenueRatio: 19.2 },
  { year: '2027', interest: 1071, gdpRatio: 3.4, revenueRatio: 19.8 },
  { year: '2028', interest: 1150, gdpRatio: 3.5, revenueRatio: 20.5 },
  { year: '2030', interest: 1330, gdpRatio: 3.7, revenueRatio: 22.1 },
  { year: '2035', interest: 1800, gdpRatio: 4.1, revenueRatio: 25.0 },
];

export const COUPON_AUCTION_SIZES = [
  { maturity: '2년', q3_25: 69, q4_25: 69, q1_26: 69 },
  { maturity: '3년', q3_25: 58, q4_25: 58, q1_26: 58 },
  { maturity: '5년', q3_25: 70, q4_25: 70, q1_26: 70 },
  { maturity: '7년', q3_25: 44, q4_25: 44, q1_26: 44 },
  { maturity: '10년', q3_25: 42, q4_25: 42, q1_26: 42 },
  { maturity: '20년', q3_25: 16, q4_25: 16, q1_26: 16 },
  { maturity: '30년', q3_25: 25, q4_25: 25, q1_26: 25 },
];

export const RATE_STRESS_SCENARIOS = [
  { scenario: '현재', rate: 4.3, additionalCost: '-', signal: 'safe' as const },
  { scenario: '+0.5%', rate: 4.8, additionalCost: '+$45~60B', signal: 'warning' as const },
  { scenario: '+1.0%', rate: 5.3, additionalCost: '+$90~120B', signal: 'warning' as const },
  { scenario: '+2.0%', rate: 6.3, additionalCost: '+$180~240B', signal: 'danger' as const },
];

export const AUCTION_MATURITY_GUIDE = [
  { maturity: '4/8주 Bills', frequency: '매주', impact: '낮음', focus: '유동성 지표' },
  { maturity: '2년', frequency: '월간', impact: '보통', focus: 'Fed 정책 민감도' },
  { maturity: '3년', frequency: '월간', impact: '보통', focus: '단기→중기 전환' },
  { maturity: '5년', frequency: '월간', impact: '높음', focus: '벨리 변동성' },
  { maturity: '7년', frequency: '월간', impact: '높음', focus: '역사적 약한 수요' },
  { maturity: '10년', frequency: '월+재발행', impact: '매우 높음', focus: '글로벌 자산 기준금리' },
  { maturity: '20년', frequency: '월간', impact: '중간-높음', focus: '낮은 유동성' },
  { maturity: '30년', frequency: '월+재발행', impact: '매우 높음', focus: '인플레 기대, 재정 신뢰' },
];
