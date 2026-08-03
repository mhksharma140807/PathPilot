/**
 * Safe Centralized LocalStorage Utility for Auth & User Data
 */

export const getStoredToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  } catch {
    // Ignore storage write errors
  }
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  } catch {
    // Ignore storage write errors
  }
};

export const clearAuthSession = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch {
    // Ignore storage clear errors
  }
};
