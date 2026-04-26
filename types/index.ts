export type TabId =
  | 'summary'
  | 'auction-manual'
  | 'event-calendar'
  | 'weekly-auction'
  | 'contrarian'
  | 'cascade'
  | 'dealer'
  | 'check1'
  | 'check2'
  | 'check3'
  | 'check4'
  | 'glossary'
  | 'data-sources';

export interface Tab {
  id: TabId;
  label: string;
  icon?: string;
}

export interface FredObservation {
  date: string;
  value: string;
}

export interface FredSeriesData {
  seriesId: string;
  observations: FredObservation[];
  latestValue: number | null;
  latestDate: string | null;
}

export interface FredApiState {
  apiKey: string;
  isValid: boolean;
  isTesting: boolean;
  error: string | null;
}

export type SignalLevel = 'safe' | 'warning' | 'danger' | 'unknown';

export interface MetricData {
  label: string;
  value: string | number | null;
  unit?: string;
  signal: SignalLevel;
  description?: string;
  threshold?: string;
}

export interface AuctionResult {
  date: string;
  type: string;
  size: string;
  yield: string;
  bidToCover: number | null;
  dealerPct: number | null;
  indirectPct: number | null;
  directPct: number | null;
  tail: number | null;
  grade: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
