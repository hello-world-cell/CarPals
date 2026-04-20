import type { Destination } from '../types/destination';

const ONEMAP_SEARCH =
  'https://www.onemap.gov.sg/api/common/elastic/search';

type OneMapRow = {
  SEARCHVAL?: string;
  ADDRESS?: string;
  BLK_NO?: string;
  ROAD_NAME?: string;
  BUILDING?: string;
  POSTAL?: string;
  LATITUDE?: string;
  /** API sometimes returns LONGTITUDE typo */
  LONGITUDE?: string;
  LONGTITUDE?: string;
};

function rowToDestination(r: OneMapRow, index: number): Destination {
  const lng = r.LONGITUDE ?? r.LONGTITUDE;
  const title = r.ADDRESS || r.SEARCHVAL || 'Unknown';
  const subtitle = [r.BUILDING && r.BUILDING !== 'NIL' ? r.BUILDING : null, r.ROAD_NAME]
    .filter(Boolean)
    .join(' · ') || undefined;

  return {
    id: `onemap-${r.POSTAL ?? 'x'}-${index}-${title}`.slice(0, 120),
    title,
    subtitle,
    latitude: r.LATITUDE != null ? Number.parseFloat(r.LATITUDE) : undefined,
    longitude: lng != null ? Number.parseFloat(lng) : undefined,
    source: 'onemap',
    raw: r,
  };
}

/**
 * OneMap elastic search — requires registered token in Authorization header.
 * @see https://www.onemap.gov.sg/apidocs/search/
 */
export async function fetchOneMapSuggestions(
  query: string,
  accessToken: string,
  signal?: AbortSignal
): Promise<Destination[]> {
  const q = query.trim();
  if (!q || !accessToken) return [];

  const url = new URL(ONEMAP_SEARCH);
  url.searchParams.set('searchVal', q);
  url.searchParams.set('returnGeom', 'Y');
  url.searchParams.set('getAddrDetails', 'Y');
  url.searchParams.set('pageNum', '1');

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Authorization: accessToken },
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OneMap ${res.status}: ${text || res.statusText}`);
  }

  const data = (await res.json()) as { results?: OneMapRow[]; error?: string };
  if (data.error) throw new Error(String(data.error));

  const rows = Array.isArray(data.results) ? data.results : [];
  return rows.map((r, i) => rowToDestination(r, i));
}
