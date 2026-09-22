import { apiGet, apiPost } from './client';

export async function getIntegrations() {
  return apiGet('/integrations');
}

export async function getIntegration(id) {
  return apiGet(`/integrations/${encodeURIComponent(id)}`);
}

export async function triggerIntegrationSync(id) {
  return apiPost(`/integrations/${encodeURIComponent(id)}/sync`, {});
}

export async function getRecentSyncJobs() {
  return apiGet('/integrations/jobs/recent');
}
