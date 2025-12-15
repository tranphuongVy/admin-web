import { storage } from "./storage";

export function isAdminLoggedIn(): boolean {
  return !!storage.getAccessToken();
}
