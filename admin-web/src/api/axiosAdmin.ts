import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";

const axiosAdmin: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3000/api
});

/**
 * Attach access token
 */
// axiosAdmin.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem("adminAccessToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );
axiosAdmin.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("adminAccessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Handle 401 – token expired
 */
axiosAdmin.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      //window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosAdmin;
