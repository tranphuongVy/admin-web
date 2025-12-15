export type User = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: "ADMIN" | "USER" | "MODERATOR";
  isEmailVerified: boolean;
  isBanned: boolean;
  isOnline: boolean | null;
  lastSeenAt: Date | null;
  createdAt: Date;
};
