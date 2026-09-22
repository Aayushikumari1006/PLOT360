import { apiGet, apiPatch } from './client';

export async function getAdminUsers() {
  return apiGet('/admin/users');
}

export async function getAdminRoles() {
  return apiGet('/admin/roles');
}

export async function getAdminPermissions() {
  return apiGet('/admin/permissions');
}

export async function getAdminAuditLogs(limit = 50) {
  return apiGet(`/admin/audit?limit=${limit}`);
}

export async function getAdminConflicts(status = null) {
  return apiGet(`/admin/conflicts${status ? `?status=${encodeURIComponent(status)}` : ''}`);
}

export async function resolveConflict(conflictId, status, resolutionNotes) {
  return apiPatch(`/admin/conflicts/${encodeURIComponent(conflictId)}`, {
    status,
    resolution_notes: resolutionNotes
  });
}

export async function getAdminDuplicates() {
  return apiGet('/admin/duplicates');
}

export async function getStateConfigs() {
  return apiGet('/admin/state-config');
}
