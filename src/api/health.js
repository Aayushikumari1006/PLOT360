import { apiGet } from './client';

export async function checkLiveness() {
  return apiGet('/health');
}

export async function getDetailedHealth() {
  return apiGet('/health/detailed');
}

export async function getDatabaseHealth() {
  return apiGet('/health/database');
}

export async function getIntegrationsHealth() {
  return apiGet('/health/integrations');
}

export async function getAiHealth() {
  return apiGet('/health/ai');
}
