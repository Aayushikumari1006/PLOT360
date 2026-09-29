import { apiGet, apiPost } from './client';

export async function getServiceRequests(ulpin = null) {
  return apiGet(`/citizen/service-requests${ulpin ? `?ulpin=${encodeURIComponent(ulpin)}` : ''}`);
}

export async function createServiceRequest(payload) {
  return apiPost('/citizen/service-requests', payload);
}

export async function getApplication(id) {
  return apiGet(`/applications/${encodeURIComponent(id)}`);
}

export async function getWorkflow(instanceId) {
  return apiGet(`/workflows/${encodeURIComponent(instanceId)}`);
}

export async function transitionWorkflow(instanceId, toState, comment = '') {
  return apiPost(`/workflows/${encodeURIComponent(instanceId)}/transition`, {
    to_state: toState,
    comment
  });
}
