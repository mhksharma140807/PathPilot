import api from "./api";

export const getPhasesByCareer = async (careerId) => {
  const response = await api.get(`/phases/career/${careerId}`);
  return response.data;
};

export const getPhaseById = async (id) => {
  const response = await api.get(`/phases/${id}`);
  return response.data;
};
