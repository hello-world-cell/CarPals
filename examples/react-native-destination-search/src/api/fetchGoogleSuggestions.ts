import type { Destination } from '../types/destination';

/**
 * Legacy Places Autocomplete (HTTP). Prefer a backend proxy in production.
 * Restrict key by bundle ID / SHA1 in Google Cloud Console.
 */
export async function fetchGooglePlaceSuggestions(
  query: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<Destination[]> {
  const input = query.trim();
  if (!input || !apiKey) return [];

  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
  url.searchParams.set('input', input);
  url.searchParams.set('key', apiKey);
  /** Optional: bias to Singapore */
  url.searchParams.set('components', 'country:sg');

  const res = await fetch(url.toString(), { method: 'GET', signal });
  if (!res.ok) throw new Error(`Google Places ${res.status}`);

  const data = (await res.json()) as {
    status: string;
    predictions?: Array<{
      place_id: string;
      description: string;
      structured_formatting?: { main_text?: string; secondary_text?: string };
    }>;
    error_message?: string;
  };

  if (data.status === 'ZERO_RESULTS') return [];
  if (data.status !== 'OK') {
    throw new Error(data.error_message || `Google Places: ${data.status}`);
  }

  const preds = data.predictions ?? [];
  return preds.map((p) => ({
    id: p.place_id,
    title: p.structured_formatting?.main_text ?? p.description,
    subtitle: p.structured_formatting?.secondary_text,
    source: 'google' as const,
    raw: p,
  }));
}
