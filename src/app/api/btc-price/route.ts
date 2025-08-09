import { NextResponse } from 'next/server';

export async function GET() {
  try {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
        {
          headers: {
            'Accept': 'application/json',
          },
          next: { revalidate: 60 },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.bitcoin) {
          return NextResponse.json({
            success: true,
            source: 'coingecko',
            data: {
              price: data.bitcoin.usd,
              changePercent: data.bitcoin.usd_24h_change || 0,
              lastUpdated: Date.now(),
            },
          });
        }
      }
    } catch (error) {
      console.warn('CoinGecko API failed:', error);
    }

    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.lastPrice && data.priceChangePercent) {
          return NextResponse.json({
            success: true,
            source: 'binance',
            data: {
              price: parseFloat(data.lastPrice),
              changePercent: parseFloat(data.priceChangePercent),
              lastUpdated: Date.now(),
            },
          });
        }
      }
    } catch (error) {
      console.warn('Binance API failed:', error);
    }

    return NextResponse.json({
      success: false,
      source: 'mock',
      data: {
        price: 67500,
        changePercent: 2.34,
        lastUpdated: Date.now(),
      },
    });

  } catch (error) {
    console.error('BTC Price API error:', error);
    return NextResponse.json({
      success: false,
      source: 'mock',
      data: {
        price: 67500,
        changePercent: 2.34,
        lastUpdated: Date.now(),
      },
    });
  }
}