import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ví dụ: http://localhost:3000/api
});

export const authApiClient = {
  login(email: string, password: string) {
    return authApi.post("/auth/login", { email, password });
  },
  refresh(refreshToken: string) {
    return authApi.post("/auth/refresh", { refreshToken });
  },
};
