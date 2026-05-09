import axios from 'axios';

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // SKIP REFRESH API ITSELF
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {

      originalRequest._retry = true;

      try {

        await api.post("/auth/refresh");

        return api(originalRequest);

      } catch (refreshError) {

        localStorage.clear();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);