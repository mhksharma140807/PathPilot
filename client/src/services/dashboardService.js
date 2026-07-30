import api from "./api";

export const getStudentDashboard = async () => {
  const response = await api.get("/dashboard/student");
  return response.data;
};

// const API_URL = "http://localhost:5000/api";

// export const getStudentDashboard = async (token) => {
//   const response = await fetch(`${API_URL}/dashboard/student`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to load dashboard");
//   }

//   return data;
// };