import api from "./api";

// Fetch admin overview metrics
export const getAdminDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Admin Career Management API Services
export const getAdminCareers = async () => {
  const response = await api.get("/admin/careers");
  return response.data;
};

export const getAdminCareerById = async (id) => {
  const response = await api.get(`/admin/careers/${id}`);
  return response.data;
};

export const createAdminCareer = async (careerData) => {
  const response = await api.post("/admin/careers", careerData);
  return response.data;
};

export const updateAdminCareer = async (id, careerData) => {
  const response = await api.put(`/admin/careers/${id}`, careerData);
  return response.data;
};

export const toggleAdminCareerStatus = async (id, isActive) => {
  const response = await api.patch(`/admin/careers/${id}/status`, { isActive });
  return response.data;
};

export const deleteAdminCareer = async (id) => {
  const response = await api.delete(`/admin/careers/${id}`);
  return response.data;
};

// Admin Phase Management API Services
export const getAdminPhases = async (careerId = null) => {
  const url = careerId ? `/admin/phases?career=${careerId}` : "/admin/phases";
  const response = await api.get(url);
  return response.data;
};

export const getAdminPhaseById = async (id) => {
  const response = await api.get(`/admin/phases/${id}`);
  return response.data;
};

export const createAdminPhase = async (phaseData) => {
  const response = await api.post("/admin/phases", phaseData);
  return response.data;
};

export const updateAdminPhase = async (id, phaseData) => {
  const response = await api.put(`/admin/phases/${id}`, phaseData);
  return response.data;
};

export const toggleAdminPhaseStatus = async (id, isActive) => {
  const response = await api.patch(`/admin/phases/${id}/status`, { isActive });
  return response.data;
};

export const deleteAdminPhase = async (id) => {
  const response = await api.delete(`/admin/phases/${id}`);
  return response.data;
};
