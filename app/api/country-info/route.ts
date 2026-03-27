// src/app/api/country-info/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryName = searchParams.get('name');

  if (!countryName) return NextResponse.json({ error: 'Missing name' }, { status: 400 });

  try {
    // Esempio: Chiamata a Wikipedia o Unsplash per una descrizione/foto
    // Qui usiamo Wikipedia (Gratis e senza Key)
    const wikiRes = await fetch(`https://it.wikipedia.org/api/rest_v1/page/summary/${countryName}`);
    if (!wikiRes.ok) {
      throw new Error(`Failed to fetch Wikipedia data for ${countryName}`);
    }

    const data = await wikiRes.json();

    return NextResponse.json({
      extract: data.extract,
      thumbnail: data.thumbnail?.source,
      description: data.description
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch extra data' }, { status: 500 });
  }
}