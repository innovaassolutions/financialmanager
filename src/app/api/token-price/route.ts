import { NextRequest, NextResponse } from 'next/server';

let cache: { data: { price: number; percent_change_24h: number; last_updated: string }; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  const apiKey = process.env.CMC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CMC_API_KEY not configured' }, { status: 500 });
  }

  // Return cached response if still fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=${encodeURIComponent(slug)}&convert=USD`,
      {
        headers: { 'X-CMC_PRO_API_KEY': apiKey },
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('CMC API error:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch token price' }, { status: 502 });
    }

    const json = await res.json();
    const coins = json.data;
    const coinId = Object.keys(coins)[0];
    if (!coinId) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    const coin = coins[coinId];
    const quote = coin.quote.USD;

    const data = {
      price: quote.price,
      percent_change_24h: quote.percent_change_24h,
      last_updated: quote.last_updated,
    };

    cache = { data, timestamp: Date.now() };

    return NextResponse.json(data);
  } catch (err) {
    console.error('CMC fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch token price' }, { status: 500 });
  }
}
