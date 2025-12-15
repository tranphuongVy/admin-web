import axios from "axios";

const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3000/api
});

/**
 * Gắn access token vào header
 */
axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminAccessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Handle 401 – token hết hạn
 */
axiosAdmin.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosAdmin;
