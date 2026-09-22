import { apiGet } from './client';

export async function getOwnership(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/ownership`);
}

export async function getOwnershipHistory(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/ownership-history`);
}

export async function getRoR(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/ror`);
}

export async function getRegistration(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/registration`);
}

export async function getEncumbrance(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/encumbrance`);
}

export async function getMortgages(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/mortgage`);
}

export async function getDisputes(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/disputes`);
}

export async function getProvenance(ulpin) {
  return apiGet(`/parcels/${encodeURIComponent(ulpin)}/provenance`);
}
