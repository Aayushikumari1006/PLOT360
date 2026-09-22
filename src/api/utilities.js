import { apiGet } from './client';

export async function getUtilities(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/utilities`);
}
