import { apiGet } from './client';

export async function getAnalyticsOverview() {
  return apiGet('/analytics/overview');
}

export async function getParcelAnalytics() {
  return apiGet('/analytics/parcels');
}

export async function getGovernanceAnalytics() {
  return apiGet('/analytics/governance');
}

export async function getCitizenAnalytics() {
  return apiGet('/analytics/citizen-services');
}

export async function getAiAnalytics() {
  return apiGet('/analytics/ai');
}

export async function getDataHealthAnalytics() {
  return apiGet('/analytics/data-health');
}
