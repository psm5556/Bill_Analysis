import { NextRequest, NextResponse } from 'next/server';

const TREASURY_AUCTIONS_URL = 'https://www.treasurydirect.gov/TA_WS/securities/auctioned';
const FISCAL_DATA_URL = 'https://api.fiscaldata.treasury.gov/services/api/v1';

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function fetchAuctionsForType(
  type: string,
  startDate: string,
  endDate: string
): Promise<unknown[]> {
  const url =
    `${TREASURY_AUCTIONS_URL}?type=${encodeURIComponent(type)}` +
    `&dateFieldName=auctionDate` +
    `&startDate=${startDate}` +
    `&endDate=${endDate}` +
    `&format=json`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const endpoint = searchParams.get('endpoint');

  try {
    if (endpoint === 'auctions') {
      const days = parseInt(searchParams.get('days') ?? '90', 10);
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      const startDate = dateStr(start);
      const endDate = dateStr(end);

      // Fetch each type separately — TreasuryDirect doesn't support comma-separated types
      const [notes, bonds, bills] = await Promise.all([
        fetchAuctionsForType('Note', startDate, endDate),
        fetchAuctionsForType('Bond', startDate, endDate),
        fetchAuctionsForType('Bill', startDate, endDate),
      ]);

      // Merge, sort by auctionDate descending, limit to 40
      const all = [...notes, ...bonds, ...bills] as Array<Record<string, string>>;
      all.sort((a, b) => {
        const da = new Date(a.auctionDate ?? '').getTime();
        const db = new Date(b.auctionDate ?? '').getTime();
        return db - da;
      });

      return NextResponse.json(all.slice(0, 40), {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      });
    }

    if (endpoint === 'avg_interest_rates') {
      const params = new URLSearchParams({
        fields: 'record_date,security_desc,security_type_desc,avg_interest_rate_amt',
        filter: 'security_type_desc:eq:Marketable',
        sort: '-record_date',
        'page[size]': '20',
      });
      const res = await fetch(`${FISCAL_DATA_URL}/accounting/od/avg_interest_rates?${params}`, {
        next: { revalidate: 86400 },
      });
      if (!res.ok) return NextResponse.json({ error: `FiscalData error: ${res.status}` }, { status: res.status });
      const data = await res.json();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' },
      });
    }

    if (endpoint === 'debt_outstanding') {
      const params = new URLSearchParams({
        fields: 'record_date,debt_held_public_amt,intragov_holdings_amt,tot_pub_debt_out_amt',
        sort: '-record_date',
        'page[size]': '5',
      });
      const res = await fetch(`${FISCAL_DATA_URL}/debt/debt_outstanding?${params}`, {
        next: { revalidate: 86400 },
      });
      if (!res.ok) return NextResponse.json({ error: `FiscalData error: ${res.status}` }, { status: res.status });
      const data = await res.json();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=86400' },
      });
    }

    return NextResponse.json(
      { error: 'Invalid endpoint. Use: auctions, avg_interest_rates, debt_outstanding' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
