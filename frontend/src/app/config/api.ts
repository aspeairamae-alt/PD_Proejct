export const API_BASE = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:5007`
  : 'http://localhost:5007';
