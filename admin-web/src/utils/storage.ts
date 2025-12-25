const ADMIN_ACCESS_TOKEN = "adminAccessToken";
const ADMIN_REFRESH_TOKEN = "adminRefreshToken";
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setCookie(name: string, value: string, maxAge = DEFAULT_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));

  if (!match) return null;
  return decodeURIComponent(match.split("=")[1] ?? "");
}

function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export const storage = {
  getAccessToken() {
    return getCookie(ADMIN_ACCESS_TOKEN);
  },

  setAccessToken(token: string) {
    setCookie(ADMIN_ACCESS_TOKEN, token);
  },

  getRefreshToken() {
    return getCookie(ADMIN_REFRESH_TOKEN);
  },

  setRefreshToken(token: string) {
    setCookie(ADMIN_REFRESH_TOKEN, token);
  },

  clearAdmin() {
    removeCookie(ADMIN_ACCESS_TOKEN);
    removeCookie(ADMIN_REFRESH_TOKEN);
  },
};
