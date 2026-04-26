import { FRED_BASE_URL } from './constants';
import type { FredObservation, FredSeriesData, ChartDataPoint } from '@/types';

export async function fetchFredSeries(
  seriesId: string,
  apiKey: string,
  limit = 52
): Promise<FredSeriesData> {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    sort_order: 'desc',
    limit: String(limit),
  });

  const response = await fetch(`${FRED_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`FRED API 오류: ${response.status}`);
  }

  const data = await response.json();
  const observations: FredObservation[] = data.observations ?? [];

  const sorted = [...observations].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const validObservations = sorted.filter((o) => o.value !== '.' && o.value !== '');
  const latest = validObservations[validObservations.length - 1];

  return {
    seriesId,
    observations: sorted,
    latestValue: latest ? parseFloat(latest.value) : null,
    latestDate: latest?.date ?? null,
  };
}

export async function testFredApiKey(apiKey: string): Promise<boolean> {
  try {
    const result = await fetchFredSeries('DGS10', apiKey, 1);
    return result.latestValue !== null;
  } catch {
    return false;
  }
}

export function toChartData(observations: FredObservation[]): ChartDataPoint[] {
  return observations
    .filter((o) => o.value !== '.' && o.value !== '')
    .map((o) => ({ date: o.date, value: parseFloat(o.value) }));
}

export function formatValue(value: number | null, unit = '', decimals = 2): string {
  if (value === null) return 'N/A';
  return `${value.toFixed(decimals)}${unit}`;
}
