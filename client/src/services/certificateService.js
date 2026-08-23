import api from "./api";

/**
 * Claim or issue a career certificate upon 100% completion
 * POST /api/certificates/claim
 */
export const claimCertificate = async () => {
  const response = await api.post("/certificates/claim");
  return response.data;
};

/**
 * Fetch all certificates earned by the authenticated student
 * GET /api/certificates/my-certificates
 */
export const getMyCertificates = async () => {
  const response = await api.get("/certificates/my-certificates");
  return response.data;
};

/**
 * Public endpoint to verify certificate authenticity by certificateId
 * GET /api/certificates/verify/:certificateId
 */
export const verifyCertificate = async (certificateId) => {
  const response = await api.get(`/certificates/verify/${certificateId}`);
  return response.data;
};
