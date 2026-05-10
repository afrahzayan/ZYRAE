import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {

  failedQueue.forEach((promise) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }

  });

  failedQueue = [];
};

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {

      const skipRoutes = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
        "/auth/logout",
      ];

      const shouldSkip = skipRoutes.some((route) =>
        originalRequest.url?.includes(route)
      );

      if (shouldSkip) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // WAIT FOR REFRESH
      if (isRefreshing) {

        return new Promise((resolve, reject) => {

          failedQueue.push({ resolve, reject });

        }).then(() => api(originalRequest));

      }

      isRefreshing = true;

      try {

        await axios.post(
          "http://localhost:4000/api/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        processQueue();

        return api(originalRequest);

      } catch (refreshError) {

        processQueue(refreshError);

        return Promise.reject(refreshError);

      } finally {

        isRefreshing = false;

      }
    }

    return Promise.reject(error);
  }
);