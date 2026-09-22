import { apiGet, apiPost } from './client';

export async function validateDatasets() {
  return apiPost('/ai/datasets/validate', {});
}

export async function getDatasets() {
  return apiGet('/ai/datasets');
}

export async function triggerChangeDetection(ulpinOrParcelId) {
  return apiPost('/ai/change-detection', { ulpin: ulpinOrParcelId });
}

export async function getChangeEvents() {
  return apiGet('/ai/change-events');
}

export async function getAiEvidence(identifier) {
  return apiGet(`/ai/change-events/${encodeURIComponent(identifier)}/evidence`);
}

export async function submitFieldVerification(identifier, status, notes = '', evidenceRef = null) {
  return apiPost(`/ai/change-events/${encodeURIComponent(identifier)}/field-verification`, {
    status,
    notes,
    evidence_reference: evidenceRef
  });
}

export async function getAiModels() {
  return apiGet('/ai/models');
}

export async function triggerTraining(params = {}) {
  return apiPost('/ai/train', params);
}
