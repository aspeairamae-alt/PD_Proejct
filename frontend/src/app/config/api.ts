const envApiUrl = import.meta.env.VITE_API_URL?.trim();

// Prefer explicit deployment configuration, then sensible defaults.
export const API_BASE = envApiUrl && envApiUrl.length > 0
  ? envApiUrl.replace(/\/+$/, '')
  : (import.meta.env.PROD ? '/api' : 'http://localhost:5007');
