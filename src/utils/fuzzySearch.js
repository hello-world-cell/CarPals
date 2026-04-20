/**
 * Fuzzy search for Singapore locations.
 *
 * Scoring layers (highest wins):
 *  1.00 — exact normalised name match
 *  0.92 — name starts with query
 *  0.88 — name contains query as substring
 *  0.80 — every query word appears in name (word-level contains)
 *  0.72 — area matches query
 *  0.60 — type matches query  (e.g. "mrt", "mall")
 *  0.50 — address contains query
 *  0.xx — bigram similarity × 0.85 (typo tolerance)
 *
 * Results are filtered at score > 0.22 and returned sorted descending.
 */

function normalise(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getBigrams(str) {
  const result = new Set();
  for (let i = 0; i < str.length - 1; i++) {
    result.add(str.slice(i, i + 2));
  }
  return result;
}

function bigramSimilarity(a, b) {
  const ba = getBigrams(a);
  const bb = getBigrams(b);
  if (ba.size === 0 || bb.size === 0) return 0;
  let hits = 0;
  for (const gram of ba) {
    if (bb.has(gram)) hits++;
  }
  return (2 * hits) / (ba.size + bb.size);
}

/**
 * Score how well `query` matches `target` at the word level.
 * Rewards partial prefix matches per word.
 */
function wordMatchScore(query, target) {
  const qWords = query.split(' ').filter((w) => w.length >= 2);
  const tWords = target.split(' ');
  if (qWords.length === 0) return 0;

  let matched = 0;
  for (const qw of qWords) {
    const hit = tWords.some(
      (tw) => tw.startsWith(qw) || (qw.length >= 3 && tw.includes(qw))
    );
    if (hit) matched++;
  }
  // Partial credit: all query words must match for full score
  return matched === qWords.length ? 0.80 : (matched / qWords.length) * 0.55;
}

/**
 * Search `locations` for the best matches to `query`.
 * Returns up to `maxResults` entries, each with an added `.score` field.
 */
export function searchLocations(query, locations, maxResults = 8) {
  if (!query || query.trim().length === 0) return [];
  const q = normalise(query);
  if (q.length === 0) return [];

  const scored = locations.map((loc) => {
    const name    = normalise(loc.name);
    const area    = normalise(loc.area);
    const type    = normalise(loc.type);
    const address = normalise(loc.address);

    let score = 0;

    // Layer 1 – exact
    if (name === q) {
      score = 1.0;
    }
    // Layer 2 – name starts-with
    else if (name.startsWith(q)) {
      score = Math.max(score, 0.92);
    }
    // Layer 3 – name contains
    else if (name.includes(q)) {
      score = Math.max(score, 0.88);
    }
    // Layer 4 – word-level match on name
    else {
      score = Math.max(score, wordMatchScore(q, name));
    }

    // Layer 5 – area match (independent boost)
    if (area.includes(q) || q.includes(area)) {
      score = Math.max(score, 0.72);
    }

    // Layer 6 – type match
    if (type.includes(q)) {
      score = Math.max(score, 0.60);
    }

    // Layer 7 – address contains
    if (address.includes(q)) {
      score = Math.max(score, 0.50);
    }

    // Layer 8 – bigram (typo tolerance)
    const bigram = bigramSimilarity(q, name) * 0.85;
    score = Math.max(score, bigram);

    return { ...loc, score };
  });

  return scored
    .filter((loc) => loc.score > 0.22)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Returns JSX-ready segments to highlight the matched portion of `text`.
 * E.g. "Raffles" in "Raffles Place MRT" with query "raff"
 * → [{ text: 'Raff', highlight: true }, { text: 'les Place MRT', highlight: false }]
 */
export function getHighlightSegments(text, query) {
  if (!query || !query.trim()) return [{ text, highlight: false }];
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return [{ text, highlight: false }];
  return [
    { text: text.slice(0, idx),            highlight: false },
    { text: text.slice(idx, idx + q.length), highlight: true  },
    { text: text.slice(idx + q.length),    highlight: false },
  ].filter((s) => s.text.length > 0);
}
