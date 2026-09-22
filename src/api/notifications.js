import { apiGet, apiPatch, apiPost } from './client';

export async function getNotifications(unreadOnly = false) {
  return apiGet(`/notifications${unreadOnly ? '?unread_only=true' : ''}`);
}

export async function markNotificationRead(id) {
  return apiPatch(`/notifications/${encodeURIComponent(id)}/read`, {});
}

export async function markAllNotificationsRead() {
  return apiPost('/notifications/read-all', {});
}
