import { NextResponse } from 'next/server';

// Japan MOF weekly overseas securities flow (Shift-JIS CSV, auto-parsed)
const MOF_CSV_URL = 'https://www.mof.go.jp/english/policy/international_policy/reference/international_finance_and_cooperation/csv/fcs_e.csv';

function parseShiftJisNumbers(rows: string[][]): { period: string; bonds: number; usd: number }[] {
  // Find rows with data: date column + numeric columns
  const results: { period: string; bonds: number; usd: number }[] = [];
  for (const row of rows) {
    if (!row[0] || row.length < 3) continue;
    const period = row[0].trim();
    // Look for a date-like pattern (e.g. "Apr.7-Apr.11")
    if (!/\w+\.\s*\d+/.test(period) && !/\d{4}/.test(period)) continue;
    const bonds = parseFloat(row[1]?.replace(/,/g, '') ?? '');
    const usd = parseFloat(row[2]?.replace(/,/g, '') ?? '');
    if (!isNaN(bonds)) {
      results.push({ period, bonds, usd: isNaN(usd) ? bonds / 150 : usd });
    }
  }
  return results.slice(-12);
}

export async function GET() {
  try {
    const res = await fetch(MOF_CSV_URL, {
      headers: { 'Accept': '*/*' },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `MOF fetch failed: ${res.status}` }, { status: res.status });
    }

    // Decode Shift-JIS via TextDecoder if available, else use latin-1 as fallback
    const buffer = await res.arrayBuffer();
    let text: string;
    try {
      text = new TextDecoder('shift-jis').decode(buffer);
    } catch {
      text = new TextDecoder('latin1').decode(buffer);
    }

    // Parse CSV
    const lines = text.split('\n').map((l) => l.split(',').map((c) => c.replace(/"/g, '').trim()));
    const data = parseShiftJisNumbers(lines);

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
