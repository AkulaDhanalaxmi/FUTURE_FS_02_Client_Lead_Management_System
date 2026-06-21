import api from './api'

export const leadService = {
  getLeads: (params) => api.get('/leads', { params }),
  getLead: (id) => api.get(`/leads/${id}`),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  addNote: (id, note) => api.post(`/leads/${id}/notes`, { note }),
  bulkUpdate: (ids, status) => api.put('/leads/bulk-update', { ids, status }),
}

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: () => api.get('/dashboard/activity'),
}
