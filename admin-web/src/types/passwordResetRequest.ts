export interface PasswordResetRequest {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  purpose: "ADMIN_ASSISTED" | string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    isBanned: boolean;
  };
}
