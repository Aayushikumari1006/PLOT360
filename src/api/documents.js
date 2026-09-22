import { apiGet, apiPost } from './client';

export async function getDocument(id) {
  return apiGet(`/documents/${encodeURIComponent(id)}`);
}

export async function uploadDocument(formData) {
  // Let browser set multipart boundary
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:8000/api/v1' : '/api/v1');
  const token = localStorage.getItem('plot360_access_token');
  const res = await fetch(`${API_BASE_URL}/documents`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Document upload failed');
  }
  return res.json();
}

export async function getDocumentOcr(id) {
  return apiGet(`/documents/${encodeURIComponent(id)}/ocr`);
}
