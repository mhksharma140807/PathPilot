import api from "./api";

export const getMyProgress = async () => {
  const response = await api.get("/progress/me");
  return response.data;
};

export const updateModuleProgress = async (moduleId, progressPercentage, status) => {
  const clamped = Math.min(Math.max(Number(progressPercentage) || 0, 0), 100);
  const computedStatus =
    status || (clamped >= 100 ? "completed" : clamped > 0 ? "in_progress" : "not_started");
  const response = await api.put("/progress/module", {
    moduleId,
    progressPercentage: clamped,
    status: computedStatus,
  });
  return response.data;
};
