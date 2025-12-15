const ADMIN_ACCESS_TOKEN = "adminAccessToken";
const ADMIN_REFRESH_TOKEN = "adminRefreshToken";

export const storage = {
  getAccessToken() {
    return localStorage.getItem(ADMIN_ACCESS_TOKEN);
  },

  setAccessToken(token: string) {
    localStorage.setItem(ADMIN_ACCESS_TOKEN, token);
  },

  getRefreshToken() {
    return localStorage.getItem(ADMIN_REFRESH_TOKEN);
  },

  setRefreshToken(token: string) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN, token);
  },

  clearAdmin() {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN);
    localStorage.removeItem(ADMIN_REFRESH_TOKEN);
  },
};
