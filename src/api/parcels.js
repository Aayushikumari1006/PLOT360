import { apiGet } from './client';

export async function getParcels(params = {}) {
  const query = new URLSearchParams();
  if (params.location) query.append('location', params.location);
  if (params.state) query.append('state', params.state);
  if (params.bbox) query.append('bbox', params.bbox);
  if (params.limit) query.append('limit', params.limit);
  const qStr = query.toString();
  return apiGet(`/parcels${qStr ? `?${qStr}` : ''}`);
}

export async function getParcelByUlpin(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}`);
}

export async function getParcelGeometry(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/geometry`);
}

export async function getParcelSummary(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/summary`);
}

export async function getParcelTimeline(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/timeline`);
}
