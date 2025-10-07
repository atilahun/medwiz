import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const workflowApi = {
  getAll: () => api.get('/workflows'),
  getById: (id: string) => api.get(`/workflows/${id}`),
  create: (data: any) => api.post('/workflows', data),
  update: (id: string, data: any) => api.put(`/workflows/${id}`, data),
  delete: (id: string) => api.delete(`/workflows/${id}`),
  duplicate: (id: string) => api.post(`/workflows/${id}/duplicate`),
};

export const pageApi = {
  getAll: (workflowId?: string) =>
    api.get('/pages', { params: { workflowId } }),
  getById: (id: string) => api.get(`/pages/${id}`),
  create: (data: any) => api.post('/pages', data),
  update: (id: string, data: any) => api.put(`/pages/${id}`, data),
  delete: (id: string) => api.delete(`/pages/${id}`),
  reorder: (pageIds: string[]) => api.post('/pages/reorder', { pageIds }),
};

export const sectionApi = {
  getAll: (pageId?: string) =>
    api.get('/sections', { params: { pageId } }),
  getById: (id: string) => api.get(`/sections/${id}`),
  create: (data: any) => api.post('/sections', data),
  update: (id: string, data: any) => api.put(`/sections/${id}`, data),
  delete: (id: string) => api.delete(`/sections/${id}`),
  reorder: (sectionIds: string[]) => api.post('/sections/reorder', { sectionIds }),
};

export const fieldApi = {
  getAll: (sectionId?: string) =>
    api.get('/fields', { params: { sectionId } }),
  getById: (id: string) => api.get(`/fields/${id}`),
  create: (data: any) => api.post('/fields', data),
  update: (id: string, data: any) => api.put(`/fields/${id}`, data),
  delete: (id: string) => api.delete(`/fields/${id}`),
  reorder: (fieldIds: string[]) => api.post('/fields/reorder', { fieldIds }),
};

export const validationApi = {
  getAll: (fieldId?: string) =>
    api.get('/validations', { params: { fieldId } }),
  getById: (id: string) => api.get(`/validations/${id}`),
  create: (data: any) => api.post('/validations', data),
  update: (id: string, data: any) => api.put(`/validations/${id}`, data),
  delete: (id: string) => api.delete(`/validations/${id}`),
};