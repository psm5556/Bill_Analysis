import { NextRequest, NextResponse } from 'next/server';

// TreasuryDirect auction data API
const TREASURY_AUCTIONS_URL = 'https://www.treasurydirect.gov/TA_WS/securities/auctioned';

// Treasury Fiscal Data API for avg interest rates & debt outstanding
const FISCAL_DATA_URL = 'https://api.fiscaldata.treasury.gov/services/api/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const endpoint = searchParams.get('endpoint');

  try {
    if (endpoint === 'auctions') {
      const days = searchParams.get('days') ?? '90';
      const type = searchParams.get('type') ?? 'Bill,Note,Bond';

      const params = new URLSearchParams({ type, days, format: 'json' });
      const res = await fetch(`${TREASURY_AUCTIONS_URL}?${params}`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        return NextResponse.json({ error: `TreasuryDirect error: ${res.status}` }, { status: res.status });
      }

      const data = await res.json();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      });
    }

    if (endpoint === 'avg_interest_rates') {
      // Average interest rates by security type — used for T-Bills % context
      const params = new URLSearchParams({
        fields: 'record_date,security_desc,security_type_desc,avg_interest_rate_amt',
        'filter': 'security_type_desc:eq:Marketable',
        'sort': '-record_date',
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
        'sort': '-record_date',
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

    return NextResponse.json({ error: 'Invalid endpoint. Use: auctions, avg_interest_rates, debt_outstanding' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
