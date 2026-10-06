const BASE = "https://image.tmdb.org/t/p";

export const posterUrl = (path: string | null | undefined, size = "w342"): string | null =>
  path ? `${BASE}/${size}${path}` : null;

export const year = (date?: string): string => (date ? date.slice(0, 4) : "");
