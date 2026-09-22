import { apiGet } from './client';

export async function getPropertyTax(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/tax`);
}
