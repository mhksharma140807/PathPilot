import api from "./api";

export const getModulesByCareer = async (careerId) => {
  const response = await api.get(`/modules/career/${careerId}`);
  return response.data;
};

export const getModuleById = async (moduleId) => {
  const response = await api.get(`/modules/${moduleId}`);
  return response.data;
};