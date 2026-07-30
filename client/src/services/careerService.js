import api from "./api";

export const getCareers = async () => {
  const response = await api.get("/careers");
  return response.data;
};

export const getCareerBySlug = async (slug) => {
  const response = await api.get(`/careers/${slug}`);
  return response.data;
};

export const selectCareer = async (careerId) => {
  const response = await api.post("/enrollments", {
    careerId,
  });

  return response.data;
};

export const getMyCareer = async () => {
  const response = await api.get("/enrollments/me");
  return response.data;
};

export const getModulesByCareer = async (careerId) => {
  const response = await api.get(`/modules/career/${careerId}`);
  return response.data;
};

export const getMyProgress = async () => {
  const response = await api.get("/progress/me");
  return response.data;
};