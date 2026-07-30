import api from "./api";
import { getModulesByCareer } from "./moduleService";
import { getMyProgress } from "./progressService";

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

export { getModulesByCareer, getMyProgress };