import api from "./api";

export const getModulesByCareer = async (careerId) => {
  const response = await api.get(`/modules/career/${careerId}`);
  return response.data;
};