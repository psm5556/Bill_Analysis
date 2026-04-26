import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'FRED_API_KEY not configured on server' }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const seriesId = searchParams.get('series_id');
  const limit = searchParams.get('limit') ?? '52';
  const sortOrder = searchParams.get('sort_order') ?? 'asc';
  const observationStart = searchParams.get('observation_start');

  if (!seriesId) {
    return NextResponse.json({ error: 'series_id is required' }, { status: 400 });
  }

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    sort_order: sortOrder,
    limit,
  });

  if (observationStart) {
    params.set('observation_start', observationStart);
  }

  try {
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?${params}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `FRED API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
