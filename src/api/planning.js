import { apiGet } from './client';

export async function getPlanning(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/planning`);
}

export async function getBuildingPermissions(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/building`);
}

export async function getRestrictions(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/restrictions`);
}

export async function getPlanningCrossCheck(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/planning-crosscheck`);
}
