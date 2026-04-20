export type Destination = {
  id: string;
  /** Primary line (e.g. full address) */
  title: string;
  /** Secondary line (e.g. building / road) */
  subtitle?: string;
  latitude?: number;
  longitude?: number;
  /** Provider-specific payload for debugging or maps */
  source: 'onemap' | 'google';
  raw?: unknown;
};
