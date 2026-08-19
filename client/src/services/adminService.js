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

// Admin Module Management API Services
export const getAdminModules = async (params = {}) => {
  let query = "";
  if (typeof params === "string") {
    query = params ? `?career=${params}` : "";
  } else if (params && typeof params === "object") {
    const searchParams = new URLSearchParams();
    if (params.career && params.career !== "all") searchParams.append("career", params.career);
    if (params.phase && params.phase !== "all") searchParams.append("phase", params.phase);
    if (params.status && params.status !== "all") searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);
    const str = searchParams.toString();
    if (str) query = `?${str}`;
  }
  const response = await api.get(`/admin/modules${query}`);
  return response.data;
};

export const getAdminModuleById = async (id) => {
  const response = await api.get(`/admin/modules/${id}`);
  return response.data;
};

export const createAdminModule = async (moduleData) => {
  const response = await api.post("/admin/modules", moduleData);
  return response.data;
};

export const updateAdminModule = async (id, moduleData) => {
  const response = await api.put(`/admin/modules/${id}`, moduleData);
  return response.data;
};

export const toggleAdminModuleStatus = async (id, isActive) => {
  const response = await api.patch(`/admin/modules/${id}/status`, { isActive });
  return response.data;
};

export const deleteAdminModule = async (id) => {
  const response = await api.delete(`/admin/modules/${id}`);
  return response.data;
};

// Admin Curriculum Requirement Management API Services
export const getAdminRequirements = async (params = {}) => {
  let query = "";
  if (typeof params === "string") {
    query = params ? `?phase=${params}` : "";
  } else if (params && typeof params === "object") {
    const searchParams = new URLSearchParams();
    if (params.career && params.career !== "all") searchParams.append("career", params.career);
    if (params.phase && params.phase !== "all") searchParams.append("phase", params.phase);
    if (params.type && params.type !== "all") searchParams.append("type", params.type);
    if (params.search) searchParams.append("search", params.search);
    const str = searchParams.toString();
    if (str) query = `?${str}`;
  }
  const response = await api.get(`/admin/curriculum-requirements${query}`);
  return response.data;
};

export const getAdminRequirementById = async (id) => {
  const response = await api.get(`/admin/curriculum-requirements/${id}`);
  return response.data;
};

export const createAdminRequirement = async (requirementData) => {
  const response = await api.post("/admin/curriculum-requirements", requirementData);
  return response.data;
};

export const updateAdminRequirement = async (id, requirementData) => {
  const response = await api.put(`/admin/curriculum-requirements/${id}`, requirementData);
  return response.data;
};

export const deleteAdminRequirement = async (id) => {
  const response = await api.delete(`/admin/curriculum-requirements/${id}`);
  return response.data;
};
