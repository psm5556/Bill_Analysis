'use client';
import { useState, useCallback } from 'react';
import { fetchFredSeries, testFredApiKey } from '@/lib/fredApi';
import type { FredSeriesData, FredApiState } from '@/types';

export function useFredApi(apiKey: string) {
  const [cache, setCache] = useState<Record<string, FredSeriesData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchSeries = useCallback(
    async (seriesId: string, limit = 52): Promise<FredSeriesData | null> => {
      if (!apiKey) return null;

      const cacheKey = `${seriesId}_${limit}`;
      if (cache[cacheKey]) return cache[cacheKey];

      setLoading((prev) => ({ ...prev, [seriesId]: true }));
      setErrors((prev) => ({ ...prev, [seriesId]: '' }));

      try {
        const data = await fetchFredSeries(seriesId, apiKey, limit);
        setCache((prev) => ({ ...prev, [cacheKey]: data }));
        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : '데이터 로딩 실패';
        setErrors((prev) => ({ ...prev, [seriesId]: msg }));
        return null;
      } finally {
        setLoading((prev) => ({ ...prev, [seriesId]: false }));
      }
    },
    [apiKey, cache]
  );

  return { fetchSeries, loading, errors, cache };
}

export function useFredApiState(
  initialKey: string
): [FredApiState, (key: string) => void, () => Promise<boolean>] {
  const [state, setState] = useState<FredApiState>({
    apiKey: initialKey,
    isValid: false,
    isTesting: false,
    error: null,
  });

  const setApiKey = (key: string) => {
    setState((prev) => ({ ...prev, apiKey: key, error: null }));
  };

  const testKey = async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isTesting: true, error: null }));
    const valid = await testFredApiKey(state.apiKey);
    setState((prev) => ({
      ...prev,
      isTesting: false,
      isValid: valid,
      error: valid ? null : 'API 키가 유효하지 않습니다. FRED 사이트에서 키를 확인하세요.',
    }));
    return valid;
  };

  return [state, setApiKey, testKey];
}
