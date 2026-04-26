import { FRED_BASE_URL } from './constants';
import type { FredObservation, FredSeriesData, ChartDataPoint } from '@/types';

// Fetch via server-side API route (uses FRED_API_KEY env var — no client exposure)
async function fetchViaServerRoute(seriesId: string, limit: number): Promise<FredSeriesData | null> {
  try {
    const params = new URLSearchParams({ series_id: seriesId, limit: String(limit) });
    const res = await fetch(`/api/fred?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    return parseFredResponse(seriesId, data);
  } catch {
    return null;
  }
}

// Fallback: fetch directly with user-provided key (client-side)
async function fetchDirectly(seriesId: string, apiKey: string, limit: number): Promise<FredSeriesData> {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    sort_order: 'asc',
    limit: String(limit),
  });

  const response = await fetch(`${FRED_BASE_URL}?${params}`);
  if (!response.ok) throw new Error(`FRED API 오류: ${response.status}`);
  const data = await response.json();
  return parseFredResponse(seriesId, data);
}

function parseFredResponse(seriesId: string, data: { observations?: FredObservation[] }): FredSeriesData {
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

export async function fetchFredSeries(
  seriesId: string,
  apiKey: string,
  limit = 52
): Promise<FredSeriesData> {
  // Always try server route first (Vercel FRED_API_KEY env var)
  const serverResult = await fetchViaServerRoute(seriesId, limit);
  if (serverResult) return serverResult;

  // Fall back to direct call with user-provided key
  if (!apiKey) throw new Error('FRED API 키가 없습니다. 상단에서 키를 입력해주세요.');
  return fetchDirectly(seriesId, apiKey, limit);
}

export async function testFredApiKey(apiKey: string): Promise<boolean> {
  // First check if server route works (env var configured)
  try {
    const serverResult = await fetchViaServerRoute('DGS10', 1);
    if (serverResult?.latestValue !== null) return true;
  } catch { /* ignore */ }

  // Then test user-provided key
  try {
    const result = await fetchDirectly('DGS10', apiKey, 1);
    return result.latestValue !== null;
  } catch {
    return false;
  }
}

export async function checkServerKeyConfigured(): Promise<boolean> {
  try {
    const result = await fetchViaServerRoute('DGS10', 1);
    return result !== null && result.latestValue !== null;
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
