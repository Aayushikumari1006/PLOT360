import { apiGet, apiPost } from './client';

export async function getWorkflow(id) {
  return apiGet(`/workflows/${encodeURIComponent(id)}`);
}

export async function transitionWorkflow(id, toState, comment = '') {
  return apiPost(`/workflows/${encodeURIComponent(id)}/transition`, {
    to_state: toState,
    comment
  });
}

export async function getWorkflowHistory(id) {
  return apiGet(`/workflows/${encodeURIComponent(id)}/history`);
}
