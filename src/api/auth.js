import { apiPost, apiGet, setAccessToken, setRefreshToken } from './client';

export async function login(username, password) {
  const data = await apiPost('/auth/login', { username, password });
  if (data.access_token) {
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  }
  return data;
}

export async function getMe() {
  return apiGet('/auth/me');
}

export async function logout() {
  try {
    await apiPost('/auth/logout', {});
  } finally {
    setAccessToken(null);
    setRefreshToken(null);
  }
}
