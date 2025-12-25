import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from "axios";
import { authApiClient } from "./auth.api";
import { storage } from "../utils/storage";

const axiosAdmin: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ví dụ: http://localhost:3000/api
});

let isRefreshing = false;
let failedQueue: ((token?: string) => void)[] = [];

const processQueue = (token?: string) => {
  failedQueue.forEach((cb) => cb(token));
  failedQueue = [];
};

// attach token trước khi request
axiosAdmin.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// handle 401 response
axiosAdmin.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // nếu 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        storage.clearAdmin();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push((token?: string) => {
            if (token && originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosAdmin(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await authApiClient.refresh(refreshToken);
        const { accessToken, refreshToken: newRefreshToken } =
          res.data.data;

        storage.setAccessToken(accessToken);
        storage.setRefreshToken(newRefreshToken);

        if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(accessToken);

        return axiosAdmin(originalRequest);
      } catch (err) {
        processQueue();
        storage.clearAdmin();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAdmin;
