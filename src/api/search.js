import { apiGet } from './client';

export async function searchGlobal(query) {
  return apiGet(`/search?q=${encodeURIComponent(query)}`);
}
